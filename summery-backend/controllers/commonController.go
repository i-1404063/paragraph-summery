package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/imon-misl/mir-summery-backend/configs"
	"github.com/imon-misl/mir-summery-backend/models"
)

func FetchParagraphUser(c *gin.Context) {
	if _, ok := c.Get("user"); ok {

		reUsers := make([]models.UserResponse, 0)
		reParagraphs := make([]models.ParagraphResponse, 0)

		var users []models.User
		if err := configs.DB.Select("id, firstname").Where("role = ?", "app-user").Find(&users).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "Could not fetch users.",
			})
			return
		}

		var paragraphs []models.Paragraph
		if err := configs.DB.Select("id", "title").Find(&paragraphs).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "Could not fetch paragraphs.",
			})

			return
		}

		for _, obj := range users {
			user := models.UserResponse{
				ID:       obj.ID,
				Username: obj.Firstname,
			}
			reUsers = append(reUsers, user)
		}

		for _, obj := range paragraphs {
			paragraph := models.ParagraphResponse{
				ID:    obj.ID,
				Title: obj.Title,
			}
			reParagraphs = append(reParagraphs, paragraph)
		}

		response := models.UserParagraphResponse{
			Users:      reUsers,
			Paragraphs: reParagraphs,
		}

		c.JSON(http.StatusOK, gin.H{
			"res": response,
		})

	} else {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Your token is expired.",
		})

		return
	}
}
