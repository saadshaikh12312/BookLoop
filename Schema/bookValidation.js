const Joi = require('joi');

module.exports.validateBookSchema = Joi.object({
    book: Joi.object({
        title: Joi.string()
            .min(1)
            .required(),
        description: Joi.string()
            .min(3),
        subject: Joi.string()
            .min(3)
            .required(),
        subjectCode: Joi.string()
            .required(),
        course: Joi.string()
            .required()
            .valid("BSc", "BCA", "BCom", "BA", "BTech", "BE", "MCA", "MSc", "MBA")
            .messages({
                "any.only": "Please select a valid course name.",
                "any.required": "course name is required."
            }),
        sem: Joi.string()
            .valid("sem-1", "sem-2", "sem-3", "sem-4", "sem-5", "sem-6", "sem-7", "sem-8")
            .required(),
        university: Joi.string(),
        publication: Joi.string(),
        condition: Joi.string()
            .valid("new", "like new", "good", "fair", "poor")
            .required(),
        price: Joi.object({
            actualPrice: Joi.number()
                .min(0)
                .required(),
            sellingPrice: Joi.number()
                .min(0)
                .required()
        }).required(),
        location: Joi.string()
            .required(),
        exchangetype: Joi.string()
            .valid("sell", "donate", "exchange")
            .required(),
        image:
            Joi.object({
                url: Joi.string(),
                filename: Joi.string()
            }),
        ownerName: Joi.string(),
    })
});
