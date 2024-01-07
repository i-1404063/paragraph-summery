package configs

import (
	_ "github.com/lib/pq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
	"os"
)

var DB *gorm.DB

func Connect() {
	var err error

	// host := os.Getenv("DB_HOST")
	// port := os.Getenv("DB_PORT")
	// user := os.Getenv("DB_USER")
	// dbname := os.Getenv("DB_NAME")
	// password := os.Getenv("DB_PASSWORD")

	// connStr := fmt.Sprintf("host=%s user=%s dbname=%s port=%s password=%s",
	// 	host, user, dbname, port, password)

	DB, err = gorm.Open(postgres.Open(os.Getenv("CON_STRING")), &gorm.Config{
		SkipDefaultTransaction: true,
		TranslateError:         true,
	})

	if err != nil {
		panic("Could not connect to db.")
	}
	log.Println("Successfully Connected to DB.")
}
