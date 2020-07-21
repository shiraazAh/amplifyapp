import React, { useState, useEffect } from 'react';
import { API, Storage } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listNotes } from '../../graphql/queries';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation, updateNote as updateNoteMutation } from '../../graphql/mutations';
// import Editor from './Component/Editor'

const initialFormState = { name: '', description: '', title: '', component: ''}
const initialNoteState = {id:'', name: '', description: '', title: ''}

function App() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [NoteData, setNoteData] = useState(initialNoteState);

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
    const apiData = await API.graphql({ query: listNotes });
    const allData = apiData.data.listNotes.items;

    //removing unwanted characters in createdAt Date
    for(let obj of allData){
      obj.createdAt = obj.createdAt.replace(/[-T:.Z]/g, '');
    }

    //Ordering it according to createdAt Date
    allData.sort((a, b) => {   const objDateA = a.createdAt;
      const objDateB = b.createdAt;
  
      let comparison = 0;
      if (objDateA > objDateB) {
        comparison = 1;
      } else if (objDateA < objDateB) {
        comparison = -1;
      }
      return comparison;});

    console.log(allData);
    
    const notesFromAPI = allData.map(obj => JSON.parse(obj.component));

    console.log(notesFromAPI);

    await Promise.all(notesFromAPI.map(async note => {
      if (note.image) {
        const image = await Storage.get(note.image);
        note.image = image;
      }
      return note;
    }))

    setNotes(notesFromAPI);

  }

  async function createNote() {
    if (!formData.name || !formData.description) return;
    let comp = formData;
    delete comp.component;
    formData.component = JSON.stringify(comp);
    await API.graphql({ query: createNoteMutation, variables: { input: formData } });
    if (formData.image) {
      const image = await Storage.get(formData.image);
      console.log(image);
      formData.image = image;
    }
    setNotes([ ...notes, formData ]);
    setFormData(initialFormState);
  }

  async function updateNote(index) {
    await API.graphql({ query: updateNoteMutation, variables: { input: NoteData } });
    alert("Edited")
    setNoteData(initialNoteState)
  }

  async function deleteNote({ id }) {
    const newNotesArray = notes.filter(note => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({ query: deleteNoteMutation, variables: { input: { id } }});
  }

  function switchNoteHandler(event, index){ 
    const newArr = [...notes];
    newArr[index].description = event.target.value
    const newData = { 
      id: newArr[index].id,
      name: newArr[index].name,
      description: newArr[index].description,
      title: newArr[index].title,
    }
    setNoteData(newData)
    setNotes(newArr);
  }

  return (
    <div className="App">
      <h1>Create Article</h1>
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

      <button onClick={createNote}>Create</button>
      <div style={{marginBottom: 30}}>
      {
        notes.map((note, i) => (
          <div key={note.id || note.name}>
            {note.title ? <h1 className="title">{note.title}</h1> : null}
            <h2 className="subtitle">{note.name}</h2>
            <p className="subtitle">{note.description}</p>
            <input 
              type="text" 
              placeholder={note.description} 
              onChange={(event) => switchNoteHandler(event, i)} />
            <button onClick={() => updateNote(i)}>Edit</button>
            <button onClick={() => deleteNote(note)}>Delete text</button>
            {
              note.image && <img src={note.image} style={{width: 400}} alt="img" />
            }
          </div>
        ))
      }      
      </div>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);