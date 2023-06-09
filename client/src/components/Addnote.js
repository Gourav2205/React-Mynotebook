import React, { useContext, useState } from 'react'
import NoteContext from '../context/notes/noteContext'

const Addnote = (props) => {
    const context = useContext(NoteContext);
    const { addNote } = context;
    const [note, setNote] = useState({ title: "", content: "", tag: "" })

    const handleClick = (e) => {
        e.preventDefault();
        addNote(note.title, note.content, note.tag);
        setNote({ title: "", content: "", tag: "" })
        props.showAlert("Note Added Successfully", "success")
    }

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }
    return (
        <div className="container my3">
            <h3>Add a note</h3>
            <form>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" name='title' aria-describedby="emailHelp" onChange={onChange} placeholder='Enter Note Title' required minLength={5} value={note.title}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="content" className="form-label">Content</label>
                    <input type="text" className="form-control" id="content" name='content' onChange={onChange} placeholder='Enter Note Content' required minLength={5} value={note.content}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <input type="text" className="form-control" id="tag" name='tag' onChange={onChange} placeholder='Enter tag' value={note.tag}/>
                </div>
                <button disabled={note.title.length<5 || note.content.length<5} type="submit" className="btn btn-secondary" onClick={handleClick}>Add Your Note</button>
            </form>
        </div>
    )
}

export default Addnote
