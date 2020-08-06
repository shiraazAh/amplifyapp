import React, { useState, useEffect } from 'react';
import { API, Storage } from 'aws-amplify';
import { listNotes} from '../../graphql/queries';
import { createNote as createNoteMutation ,deleteNote as deleteNoteMutation, updateNote as updateNoteMutation } from '../../graphql/mutations';
import Spinner from '../../Component/UI/Spinner/Spinner';
import Modal from '../../Component/UI/Modal/CreateModeModal';

import '../../App.module.css';
import classes from './LessonBuilder.module.css';
import Button from '@material-ui/core/Button';

// import Editor from './Component/Editor'

const initialFormState = { name: '', description: '', title: ''};
const initialLessonState = {name: '', editing: true, component: []}
let Id = 0;

const LessonBuilder = (props) => {
  const [notes, setNotes] = useState({id:'', name: '', editing: true, component: []});
  const [lessonData, setLessonData] = useState(initialLessonState);
  const [formData, setFormData] = useState(initialFormState);
  
  const [SpinnerHandler, setSpinnerHandler] = useState(true);
  const [modalState, setModal] = useState(true);

  // const handleOpen = () => {
  //   setOpen(true);
  // };


  // useEffect(() => {
  //   if(!modalState) {
  //     fetchNotes(); 
  //   }
  // }, [modalState]);

  async function onChange(e) {
    if (!e.target.files[0]) return
    const file = e.target.files[0];
    setFormData({ ...formData, image: file.name });
    await Storage.put(file.name, file);
    fetchNotes();
  }

  async function fetchNotes() {

    // Get data from database
    const apiData = await API.graphql({ query: listNotes });
    const allData = apiData.data.listNotes.items;

    for(let obj of allData){
        obj.createdAt = obj.createdAt.replace(/[-T:.Z]/g, '');
      }
    
      let largest = allData[0].createdAt;
      let notesFromAPI = [];
      for (var i = 0; i < allData.length; i++) {
          if (largest < allData[i].createdAt ) {
              largest = allData[i].createdAt;
              // Storing the data in variable
              notesFromAPI = allData[i];
          }
      }
  
    // Parsing the JSON element
    const parsedComponent = JSON.parse(notesFromAPI.component);
    notesFromAPI.component = parsedComponent;

    // If there is an image, get from storage
    await Promise.all(parsedComponent.map(async note => {
      if (note.image) {
        const image = await Storage.get(note.image);
        note.image = image;
      }
      return note;
    }))

    // Set the state to the value
    setNotes(notesFromAPI);
    setSpinnerHandler(false);

  }

  async function createNote() {
    if (!lessonData.name) return;
    lessonData.component = JSON.stringify(lessonData.component);
    await API.graphql({ query: createNoteMutation, variables: { input: lessonData } });
    if (formData.image) {
      const image = await Storage.get(formData.image);
      formData.image = image;
    }

    lessonData.component = JSON.parse(lessonData.component);
    fetchNotes();
    setLessonData(initialFormState);
    setModal(false);
  }



// Funtion to update the data
  async function updateNote() {
    // Only allow to run the function if there is no name or description 
    if (!formData.name || !formData.description) return;
    let newArr = notes;
    const newForm = formData;

    // Add an new Id to all Elements
    newForm.id = Id;
    Id = Id + 1;
    
    // Add the new form to the component array and convert to JSON
    newArr.component.push(newForm);
    newArr.component = JSON.stringify(newArr.component);

    // Delete createdAt and updatedAt and createdAt as it is unwanted in updating element
    delete newArr.createdAt;
    delete newArr.updatedAt;

    // Send the new updated version to the data base
    await API.graphql({ query: updateNoteMutation, variables: { input: newArr } });

    // Alert to show its done
    alert("Edited");

    // Parse JSON and save the new element to the state
    newArr.component = JSON.parse(newArr.component);
    setNotes(newArr);

    // Set formData to initial state
    setFormData(initialFormState);
  }

  async function updateEditing() {

    const newArr = notes;

    newArr.editing = false;

    newArr.component = JSON.stringify(newArr.component);
    // Delete createdAt and updatedAt and createdAt as it is unwanted in updating element
    delete newArr.createdAt;
    delete newArr.updatedAt;

    // Send the new updated version to the data base
    await API.graphql({ query: updateNoteMutation, variables: { input: newArr } });

    // Alert to show its done
    alert("Done");

    // Parse JSON and save the new element to the state
    newArr.component = JSON.parse(newArr.component);
    setNotes(newArr);

    // Set formData to initial state
    setFormData(initialFormState);

    props.history.replace('/');
  }

// Function to delete data
  async function deleteComponent(item) {
    // Get the current data from the state
    let newArrAfterDelete = notes;

    // Filter the element and only create an array of needed elements
    const newComp = newArrAfterDelete.component.filter(i => i.name !== item.name);
    newArrAfterDelete.component = JSON.stringify(newComp);

    // Delete createdAt and updatedAt and createdAt as it is unwanted in updating element
    delete newArrAfterDelete.createdAt;
    delete newArrAfterDelete.updatedAt;

    // Update the database with new updated data
    await API.graphql({ query: updateNoteMutation, variables: { input: newArrAfterDelete } });

    // Alert to show its done
    alert("Deleted");

    // Set the new updated component element to the state
    setNotes({id: newArrAfterDelete.id, name: newArrAfterDelete.name, component: newComp});

  }


  // async function deleteNote({ id }) {
  //   const newNotesArray = notes.component.filter(note => note.id !== id);
  //   setNotes(newNotesArray);
  //   await API.graphql({ query: deleteNoteMutation, variables: { input: { id } }});
  // }


  return (
    <div className="App">
      <Modal clicked={createNote} open={modalState} changed={e => setLessonData({ ...lessonData, 'name': e.target.value})}/>
      <h1>Create Mode</h1>
      <input
        type="file"
        onChange={onChange}
      />
      <input
      className="input"
      onChange={e => setFormData({ ...formData, 'title': e.target.value})}
      placeholder="Title"
      value={formData.title}
      />
      <input
        className="input"
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="Sub Title"
        value={formData.name}
      />
      <input
        className="input"
        onChange={e => setFormData({ ...formData, 'description': e.target.value})}
        placeholder="Paragraph"
        value={formData.description}
      />

      <button onClick={updateNote}>Create</button>
      <div style={{marginBottom: 30}}>
      {SpinnerHandler ? <div className={classes.Spinner}><Spinner/></div> : null}
      {
        notes.component.map((note, i) => (
          <div key={note.id || note.name}>
            {note.title ? <h1 className="title">{note.title}</h1> : null}
            <h2 className="subtitle">{note.name}</h2>
            <p className="subtitle">{note.description}</p>
            <button onClick={() => deleteComponent(note)}>Delete text</button>
            {
              note.image && <img src={note.image} style={{width: 400}} alt="img" />
            }
          </div>
        ))
      }      
      </div>
      <Button variant="contained" color="primary" onClick={updateEditing}>Save</Button>
    </div>
  );
}

export default LessonBuilder;