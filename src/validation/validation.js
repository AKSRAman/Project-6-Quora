const validator = require("email-validator");

const isValid = (value) => {
    if (typeof value === 'undefined' || typeof value === null) return false;
    if (typeof value === 'string' && value.length === 0) return false;
    return true;
}
const isValidRequestBody = (value) => {
    if (Object.keys(value).length === 0) return false;
    return true;
}
const isValidMobile = (value) => {
    if (!(/^[6-9]\d{9}$/.test(value))) {
        return false
    }
    return true
}
const isValidSyntaxOfEmail = (value) => {
    if (!(validator.validate(value))) {
        return false
    }
    return true
}
const isAlphabet = (value) => {
    let regex = /^[A-Za-z ]+$/
    if (!(regex.test(value))) {
        return false
    }
    return true
}

const checkUser = async (req, res, next) => {
    console.log(req.body.fname)
    let { fname, lname, email, phone, password } = req.body;

    if (!isValidRequestBody(req.body)) {
        return res.status(400).send({ status: false, msg: "please provide body" })
    }
    if (!isValid(fname)) {
        return res.status(400).send({ status: false, msg: "please provide fname or fname field" })
    }
    if (!isValid(lname)) {
        return res.status(400).send({ status: false, msg: "please provide lname or lname field" })
    }
    if (!isAlphabet(fname)) {
        return res.status(400).send({ status: false, msg: "Name does not contain special character" });
    }
    if (!isAlphabet(lname)) {
        return res.status(400).send({ status: false, msg: "Name does not contain special character" });
    }
    if (!isValid(email)) {
        return res.status(400).send({ status: false, msg: "please provide email or email field" })
    }
    if (!isValid(password)) {
        return res.status(400).send({ status: false, msg: "please provide password or field" })
    }
    password = password.trim();
    const len = password.length;
    if (len < 8 || len > 15) {
        return res.status(400).send({ status: false, msg: "password must be in greater equal to 8 and less equal to 15 " });
    }
    if (!isValid(phone)) {
        return res.status(400).send({ status: false, msg: "please provide phone number or  field" })
    }
    if (!isValidMobile(phone)) {
        return res.status(400).send({ status: false, msg: "please provide valid mobile number" })
    }
    if (!isValidSyntaxOfEmail(email)) {
        return res.status(400).send({ status: false, msg: "please provide valid email" });
    }
    next();
}
const updateUser = (req, res, next) => {

    if (!isValidRequestBody(req.body)) {
        return res.status(400).send({ status: false, msg: "please provide data to update" })
    }
    let { fname, lname, email, phone } = req.body;
    if (fname) {
        if (!isValid(fname)) {
            return res.status(400).send({ status: false, msg: "please provide fname or fname field" })
        }
        if (!isAlphabet(fname)) {
            return res.status(400).send({ status: false, msg: "Name does not contain special character" });
        }
    }
    if (lname) {
        if (!isValid(lname)) {
            return res.status(400).send({ status: false, msg: "please provide lname or lname field" })
        }
        if (!isAlphabet(lname)) {
            return res.status(400).send({ status: false, msg: "Name does not contain special character" });
        }
    }
    if (email) {
        if (!isValid(email)) {
            return res.status(400).send({ status: false, msg: "please provide email or email field" })
        }
        if (!isValidSyntaxOfEmail(email)) {
            return res.status(400).send({ status: false, msg: "please provide valid email" });
        }
    }
    if (phone) {
        if (!isValid(phone)) {
            return res.status(400).send({ status: false, msg: "please provide phone number or  field" })
        }
        if (!isValidMobile(phone)) {
            return res.status(400).send({ status: false, msg: "please provide valid mobile number" })
        }
    }
    next()
}
module.exports = { checkUser, updateUser, isValidRequestBody, isValid }