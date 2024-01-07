package helper

import (
	"github.com/google/uuid"
	"github.com/imon-misl/mir-summery-backend/configs"
	"github.com/imon-misl/mir-summery-backend/models"
)

func FindParagraphs(user_id uuid.UUID) ([]models.ParagraphResponse, error) {
	var prgraphs []models.Paragraph
	var smCounts []models.SummeryCount
	paragraphs := make([]models.ParagraphResponse, 0)

	configs.DB.Select("id, title, description").Where("lang = ?", "Bangla").Find(&prgraphs)
	configs.DB.Where("user_id = ?", user_id).Find(&smCounts)

	secondMap := make(map[uuid.UUID]int)

	for _, obj := range smCounts {
		secondMap[obj.ParagraphID] = obj.Count
	}

	for _, obj := range prgraphs {
		if count, found := secondMap[obj.ID]; found && count < 2 {
			simplified := models.ParagraphResponse{
				ID:          obj.ID,
				Count:       count,
				Title:       obj.Title,
				Description: obj.Description,
			}
			paragraphs = append(paragraphs, simplified)
		} else {
			paragraphs = append(paragraphs, models.ParagraphResponse{
				ID:          obj.ID,
				Count:       0,
				Title:       obj.Title,
				Description: obj.Description,
			})
		}
	}

	return paragraphs, nil
}
