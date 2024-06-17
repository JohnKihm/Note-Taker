const fs = require('fs');
const util = require('util');

const readFromFile = util.promisify(fs.readFile);

function postNote(newNote) {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        } else {
            const parsedNotes = JSON.parse(data);
            parsedNotes.push(newNote);
            fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4), (err) =>
                err ? console.error(err) : console.info('Note successfully added'));
        }
    })
}

function deleteNote(id) {
    readFromFile('./db/db.json').then((data) => {
        parsedNotes = JSON.parse(data);
        for (let i = 0; i < parsedNotes.length; i++) {
            if (parsedNotes[i].id === id) {
                parsedNotes.splice(i, 1);
            }
        }
        fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4), (err) =>
            err ? console.error(err) : console.info('Note successfully deleted'));
    });
}

module.exports = { readFromFile, postNote, deleteNote };