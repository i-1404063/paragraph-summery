package controllers

import (
	"errors"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/imon-misl/mir-summery-backend/configs"
	"github.com/imon-misl/mir-summery-backend/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func SignIn(c *gin.Context) {
	var body struct {
		Email    string
		Password string
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Bad Request",
		})

		return
	}

	var user models.User
	err := configs.DB.First(&user, "email = ?", body.Email).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "Invalid Email or Password.",
			})

			return
		}
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Wrong Password.",
		})

		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":       user.ID,
		"role":     user.Role,
		"username": user.Firstname,
		"exp":      time.Now().Add(50 * time.Minute).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Something went wrong. Try again!",
		})

		return
	}

	logResponse := models.LoginResponse{
		Authtoken: tokenString,
		Username:  user.Firstname,
		Role:      user.Role,
	}

	c.JSON(http.StatusOK, gin.H{
		"auth": logResponse,
	})

}

func Signup(c *gin.Context) {
	var body struct {
		Firstname string `json:"firstname"`
		Lastname  string `json:"lastname"`
		Role      string `json:"role"`
		Email     string `json:"email"`
		Password  string `json:"password"`
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Bad request",
		})

		return
	}

	var user models.User
	result := configs.DB.Where("email = ?", body.Email).First(&user)
	if result.Error == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Email already exist.",
		})
		return
	}

	Hash, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Something went wrong.",
		})
		return
	}
	newuser := models.User{
		Firstname: body.Firstname,
		Lastname:  body.Lastname,
		Role:      body.Role,
		Email:     body.Email,
		Password:  string(Hash),
	}
	newuser.ID = uuid.New()
	result = configs.DB.Create(&newuser)

	if result.Error == nil {
		c.JSON(http.StatusOK, gin.H{
			"message": "User creation successful.",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Could not create user.",
	})

}

func Validate(c *gin.Context) {

	c.JSON(http.StatusOK, gin.H{
		"message": "Validation successful",
	})
}
