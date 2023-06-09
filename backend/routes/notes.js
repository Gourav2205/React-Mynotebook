const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

// ROUTE 1 : Get all the notes using : GET "api/notes/getnotes". Login required
router.get("/fetchallnotes", fetchUser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 2 : Add a new note using : POST "api/notes/addnote". Login required
router.post(
    "/addnote",
    fetchUser,
    [
        body("title", "Title is required").isLength({ min: 5 }),
        body("content", "Enter your description").isLength({ min: 5 }),
    ],
    async (req, res) => {
        // If there are errors, return bad request and the erros
        const { title, content, tag } = req.body;
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const note = new Note({
                title,
                content,
                tag,
                user: req.user.id,
            });
            const saveNote = await note.save();
            res.json(saveNote);
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Internal Server Error");
        }
    }
);

// ROUTE 3 : Update an existing note using : PUT "api/notes/updatenote". Login required
router.put("/updatenote/:id", fetchUser, async (req, res) => {
    // If there are errors, return bad request and the erros
    const { title, content, tag } = req.body;
    try {
        // Create a new note object
        const newNote = {};
        if (title) {
            newNote.title = title;
        }
        if (content) {
            newNote.content = content;
        }
        if (tag) {
            newNote.tag = tag;
        }

        // Finf the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndUpdate(
            req.params.id,
            { $set: newNote },
            { new: true }
        );
        res.json({ note });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 4 : Delete an existing note using : DELETE "api/notes/deletenote". Login required
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
    // If there are errors, return bad request and the erros
    try {
        // Finf the note to be deleted and delete it
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }

        // Allow deletion only if user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndDelete(
            req.params.id);
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
