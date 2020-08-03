import React from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import './App.css';

import LessonBuilder from './Container/LessonBuilder/LessonBuilder';
import Dashboard from './Container/Dashboard/Dashboard'
// import Editor from './Component/Editor'

function App() {
  return (

    <BrowserRouter>
      <div className="App">
      <Switch>
      <Route path="/lessonbuilder" exact component={LessonBuilder} />
      <Route path="/" exact component={Dashboard} />
      </Switch>
      <AmplifySignOut />
      </div>
    </BrowserRouter>
  );
}

export default withAuthenticator(App);