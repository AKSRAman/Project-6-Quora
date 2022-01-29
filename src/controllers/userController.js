const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt");
const mongoose = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId;

const RegisterUser = async (req, res) => {
    try {
        let data = req.body;
        if (!data) {
            return res.status(400).send({ status: false, message: "Please Provide User Details To Create User" })
        }
        let { fname, lname, email, phone, password } = data
        // generate salt to hash password
        const salt = await bcrypt.genSalt(10);
        // now we set user password to hashed password
        password = await bcrypt.hash(password, salt);
        const finalData = { fname, lname, email, phone, password }
        let UserCreated = await userModel.create(finalData)
        return res.status(201).send({ status: true, message: "User Created Successfully", UserCreated })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const logIn = async (req, res) => {
    try {
        const mEmail = req.body.email;
        const mPassword = req.body.password;
        let user = await userModel.findOne({ email: mEmail });
        if (user) {
            const { _id, fname, password } = user
            const validPwd = await bcrypt.compare(mPassword, password)
            if (!validPwd) {
                return res.status(400).send({ status: true, message: "Invalid Password" })
            }
            let payload = { userId: _id };
            const generatedToken = jwt.sign(payload, "Quora", { expiresIn: "120m" })
            res.header("user-login", generatedToken)
            return res.status(200).send({
                status: true, message: fname + ", You have Logged In Successfully", userId: user._id,
                token: generatedToken,
            })
        }
        else {
            return res.status(400).send({ status: false, message: "Invalid Credentials" })
        }
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const getDetails = async (req, res) => {
    const userid = req.params.userId;
    let checkId = ObjectId.isValid(userid);

    if (!checkId) {
        return res.status(400).send({ status: false, message: "Please Provide a valid userId in query params" });;
    }
    const details = await userModel.findOne({ _id: userid });
    if (!details) {
        return res.status(400).send({ status: false, msg: "No user is found" });
    }

    return res.status(200).send({ status: true, msg: "successful", details });
}

const update = async (req, res) => {
    try {
        const userId = req.params.userId
        let checkId = ObjectId.isValid(userId);

        if (!checkId) {
            return res.status(400).send({ status: false, message: "Please Provide a valid userId in query params" });;
        }
        if (req.userId != req.params.userId) {
            return res.status(400).send({ status: false, msg: "you are not authorized to make changes" })
        }
        let { fname, lname, email, phone } = req.body
        let updateProfile = await userModel.findOneAndUpdate({ _id: userId }, { fname: fname, lname: lname, email: email, phone: phone }, { new: true })
        res.status(200).send({ status: true, message: "user profile update successfully", data: updateProfile })
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}
module.exports = { RegisterUser, logIn, getDetails, update }