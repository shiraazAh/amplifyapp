import React, { Component } from 'react';
import Toolbar from '../../Component/Navigation/Toolbar/Toolbar';
import Card from '../../Component/UI/Card/Card';
import Button from '@material-ui/core/Button';
import NavigationItem from '../../Component/Navigation/NavigationItem/NavigationItem';

import classes from './Dashboard.module.css'

class Dashboard extends Component {
    render() {
        return (
            <div className={classes.Dashboard}>
                <Toolbar></Toolbar>
                <p>Choose a Lesson Plan or <span><Button><NavigationItem path='/lessonbuilder' exact>Create Lesson Plan</NavigationItem></Button></span></p>
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