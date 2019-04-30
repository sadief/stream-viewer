import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Home extends Component {
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="jumbotron col-12">
                        <h1 className="display-3">Stream Viewer</h1>
                        <hr className="my-4" />
                        <Link to={"/videos/"}>
                            <div className="card text-white bg-success mb-3">
                                <div className="card-header">Videos</div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;