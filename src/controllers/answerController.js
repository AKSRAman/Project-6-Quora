const answerModel = require("../models/answerModel")
const userModel = require('../models/userModel')
const ObjectId = require('mongoose').Types.ObjectId;
const questionModel = require("../models/questionModel")
const validation = require("../validation/validation")

const answerDetails = async (req, res) => {
    try {
        const data = req.body;
        if (!validation.isValidRequestBody(req.body)) {
            return res.status(400).send({ status: false, msg: "Please provide answer body to post" });
        }

        const userId = req.body.answeredBy;
        let checkId = ObjectId.isValid(userId);
        if (!checkId) {
            return res.status(400).send({ status: false, message: "Please Provide a valid userId" });;
        }
        const checkUser = await userModel.findOne({ _id: userId })
        if (!checkUser) {
            return res.status(400).send({ status: false, msg: "this user does not valid user" });
        }
        //-------------------Authorization----------------------//
        if (req.userId != userId) {
            return res.status(400).send({ status: false, msg: "yor are not Authorized" });
        }

        const questionId = req.body.questionId;
        let checkQuestionId = ObjectId.isValid(questionId);
        if (!checkQuestionId) {
            return res.status(400).send({ status: false, message: "Please Provide a valid questionId " });;
        }
        const question = await questionModel.findOne({ _id: questionId })
        if (!question) {
            return res.status(400).send({ status: false, msg: "This question is not valid" });
        }
        if (userId == question.askedBy) {
            return res.status(400).send({ status: false, msg: "You are not allowed to answer your own question" })
        }
        checkUser.creditScore += 200
        checkUser.save();
        const savedData = await answerModel.create(data);
        return res.status(201).send({ status: true, msg: "successfully", savedData })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
}

const getAnswerDetail = async (req, res) => {
    try {
        const questionId = req.params.questionId;

        let checkId = ObjectId.isValid(questionId);
        if (!checkId) {
            return res.status(400).send({ status: false, message: "Please Provide a valid questionId" });;
        }

        let questionData = await questionModel.findOne({ _id: questionId, isDeleted: false }).select({ _id: 0, createdAt: 0, updatedAt: 0, isDeleted: 0 });

        if (!questionData) {
            return res.status(400).send({ status: false, msg: "No question is find with this questionId" });
        }
        questionData = questionData.toObject();
        const data = await answerModel.find({ questionId: questionId, isDeleted: false }).select({ _id: 0, createdAt: 0, updatedAt: 0, isDeleted: false });
        if (data.length < 1) {
            return res.status(400).send({ status: false, msg: "No answer is posted for this question" })
        }
        questionData.answer = data;
        return res.status(200).send({ status: true, msg: "successfully", questionData });
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
}

const updateAnswer = async (req, res) => {
    try {
        const answerId = req.params.answerId;
        let checkId = ObjectId.isValid(answerId);
        if (!checkId) {
            return res.status(400).send({ status: false, message: "Please Provide a valid questionId" });;
        }
        const answerData = await answerModel.findOne({ _id: answerId })
        if (!answerData) {
            return res.status(400).send({ status: false, msg: "This anser id not valid which is provide in params" });
        }
        if (req.userId != answerData.answeredBy) {
            return res.status(400).send({ status: false, msg: "you are a not a valid user to make changes" })
        }
        answerData.text = req.body.text;
        answerData.save();
        return res.status(201).send({ status: true, answerData });
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
}

const deleteAnswer = async (req, res) => {
    try {

        const answerId = req.params.answerId;
        let checkId = ObjectId.isValid(answerId);
        if (!checkId) {
            return res.status(400).send({ status: false, message: "Please Provide a valid answerId" });;
        }
        const answerData = await answerModel.findOne({ _id: answerId })
        if (!answerData) {
            return res.status(400).send({ status: false, msg: "This anser id not valid which is provide in params" });
        }
        if (req.userId != answerData.answeredBy) {
            return res.status(400).send({ status: false, msg: "you are a not a valid user to make changes" })
        }
        const data = await answerModel.findOneAndUpdate({ _id: answerId }, { isDeleted: true }, { new: true });
        return res.status(201).send({ status: true, data });
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, msg: err.message });
    }
}

module.exports = { answerDetails, getAnswerDetail, updateAnswer, deleteAnswer } 