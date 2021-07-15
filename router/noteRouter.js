const express = require('express');

class NoteRouter {
    constructor(noteService) {
        this.noteService = noteService;
    }

    router() {
        let router = express.Router();

        router.get("/", this.get.bind(this));
        router.post("/", this.post.bind(this));
        router.put("/:id", this.put.bind(this));
        router.delete("/:id", this.delete.bind(this));

        return router;
    }

    get(req, res) {
        return this.noteService.list(req.auth.user).then((notes) => {
                console.log(res.json(notes))
                return res.json(notes)
            })
            .catch((err) => res.status(500).json(err))
    }

    post(req, res) {
        this.noteService.add(req.body.note, req.auth.user)
            .then(() => {
                this.noteService.writeNotes()
            })
            .then(() => {
                res.redirect("/")
            })
            .catch((err) => {
                res.status(500).json(err)
            })
    }

    put(req, res) {
        return this.noteService.edit(req.body.note, req.auth.user, req.params.id)
        .then(() => this.noteService.list(req.auth.user))
        .then((results) => res.json(results))
        .catch((err) => {
            console.log(err)
            res.status(500).json(err)
        })
    }

    delete(req, res) {
        return this.noteService
            .delete(req.auth.user, req.params.id)
            .then(() => this.noteService.list(req.auth.user))
            .then((results) => res.json(results))
            .catch((err) => {
                console.log(err)
                res.status(500).json(err)
             })
    }
}

module.exports = NoteRouter