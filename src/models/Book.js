const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        author: {
            type: String,
            required: true,
            trim: true,
        },
        genre: {
            type: String,
            trim: true,
        },
        publishedYear: {
            type: Number,
            trim: true,
        },
        ISBN: {
            type: String,
            unique: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Book", bookSchema);
