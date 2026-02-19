const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestSchema = new Schema(
    {
        book: {
            type: Schema.Types.ObjectId,
            ref: "Book",
            required: true,
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
        }
    },
    {
        timestamps: true   // creates createdAt & updatedAt
    }
);

module.exports = mongoose.model("request", requestSchema);
