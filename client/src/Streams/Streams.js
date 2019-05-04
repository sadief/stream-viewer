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

    async componentDidMount() {
        function authenticate() {
            return gapi.auth2.getAuthInstance()
                .signIn({ scope: "https://www.googleapis.com/auth/youtube.force-ssl" })
                .then(function () { console.log("Sign-in successful"); },
                    function (err) { console.error("Error signing in", err); });
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