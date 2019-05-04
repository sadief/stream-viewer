/* global gapi */
import React, { Component } from 'react';


class Stream extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: props.location.state.key,
            name: props.location.state.name,
            chatId: null,
            messages: null,
        };
    }

    async componentDidMount() {
        function loadClient() {
            return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
                .then(function () {
                    gapi.load('client', execute);
                    console.log("GAPI client loaded for API");
                },
                    function (err) { console.error("Error loading GAPI client for API", err); });
    }

        var execute = () => {
            return gapi.client.youtube.videos.list({
                "part": "snippet, liveStreamingDetails",
                "id": this.state.id
            })
                .then((response) => {
                    // Handle the results here (response.result has the parsed body).
                    // console.log("Response", response);
                    this.setState({ chatId: response.result.items[0].liveStreamingDetails.activeLiveChatId })
                    gapi.load('client', getChat)
                },
                    function (err) { console.error("Execute error", err); });
        }
        var getChat = () => {
            return gapi.client.youtube.liveChatMessages.list({
                "liveChatId": this.state.chatId,
                "part": "snippet,authorDetails",
            })
                .then((response) => {
                    // Handle the results here (response.result has the parsed body).
                    console.log("Response", response);
                    this.setState({ messages: response.result.items })
                },
                    function (err) { console.error("Execute error", err); });
        }
        gapi.load("client:auth2", function () {
            gapi.auth2.init({ client_id: process.env.REACT_APP_YOUTUBE_CLIENT_ID });
        });
        gapi.load('client', loadClient)
    }

    render() {
        console.log("Current State: ", this.state)
        const { id, name, messages } = this.state;
        const live = "https://www.youtube.com/embed/" + id


        if (id === null) return <p>Loading ...</p>;
        return (
            <div className="container">
                <div className="row">
                    <div className="jumbotron col-6">
                        <h1 className="display-3">{name}</h1>
                        <hr className="my-4" />
                        <iframe width="560" height="315" src={live} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    </div>
                    <div className="jumbotron col-6">
                        <h1 className="display-3">Chat</h1>
                        <hr className="my-4" />
                        {
                            stream.answers.map((answer, idx) => (
                                <p className="lead" key={idx}>{answer.answer}</p>
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Stream;