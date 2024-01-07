package controllers

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/imon-misl/mir-summery-backend/configs"
	"github.com/imon-misl/mir-summery-backend/helper"
	"github.com/imon-misl/mir-summery-backend/models"
	"gorm.io/gorm"
)

func CreateParagraph(c *gin.Context) {

	var body struct {
		Lang        string `json:"lang"`
		Title       string `json:"title"`
		Description string `json:"description"`
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Could not parse input.Try again!",
		})

		return
	}

	paragraph := models.Paragraph{
		Lang:        body.Lang,
		Title:       body.Title,
		Description: body.Description,
	}
	paragraph.ID = uuid.New()

	result := configs.DB.Create(&paragraph)

	if result.Error == nil {
		c.JSON(http.StatusOK, gin.H{
			"message": "Article creation successful.",
		})

		return
	}

	c.JSON(http.StatusBadRequest, gin.H{
		"message": "Could not create the article.",
	})

}

func GetParagraphs(c *gin.Context) {
	if user, ok := c.Get("user"); ok {
		if paragraphs, err := helper.FindParagraphs(user.(models.User).ID); err == nil {
			c.JSON(http.StatusOK, gin.H{
				"paragraphs": paragraphs,
			})

			return
		} else {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "OOps! Could not fetch articles.",
			})

			return
		}
	} else {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Your token is expired.",
		})
	}
}

func GetSummeries(c *gin.Context) {
	if user, ok := c.Get("user"); ok {
		if user.(models.User).Role == "admin" {
			entity := c.Query("type")
			id := c.Query("id")
			item := c.Query("item")

			if entity == "User" {
				if item == "all" {
					var summeries []models.Summery
					if err := configs.DB.Preload("Paragraph").Select("id", "paragraph_id", "user_id", "prsummery").Where("user_id = ?", id).Find(&summeries).Error; err != nil {
						c.JSON(http.StatusNotFound, gin.H{
							"message": "No Summeries Found.",
						})

						return
					}
					response := helper.MakeUserSummeryResponse(summeries, id)
					c.JSON(http.StatusOK, response)
					return
				}

				var summeries []models.Summery
				if err := configs.DB.Preload("Paragraph").Select("paragraph_id", "user_id", "prsummery").Where("user_id = ? AND paragraph_id = ?", id, item).Find(&summeries).Error; err != nil {
					c.JSON(http.StatusNotFound, gin.H{
						"message": "No Summeries Found.",
					})

					return
				}

				response := helper.MakeUserSummeryResponse(summeries, id)
				fmt.Println(response)
				c.JSON(http.StatusOK, response)
				return

			} else {
				if item == "all" {
					var summeries []models.Summery
					if err := configs.DB.Preload("Paragraph").Preload("User").Select("user_id", "paragraph_id", "prsummery").Where("paragraph_id = ?", id).Find(&summeries).Error; err != nil {
						c.JSON(http.StatusNotFound, gin.H{
							"message": "No Summeries Found.",
						})
						return
					}

					response := helper.MakeParagraphSummeryResponse(summeries)
					c.JSON(http.StatusOK, response)
					return
				}

				var summeries []models.Summery
				if err := configs.DB.Preload("Paragraph").Preload("User").Select("user_id", "paragraph_id", "prsummery").Where("paragraph_id = ? AND user_id = ?", id, item).Find(&summeries).Error; err != nil {
					c.JSON(http.StatusNotFound, gin.H{
						"message": "No Summeries Found.",
					})
					return
				}

				response := helper.MakeParagraphSummeryResponse(summeries)
				c.JSON(http.StatusOK, response)
				return

			}

		} else {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": "You are unauthorized for this operation.",
			})
			return
		}
	} else {
		c.JSON(http.StatusForbidden, gin.H{
			"message": "Your token is expired",
		})
	}
}

func GetUserSummaries(c *gin.Context) {
	if user, ok := c.Get("user"); ok {
		if user.(models.User).Role == "admin" {
			userIdString := c.Query("user_id")
			user_id, err := uuid.Parse(userIdString)

			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
				return
			}

			var user models.User
			if err = configs.DB.Where("id = ?", user_id).Preload("Summeries.Paragraph").First(&user).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user summeries"})
				return
			}

			summeries := make([]models.UserWiseSummeryResponse, 0)

			for _, s := range user.Summeries {
				summery := models.UserWiseSummeryResponse{
					ParagraphID:   s.ParagraphID,
					PrTitle:       s.Paragraph.Title,
					SummeryID:     s.ID,
					SmDescription: s.Prsummery,
				}
				summeries = append(summeries, summery)
			}

			c.JSON(http.StatusOK, gin.H{
				"summeries": summeries,
			})

		} else {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": "You are unauthorized.",
			})

			return
		}
	} else {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Your token is expired.",
		})
	}
}

func SummerySubmit(c *gin.Context) {
	if user, ok := c.Get("user"); ok {
		user_id := user.(models.User).ID

		var body struct {
			ParagraphID uuid.UUID `json:"paragraph_id"`
			Prsummery   string    `json:"prsummery"`
		}

		if c.Bind(&body) != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "Bad request",
			})

			return
		}

		//transaction begin
		tx := configs.DB.Begin()

		summery := models.Summery{
			UserID:      user_id,
			ParagraphID: body.ParagraphID,
			Prsummery:   body.Prsummery,
		}
		summery.ID = uuid.New()

		tx.Create(&summery)

		var srCount models.SummeryCount
		if err := configs.DB.Where("user_id = ? AND paragraph_id = ?", user_id, body.ParagraphID).First(&srCount).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				summeryCount := models.SummeryCount{
					UserID:      user_id,
					ParagraphID: body.ParagraphID,
					Count:       1,
				}
				summeryCount.ID = uuid.New()

				tx.Create(&summeryCount)
				tx.Commit()
				c.JSON(http.StatusOK, gin.H{
					"message": "Summery successfully submitted.",
				})
				return

			} else {
				tx.Rollback()
				c.JSON(http.StatusBadRequest, gin.H{
					"message": "Could not submit the summery.",
				})
				return
			}
		}
		cnt := srCount.Count + 1
		tx.Model(&srCount).Update("Count", cnt)
		tx.Commit()
		fmt.Println("second===")
		c.JSON(http.StatusOK, gin.H{
			"message": "Summery successfully submitted.",
		})
		return

	} else {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Your token is expired.",
		})
	}

}
