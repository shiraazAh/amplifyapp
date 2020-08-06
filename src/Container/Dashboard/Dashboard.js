import React, { useState, useEffect } from 'react';
import Toolbar from '../../Component/Navigation/Toolbar/Toolbar';
import Card from '../../Component/UI/Card/Card';
import Button from '@material-ui/core/Button';
import NavigationItem from '../../Component/Navigation/NavigationItem/NavigationItem';

import { API, Storage } from 'aws-amplify';
import { listNotes } from '../../graphql/queries';
import Spinner from '../../Component/UI/Spinner/Spinner';

import classes from './Dashboard.module.css'

const Dashboard = (props) => {

    const [data, setData] = useState([]);
    const [SpinnerHandler, setSpinnerHandler] = useState(false);
    
    useEffect(() => {
        setSpinnerHandler(true);
        fetchNotes(); 
    }, []);

    async function fetchNotes() {

    // Get data from database
    const apiData = await API.graphql({ query: listNotes });
    const allData = apiData.data.listNotes.items;

    // Storing the data in variable
    let notesFromAPI = allData;

    // Parsing the JSON element
    const parsedComponent = notesFromAPI.map(note => { return {...note, 'component': JSON.parse(note.component)}});

    // If there is an image, get from storage
    // await Promise.all(parsedComponent.map(async note => {
    //   if (note.image) {
    //     const image = await Storage.get(note.image);
    //     note.image = image;
    //   }
    //   return note;
    // }))

    // Set the state to the value
    setData(parsedComponent);
    setSpinnerHandler(false);
  }
        return (
            <div className={classes.Dashboard}>
                <Toolbar></Toolbar>
                <p>Choose a Lesson Plan or <span><Button><NavigationItem path='/lessonbuilder' exact>Create Lesson Plan</NavigationItem></Button></span></p>
                <div className={classes.Cards}>
                {SpinnerHandler ? <Spinner /> : data.map(el => el.editing ? null : <Card key={el.name} title={el.name} subtitle="whatever"/>) }
                </div>
            </div>
        )
}

export default Dashboard;