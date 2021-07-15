const {
    verify
} = require("crypto");
const {
    json
} = require("express");
const fs = require("fs");

class NoteService {
    constructor(file) {
        this.file = file
        this.readNotes();
    }

    //Method to update JSON file
    writeNotes() {
        console.log("Writing notes in storage");
        return new Promise((resolve, reject) => {
            fs.writeFile(this.file, JSON.stringify(this.notes), (err) => {
                if (err) {
                    return reject(err);
                }
                return resolve(this.notes)
            })
        })
    }

    //Method to read notes from JSON file
    readNotes() {
        console.log("Reading notes in storage");
        return new Promise((resolve, reject) => {
            fs.readFile(this.file, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    this.notes = JSON.parse(data)
                }
                return resolve(this.notes);
            })
        })
    }

    // Method to add a note
    add(note, user) {
        console.log("Adding a new note");
        return new Promise((resolve, reject) => {
            this.readNotes().then((data) => {
                if (data[user] === undefined) {
                    data[user] = [note]
                }
                // if the user already exists
                else {
                    data[user].push(note);
                }
                resolve(data[user]);
            })
        })
    }

    // Method to update a note
    edit(note, user, index) {
        console.log("editing note")
        return new Promise((resolve, reject) => {
            if (this.notes[user] === "undefined") {
                reject("User does not exist");
            }
            console.log("notes", this.notes[user])
            if (this.notes[user].length <= index) {
                reject("Note does not exist");
            } else {
                this.readNotes()
                    .then((data) => {
                        data[user][index] = note
                        this.writeNotes();
                        resolve(data[user])
                    })
            }
        })
    }

    //Method to delete a note
    delete(user, index) {
        console.log("deleting a note")
        return new Promise((resolve, reject) => {
            if (this.notes[user] === "undefined") {
                reject("User does not exist");
            }
            console.log("notes", this.notes[user])
            if (this.notes[user].length <= index) {
                reject("Note does not exist");
            } else {
                this.readNotes().then((data) => {
                    console.log("notes deleted")
                    data[user].splice(index, 1);
                    this.writeNotes();
                    resolve(data[user])
                })
            }
        })
    }

    //Method to show notes
    list(user) {
        console.log("listing notes")
        return new Promise((resolve, reject) => {
            this.readNotes().then((data) => {
                if (data[user] === undefined) {
                    data[user] = [];
                    resolve(data[user]);
                } else {
                    resolve(data[user]);
                }
            })
        })
    }
}

module.exports = NoteService;

// const testNote = new NoteService
// testNote.add("First Note", "User1");
// testNote.add("Second Note", "User1");
// testNote.add("Hi There", "User2");
// testNote.delete("User1", 0);
// console.log(testNote.list("User1"))
// testNote.edit("Changed it", "User2", 0);
// console.log(testNote.list("User1"));
// console.log(testNote.list("User2"));