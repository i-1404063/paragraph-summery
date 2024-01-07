package models

import (
	"github.com/google/uuid"
)

type LoginResponse struct {
	Authtoken string `json:"auth-x-token"`
	Username  string `json:"username"`
	Role      string `json:"role"`
}

type ParagraphResponse struct {
	ID          uuid.UUID `json:"id"`
	Count       int       `json:"cnt"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
}

type UserWiseSummeryResponse struct {
	ParagraphID   uuid.UUID `json:"pr_id"`
	PrTitle       string    `json:"pr_title"`
	SummeryID     uuid.UUID `json:"sm_id"`
	SmDescription string    `json:"sm_description"`
}

type UserResponse struct {
	ID       uuid.UUID `json:"id"`
	Username string    `json:"username"`
}

type UserParagraphResponse struct {
	Users      []UserResponse      `json:"users"`
	Paragraphs []ParagraphResponse `json:"paragraphs"`
}

type SummeryResponseUser struct {
	UserID      string    `json:"user_id"`
	ParagraphID uuid.UUID `json:"pr_id"`
	Title       string    `json:"title"`
	Prsummery   string    `json:"sm_description"`
}

type SummeryResponseParagraph struct {
	ParagraphID uuid.UUID `json:"pr_id"`
	Title       string    `json:"title"`
	Username    string    `json:"username"`
	Prsummery   string    `json:"sm_description"`
}
