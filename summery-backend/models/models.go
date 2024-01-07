package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	ID            uuid.UUID `gorm:"type:uuid"`
	Firstname     string    `gorm:"type:varchar(255);not null"`
	Lastname      string    `gorm:"type:varchar(255);not null"`
	Role          string    `gorm:"type:varchar(255);not null"`
	Email         string    `gorm:"uniqueIndex;not null"`
	Password      string    `gorm:"not null"`
	Summeries     []Summery
	SummeryCounts []SummeryCount
}

type Paragraph struct {
	gorm.Model
	ID            uuid.UUID `gorm:"type:uuid"`
	Lang          string    `gorm:"type:varchar(255)"`
	Title         string    `gorm:"type:varchar(255);not null"`
	Description   string
	Summeries     []Summery
	SummeryCounts []SummeryCount
}

type Summery struct {
	gorm.Model
	ID          uuid.UUID `gorm:"type:uuid"`
	UserID      uuid.UUID `gorm:"type:uuid"`
	User        User      `gorm:"foreignKey:UserID"`
	ParagraphID uuid.UUID `gorm:"type:uuid"`
	Paragraph   Paragraph `gorm:"foreignKey:ParagraphID"`
	Prsummery   string
}

type SummeryCount struct {
	gorm.Model
	ID          uuid.UUID `gorm:"type:uuid"`
	UserID      uuid.UUID `gorm:"type:uuid"`
	User        User      `gorm:"foreignKey:UserID"`
	ParagraphID uuid.UUID `gorm:"type:uuid"`
	Paragraph   Paragraph `gorm:"foreignKey:ParagraphID"`
	Count       int
}
