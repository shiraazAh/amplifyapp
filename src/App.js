import React from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import classes from './App.module.css';

import LessonBuilder from './Container/LessonBuilder/LessonBuilder';
import Dashboard from './Container/Dashboard/Dashboard'
// import Editor from './Component/Editor'

function App() {
  return (

    <BrowserRouter>
      <div className={classes.App}>
      <Switch>
      <Route path="/lessonbuilder" exact component={LessonBuilder} />
      <Route path="/" exact component={Dashboard} />
      </Switch>
      </div>
    </BrowserRouter>
  );
}

export default withAuthenticator(App);