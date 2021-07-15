const NoteService = require("./noteService")

describe("Note service tests", () => {

    test("List note", () => {
        const noteService = new NoteService(__dirname + '/noteService.test.json');
        expect(noteService.list("John"))
            .resolves.toEqual([])
    })

    test("If user is defined and there is a note", () => {
        const noteService = new NoteService(__dirname + '/noteService.test.json');
        expect(
                noteService.add("Hi There", "Jack")
                .then(noteService.list("Jack"))
                .catch((err) => {
                    throw new Error (err)
                })
            )
            .resolves.toEqual(["Hi There"])
    })

    test("Adding a note does not replace previous notes", () => {
        const noteService = new NoteService(__dirname + '/noteService.test.json');
        expect(
                noteService.add("Hi There", "Jack")
                .then(noteService.add("Second Note", "Jack"))
                .then(noteService.list("Jack"))
                .catch((err) => {
                    throw new Error (err)
                })
            )
            .resolves.toEqual(["Hi There", "Second Note"])
    })

    test("Editing a note", () => {
        const noteService = new NoteService(__dirname + '/noteService.test.json');
        expect(
                noteService.add("Hi There", "Jack")
                .then(noteService.add("Second Note", "Jack"))
                .then(noteService.edit("Edited Note", "Jack", [1]))
                .then(noteService.list("Jack"))
                .catch((err) => {
                    throw new Error (err)
                })
            )
            .resolves.toEqual(["Hi There", "Edited Note"])
    })

    test("Deleting a note", () => {
        const noteService = new NoteService(__dirname + '/noteService.test.json');
        expect(
                noteService.add("Hi There", "Jack")
                .then(noteService.add("Second Note", "Jack"))
                .then(noteService.add("Second Note", "Jack"))
                .then(noteService.delete("Jack", [1]))
                .then(noteService.list("Jack"))
                .catch((err) => {
                    throw new Error (err)
                })
            )
            .resolves.toEqual(["Hi There"]);
    })

    test("Multiple users and notes", () => {
        const noteService = new NoteService(__dirname + '/noteService.test.json');
        expect(
            noteService.add("Hi There", "Jack")
            .then(noteService.add("Cool Note", "John"))
            .then(noteService.add("Second Note", "Jack"))
            .then(noteService.list("Jack"))
            .catch((err) => {
                throw new Error (err)
            })
        ).resolves.toEqual(["Hi There", "Second Note"])
    })
})