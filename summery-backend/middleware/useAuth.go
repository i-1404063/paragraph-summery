package middleware

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/imon-misl/mir-summery-backend/configs"
	"github.com/imon-misl/mir-summery-backend/models"
	"net/http"
	"os"
)

func UseAuth(c *gin.Context) {
	tokenString := c.Request.Header.Get("auth-x-token")

	token, err := jwt.Parse(string(tokenString), func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "Your token is expired.",
		})

		return
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		var user models.User
		err := configs.DB.First(&user, "id = ?", claims["id"]).Error
		if err != nil {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}
		c.Set("user", user)
		c.Next()

	} else {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Your token is expired.",
		})
		return
	}

}
