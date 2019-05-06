package main

import (
	"io/ioutil"
	"log"
	"net/http"
	"encoding/json"
	"time"
)

// Messages ...
type Messages struct {
	Messages map[string]Message `json:"messages,omitempty"`
}

// Message ...
type Message struct {
	DisplayName    string `json:"displayName,omitempty"`
	DisplayMessage string `json:"displayMessage,omitempty"`
	Published      time.Time `json:"published,omitempty"`
}

// NewMessage ...
type NewMessage struct {
	ChannelID string `db:"channel-name"`
	DisplayName    string `db:"display_name"`
	DisplayMessage string `db:"display_message"`
	Published      time.Time `db:"published"`
}

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
				ChannelID: key,
				DisplayMessage: value.DisplayMessage,
				DisplayName: value.DisplayName,
				Published: value.Published,
			}
		log.Printf("NewMessage: %v", newMsg)
	}

		// log.Printf("Messages: %#v", m.Messages)
	})

	log.Printf("Listening on port 3030")
	http.ListenAndServe(":3030", nil)

}

func setupResponse(w *http.ResponseWriter, req *http.Request) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}
