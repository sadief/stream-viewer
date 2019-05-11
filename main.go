package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"

	_ "github.com/lib/pq"
)

// Messages ...
type Messages struct {
	Messages map[string]Message `json:"messages,omitempty"`
}

// Message ...
type Message struct {
	ChatID         string    `json:"chatID"`
	DisplayName    string    `json:"displayName,omitempty"`
	DisplayMessage string    `json:"displayMessage,omitempty"`
	Published      time.Time `json:"published,omitempty"`
}

// NewMessage ...
type NewMessage struct {
	ID             string    `db:"id"`
	ChatID         string    `db:"chat_id"`
	DisplayName    string    `db:"display_name"`
	DisplayMessage string    `db:"display_message"`
	Published      time.Time `db:"published"`
}

const (
	DB_USER     = "ntcsghcnogrqug"
	DB_PASSWORD = "a789ee38d86cefbb9a14f1d3f8f283ef1401efd9f23823d3c583c071ae6361d7"
	DB_NAME     = "d95989onu495rr"
)

func main() {
	http.HandleFunc("/messages", func(w http.ResponseWriter, r *http.Request) {
		setupResponse(&w, r)
		if (*r).Method == "OPTIONS" {
			return
		}

		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			log.Printf("Error Reading input: %v", err)
		}

		log.Printf(string(body))

		var m Messages
		err = json.Unmarshal(body, &m)
		if err != nil {
			log.Printf("Error unmarshalling: %v", err)
		}
		log.Printf("Messages: %v", m)

		for key, value := range m.Messages {
			log.Printf("key: %v", key)
			var newMsg = NewMessage{
				ID:             key,
				ChatID:         value.ChatID,
				DisplayMessage: value.DisplayMessage,
				DisplayName:    value.DisplayName,
				Published:      value.Published,
			}

			log.Printf("NewMessage: %v", newMsg)

			db, err := sql.Open("postgres", os.Getenv("postgres://ntcsghcnogrqug:a789ee38d86cefbb9a14f1d3f8f283ef1401efd9f23823d3c583c071ae6361d7@ec2-54-235-167-210.compute-1.amazonaws.com:5432/d95989onu495rr"))
			if err != nil {
				log.Printf("Error opening db: %v", err)
			}
			log.Printf("Connected to the database!")
			defer db.Close()

			fmt.Println("# Inserting values")
			var lastInsertId string
			fmt.Printf("insert into messages (id, chat_id, display_name, display_message, published) values ('%v','%v','%v','%v','%v') on conflict do nothing returning chat_id;", newMsg.ID, newMsg.ChatID, newMsg.DisplayName, newMsg.DisplayMessage, newMsg.Published)
			err = db.QueryRow("insert into messages (id, chat_id, display_name, display_message, published) values ($1,$2,$3,$4,$5) on conflict do nothing returning chat_id;", newMsg.ID, newMsg.ChatID, newMsg.DisplayName, newMsg.DisplayMessage, newMsg.Published).Scan(&lastInsertId)
			if err != nil {
				fmt.Errorf("Error inserting into db: %v", err)
			}
			fmt.Println("last inserted id =", lastInsertId)
		}

	})

	port := os.Getenv("PORT")
	if port == "" {
		port = ":3030"
	}

	log.Printf("Listening on port %v", port)
	http.ListenAndServe(port, nil)

}

func setupResponse(w *http.ResponseWriter, req *http.Request) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}

func checkErr(err error) {
	if err != nil {
		panic(err)
	}
}
