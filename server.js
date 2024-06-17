const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { readFromFile, postNote, deleteNote } = require('./helpers/fileFunctions');
const PORT = process.env.port || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) => {
        res.json(JSON.parse(data));
    });
});

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuidv4()
        };

        postNote(newNote);

        res.status(201);
    } else {
        res.status(500).json('Error in posting note');
    }
});

app.delete('/api/notes/:id', (req, res) => {
    const deletedNoteId = req.params.id;
    deleteNote(deletedNoteId);
});

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
console.log(`App listening at http://localhost:${PORT}`)
);