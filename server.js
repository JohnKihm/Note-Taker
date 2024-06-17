const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const PORT = process.env.port || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.err(err);
            return;
        } else {
            const parsedNotes = JSON.parse(data);
            res.json(parsedNotes);
        }
    })
});

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuidv4()
        };

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.err(err);
                return;
            } else {
                const parsedNotes = JSON.parse(data);
                parsedNotes.push(newNote);
                fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4), (err) =>
                    err ? console.error(err) : console.info('Note successfully added'));
            }
        });
    }
});

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
console.log(`App listening at http://localhost:${PORT}`)
);