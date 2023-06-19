import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Editor from '../components/Editor';
import Split from 'react-split';
import { nanoid } from 'nanoid';

export default function App() {
    const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem('notes')) || []);
    const [currentNoteId, setCurrentNoteId] = useState((notes[0] && notes[0].id) || '');

    useEffect(() => {
        localStorage.setItem('notes', JSON.stringify(notes));
    }, [notes]);

    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here",
        };

        setNotes((prevNotes) => [newNote, ...prevNotes]);
        setCurrentNoteId(newNote.id);
    }

    function updateNote(text) {
        setNotes((prevNotes) => {
            const newArray = [];

            for (let i = 0; i < prevNotes.length; i++) {
                const prevNote = prevNotes[i];

                if (prevNote.id === currentNoteId) {
                    newArray.unshift({ ...prevNote, body: text });
                } else {
                    newArray.push(prevNote);
                }
            }

            return newArray;
        });
    }

    function findCurrentNote() {
        return (
            notes.find((note) => {
                return note.id === currentNoteId;
            }) || notes[0]
        );
    }

    return (
        <main>
            {notes.length > 0 ? (
                <Split sizes={[15, 85]} direction="horizontal" className="split">
                    <Sidebar
                        notes={notes}
                        currentNote={findCurrentNote()}
                        setCurrentNoteId={setCurrentNoteId}
                        newNote={createNewNote}
                    />
                    {currentNoteId && notes.length > 0 && (
                        <Editor currentNote={findCurrentNote()} updateNote={updateNote} />
                    )}
                </Split>
            ) : (
                <div className="no-notes">
                    <h1>You have no notes</h1>
                    <button className="first-note" onClick={createNewNote}>
                        Create one now
                    </button>
                </div>
            )}
        </main>
    );
}
