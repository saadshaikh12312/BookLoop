const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: {
        type: String,
        min: 1,

        required: true
    },
    description: String,
    subject: {
        type: String,
        min: 3,
        required: true
    },
    subjectCode: {
        type: String,
    },
    course: {
        type: String,
        required: true,
        enum: ["BSc", "BCA", "BCom", "BA", "BTech", "BE", "MCA", "MSc", "MBA"]
    },
    sem: {
        type: String,
        enum: ["sem-1", "sem-2", "sem-3", "sem-4", "sem-5", "sem-6", "sem-7", "sem-8"]
    },
    university: String,
    publication: String,
    condition: {
        type: String,
        enum: ["new", "like new", "good", "fair", "poor"],
        required: true,
    },
    price: {
        actualPrice: {
            type: Number,
            require: true,
            min: 0
        },
        sellingPrice: {
            type: Number,
            require: true,
            min: 0
        }
    },
    location: {
        type: String,
        required: true
    },
    exchangetype: {
        type: String,
        enum: ["sell", "donate", "exchange"],
        required: true
    },
    ownerName: String,
    image: {
        type: {
            url: {
                type: String,
                required: true
            },
            filename: {
                type: String,
                default: "book image"
                // required: true,
            }
        },
        required: [true, "Please upload a image."],
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user",
    }
});

module.exports = Book = mongoose.model("book", bookSchema);