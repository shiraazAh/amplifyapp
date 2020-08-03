import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Dashboard extends Component {
    render() {
        return (
            <div>
                <p>Click below to create</p>
                <NavLink to='/lessonbuilder' exact>Create</NavLink>

                <ul>
                    <li></li>
                </ul>
            </div>
        )
    }
}

export default Dashboard;