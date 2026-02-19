const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose').default;

const userSchema = new Schema({
    mobileNo: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,     // each email must be unique
        lowercase: true,
        trim: true
    },
    name: {
        firstName: {
            type: String,
            required: [true, "First name is required."],
            min: [3, "First name must have atleast 3 characters."],
        },
        lastName: {
            type: String,
            required: [true, "Last name is required."],
            min: [3, "Last name must have atleast 3 characters."],
        }
    },
    myBooks: [
        {
            type: Schema.Types.ObjectId,
            ref: "book",
        }
    ],
    messages: [
        {
            request: {
                type: Schema.Types.ObjectId,
                ref: "request",
                required: true
            },
            message: {
                type: String,
                required: true
            },
            status: {
                type: String,
                enum: ["read", "unread"],
                default: "unread"
            },
            type: {
                type: String,
                enum: ["request", "received"],
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],

});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", userSchema);