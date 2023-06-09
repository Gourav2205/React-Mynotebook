import { React, useContext } from 'react'
import NoteContext from '../context/notes/noteContext'

const NoteItem = (props) => {
    const context = useContext(NoteContext);
    const { deleteNote } = context;
    const { note, updateNote } = props;
    return (
        <div className='col-md-3'>
            <div className="card my-3">
                <div className="card-body" style={{ cursor: 'pointer' }}>
                    <h5 className="card-title">{note.title}</h5>
                    <p className="card-text">{note.content}</p>
                    <i className="far fa-trash-alt" onClick={() => { deleteNote(note._id); props.showAlert("Deleted successfully", "success") }}></i>
                    <i className="far fa-edit mx-4" onClick={() => { updateNote(note) }}></i>
                </div>
            </div>
        </div>
    )
}

export default NoteItem
