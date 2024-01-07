FROM golang:1.20.5-alpine3.18 AS builder

WORKDIR /app
COPY go.mod .
COPY go.sum .

RUN go mod download

COPY . .
RUN CGO_ENABLED=O GOOS=linux go build -o bin .

FROM alpine:latest
WORKDIR /app

COPY --from=builder /app/bin /app
EXPOSE 8080

CMD ["/app/bin"]

