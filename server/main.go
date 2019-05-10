package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
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
	DB_USER     = "chats"
	DB_PASSWORD = "chats"
	DB_NAME     = "streamchat"
)

func main() {
	http.HandleFunc("/messages", func(w http.ResponseWriter, r *http.Request) {
		setupResponse(&w, r)
		if (*r).Method == "OPTIONS" {
			return
		}

		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			panic(err)
		}

		log.Printf(string(body))

		var m Messages
		err = json.Unmarshal(body, &m)
		if err != nil {
			panic(err)
		}

		for key, value := range m.Messages {
			var newMsg = NewMessage{
				ID:             key,
				ChatID:         value.ChatID,
				DisplayMessage: value.DisplayMessage,
				DisplayName:    value.DisplayName,
				Published:      value.Published,
			}

			log.Printf("NewMessage: %v", newMsg)

			dbinfo := fmt.Sprintf("user=%s password=%s dbname=%s sslmode=disable host=localhost port=5432",
				DB_USER, DB_PASSWORD, DB_NAME)
			log.Printf("DB: %v", dbinfo)

			db, err := sql.Open("postgres", dbinfo)
			if err != nil {
				fmt.Errorf("Error opening db: %v", err)
			}
			defer db.Close()

			fmt.Println("# Inserting values")
			var lastInsertId string
			err = db.QueryRow("insert into messages (id, chat_id, display_name, display_message, published) values ($1,$2,$3,$4,$5) on conflict do nothing returning chat_id;", newMsg.ID, newMsg.ChatID, newMsg.DisplayName, newMsg.DisplayMessage, newMsg.Published).Scan(&lastInsertId)
			if err != nil {
				fmt.Errorf("Error inserting into db: %v", err)
			}
			fmt.Println("last inserted id =", lastInsertId)
		}

	})

	log.Printf("Listening on port 3030")
	http.ListenAndServe(":3030", nil)

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
