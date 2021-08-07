const Joi = require("joi")

// firstname, lastname, email, password
function validateUserReg(userReg) {
    const schema = Joi.object({
        firstname: Joi.string().min(1).max(50).required(),
        lastname: Joi.string().min(1).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(1).max(50).required()
    });
    return schema.validate(userReg);
};

function validateUserLogin(userLogin) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(1).max(50).required()
    });
    return schema.validate(userLogin)
};

