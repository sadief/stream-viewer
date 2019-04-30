import React, { Component } from 'react';

class Stream extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stream: null,
        };
    }

    async componentDidMount() {
        // const { match: { params } } = this.props;
        // const stream = (await axios.get(`http://localhost:8081/${params.streamId}`)).data;
        // this.setState({
        //     stream,
        // });
    }

    render() {
        const { stream } = this.state;
        if (stream === null) return <p>Loading ...</p>;
        return (
            <div className="container">
                <div className="row">
                    <div className="jumbotron col-12">
                        <h1 className="display-3">{stream.title}</h1>
                        <p className="lead">{stream.description}</p>
                        <hr className="my-4" />
                        <p>Answers:</p>
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