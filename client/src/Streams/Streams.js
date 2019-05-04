/* global gapi */

import React, { Component } from 'react';
// import { Link } from 'react-router-dom';

class Streams extends Component {
    constructor(props) {
        super(props);

        this.state = {
            streams: null,
        };
    }

    viewStream = (id, name, event) => {
        event.preventDefault();
        const { history } = this.props;
        history.push({ pathname: '/video/:id', state: { key: id, name: name } });
    };

    async componentDidMount() {
        function authenticate() {
            return gapi.auth2.getAuthInstance()
                .signIn({ scope: "https://www.googleapis.com/auth/youtube.force-ssl" })
                .then(function () {
                    gapi.load('client', loadClient)
                    console.log("Sign-in successful");
                },
                    function (err) { console.error("Error signing in", err); });
        }
        function loadClient() {
            return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
                .then(function () {
                    gapi.load('client', execute);
                    console.log("GAPI client loaded for API");
                },
                    function (err) { console.error("Error loading GAPI client for API", err); });
        }
        var execute = () => {
            return gapi.client.youtube.search.list({
                "part": "snippet,id",
                "eventType": "live",
                "maxResults": 10,
                "type": "video"
            })
                .then((response) => {
                    // Handle the results here (response.result has the parsed body).
                    this.setState({ streams: response.result.items })
                    console.log("Response", response);
                },
                    function (err) { console.error("Execute error", err); });
        }
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    {this.state.streams === null && <p>Loading streams...</p>}
                    {/* {
                        this.state.streams && this.state.streams.map(question => (
                            <div key={question.id} className="col-sm-12 col-md-4 col-lg-3">
                                <Link to={`/question/${question.id}`}>
                                    <div className="card text-white bg-success mb-3">
                                        <div className="card-header">Answers: {question.answers}</div>
                                        <div className="card-body">
                                            <h4 className="card-title">{question.title}</h4>
                                            <p className="card-text">{question.description}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    } */}
                </div>
            </div>
        )
    }
}

export default Streams;