package helper

import (
	"github.com/imon-misl/mir-summery-backend/models"
)

func MakeUserSummeryResponse(summeries []models.Summery, id string) (response []models.SummeryResponseUser) {
	response = make([]models.SummeryResponseUser, 0)
	for _, obj := range summeries {
		summery := models.SummeryResponseUser{
			UserID:      id,
			ParagraphID: obj.ParagraphID,
			Title:       obj.Paragraph.Title,
			Prsummery:   obj.Prsummery,
		}

		response = append(response, summery)
	}

	return
}

func MakeParagraphSummeryResponse(summeries []models.Summery) (response []models.SummeryResponseParagraph) {
	response = make([]models.SummeryResponseParagraph, 0)
	for _, obj := range summeries {
		summery := models.SummeryResponseParagraph{
			ParagraphID: obj.ParagraphID,
			Title:       obj.Paragraph.Title,
			Prsummery:   obj.Prsummery,
			Username:    obj.User.Firstname,
		}

		response = append(response, summery)
	}

	return
}
