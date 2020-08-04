import React from 'react';
import { NavLink } from 'react-router-dom';
import classes from './NavigationItem.module.css'

const navigationItem = (props) => {
    return (
        <NavLink to={props.path} exact={props.exact} className={classes.item}>{props.children}</NavLink>
    )
}

export default navigationItem;