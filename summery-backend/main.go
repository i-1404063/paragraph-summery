package main

import (
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/imon-misl/mir-summery-backend/configs"
	"github.com/imon-misl/mir-summery-backend/controllers"
	"github.com/imon-misl/mir-summery-backend/middleware"
)

func init() {
	configs.Connect()   // db connection
	configs.MigrateDb() //db migration
}

func main() {
	gin.SetMode(os.Getenv("GIN_MODE"))
	router := gin.Default()
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}
	config.AllowCredentials = true
	config.AllowHeaders = append(config.AllowHeaders, "auth-x-token")
	router.Use(cors.New(config))
	router.POST("/login", controllers.SignIn)
	router.POST("/signup", controllers.Signup)
	router.POST("/create-paragraph", middleware.UseAuth, controllers.CreateParagraph)
	router.POST("/summery-submit", middleware.UseAuth, controllers.SummerySubmit)
	router.GET("/get-paragraphs", middleware.UseAuth, controllers.GetParagraphs)
	router.GET("/get-summery", middleware.UseAuth, controllers.GetSummeries)
	router.GET("/user-summeries", middleware.UseAuth, controllers.GetUserSummaries)
	router.GET("/get-userparagraph", middleware.UseAuth, controllers.FetchParagraphUser)
	router.Run(":8080")
}
