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
