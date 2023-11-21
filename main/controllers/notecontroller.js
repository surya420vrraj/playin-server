const Note = require("../models/notesModel");
exports.index = async (req, res, next) => {
  try {
    const { role } = req.user;

    const notes = await Note.find();

    const filteredNotes = notes.filter((item) => {
      return (
        item.displayType === "all" ||
        (role === 1 && item.displayType === "admin") ||
        (role === 0 && item.displayType === "employee")
      );
    });
    if (role === 2) {
      return res.json({
        success: true,
        message: "Today's notes data",
        notes: notes,
      });
    }
    return res.json({
      success: true,
      message: "Today's notes data",
      notes: filteredNotes,
    });
  } catch (e) {
    next(e);
  }
};

exports.addNode = async (req, res, next) => {
  try {
    const { title, content, displayType } = req.body;
    const createdBy = req.user.id; // Assuming the user ID is stored in req.user

    const newNote = new Note({
      title,
      content,
      displayType,
      createdBy,
    });

    const savedNote = await newNote.save();

    res.json({
      success: true,
      message: "Note created successfully",
      note: savedNote,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateNote = async (req, res, next) => {
  try {
    const { title, content, displayType } = req.body;
    const noteId = req.params.id;

    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { title, content, displayType },
      { new: true }
    );

    res.json({
      success: true,
      message: "Note updated successfully",
      note: updatedNote,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const noteId = req.params.id;

    await Note.findByIdAndDelete(noteId);

    res.json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
