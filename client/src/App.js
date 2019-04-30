import React, { Component } from 'react';
import Home from './Home/Home';
import NavBar from './NavBar/NavBar';
import Streams from './Streams/Streams';
import Stream from './Stream/Stream';
import { Route } from 'react-router-dom';
import Callback from './Callback';
import SecuredRoute from './SecuredRoute/SecuredRoute';

class App extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <Route path='/' component={Home} />
        <SecuredRoute path='/videos' component={Streams} />
        <SecuredRoute path='/video/:videoId' component={Stream} />
        <Route exact path='/callback' component={Callback} />
      </div>
    );
  }
}

export default App;