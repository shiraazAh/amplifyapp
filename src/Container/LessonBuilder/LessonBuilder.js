import React, { useState, useEffect } from 'react';
import { API, Storage } from 'aws-amplify';
import { listNotes } from '../../graphql/queries';
import { deleteNote as deleteNoteMutation, updateNote as updateNoteMutation } from '../../graphql/mutations';
import Spinner from '../../Component/UI/Spinner/Spinner';
import Modal from '../../Component/UI/Modal/CreateModeModal';

import '../../App.module.css';
import classes from './LessonBuilder.module.css';

// import Editor from './Component/Editor'

const initialFormState = { name: '', description: '', title: ''};
let Id = 0;

function LessonBuilder() {
  const [notes, setNotes] = useState({id:'', name: '', description: '', title: '', component: []});
  const [formData, setFormData] = useState(initialFormState);
  const [SpinnerHandler, setSpinnerHandler] = useState(true);

  const [modalState, setModal] = React.useState(true);

  // const handleOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    setModal(false);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

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

    // Storing the data in variable
    const notesFromAPI = allData[0];

    // Parsing the JSON element
    const parsedComponent = JSON.parse(notesFromAPI.component);
    allData[0].component = parsedComponent;

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

  // async function createNote() {
  //   if (!formData.name || !formData.description) return;
  //   let comp = formData;
  //   delete comp.component;
  //   formData.component = JSON.stringify(comp);
  //   await API.graphql({ query: createNoteMutation, variables: { input: formData } });
  //   if (formData.image) {
  //     const image = await Storage.get(formData.image);
  //     console.log(image);
  //     formData.image = image;
  //   }
  //   setNotes([ ...notes, formData ]);
  //   setFormData(initialFormState);
  // }

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
    setNotes({id: newArrAfterDelete.id, name: newArrAfterDelete.name, description: newArrAfterDelete.description, title: newArrAfterDelete.title, component: newComp});

  }


  // async function deleteNote({ id }) {
  //   const newNotesArray = notes.component.filter(note => note.id !== id);
  //   setNotes(newNotesArray);
  //   await API.graphql({ query: deleteNoteMutation, variables: { input: { id } }});
  // }

  // function switchNoteHandler(){ 
  //   const newArr = notes;
  //   const newArrComponent = newArr.component;
  //   const newForm = formData;
  //   newArrComponent.push(newForm);
  //   setFormData(initialFormState);
  //   setNotes(newArr);
  //   updateNote();
  // }

  return (
    <div className="App">
      <Modal clicked={handleClose} open={modalState}/>
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
    </div>
  );
}

export default LessonBuilder;