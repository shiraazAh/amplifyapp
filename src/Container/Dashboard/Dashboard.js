import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Toolbar from '../../Component/Navigation/Toolbar/Toolbar';
import Card from '../../Component/UI/Card/Card';

import classes from './Dashboard.module.css'

class Dashboard extends Component {
    render() {
        return (
            <div className={classes.Dashboard}>
                <Toolbar></Toolbar>
                <p>Choose a Lesson Plan</p>
                <NavLink to='/lessonbuilder' exact>Create</NavLink>
                <div className={classes.Cards}>
                <Card />
                <Card />
                <Card />
                </div>
            </div>
        )
    }
}

export default Dashboard;