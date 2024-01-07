package configs

import "github.com/imon-misl/mir-summery-backend/models"

func MigrateDb() {
	DB.AutoMigrate(&models.User{}, &models.Paragraph{}, &models.Summery{}, &models.SummeryCount{})
}
