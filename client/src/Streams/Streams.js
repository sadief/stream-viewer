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
        gapi.load("client:auth2", function () {
            gapi.auth2.init({ client_id: process.env.REACT_APP_YOUTUBE_CLIENT_ID });
        });

        gapi.load('client', authenticate);

    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    {this.state.streams === null && <p>Loading streams...</p>}
                    {
                        this.state.streams && this.state.streams.map(stream => (
                            <div key={stream.id.videoId} className="col-sm-12 col-md-4 col-lg-3">
                                {/* <Link to={`/stream/${stream.id}`}> */}
                                    <div className="card text-white bg-success mb-3">
                                    <div className="card-header"></div>
                                        <div className="card-body">
                                        <h4 className="card-title">{stream.snippet.channelTitle}</h4>
                                        <img src={stream.snippet.thumbnails.default.url} />
                                        <button type="button" className="btn btn-primary" onClick={event => this.viewStream(stream.id.videoId, stream.snippet.channelTitle, event)}
                                            type="submit">Watch</button>
                                        <p className="card-text"></p>
                                        </div>
                                    </div>
                                {/* </Link> */}
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default Streams;