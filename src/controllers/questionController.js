const userModel = require("../models/userModel")
const answerModel = require("../models/answerModel")
const questionModel = require("../models/questionModel")
const validation = require("../validation/validation")
const ObjectId = require('mongoose').Types.ObjectId;

const questionDetails = async (req, res) => {

    try {
        const { askedBy } = req.body;
        let checkId = ObjectId.isValid(askedBy);
        if (!checkId) {
            return res.status(400).send({ status: false, message: "Please Provide a valid userId" });;
        }
        if (req.userId != askedBy) {
            return res.status(400).send({ status: false, msg: "you are not authorized" });
        }
        const checkUser = await userModel.findOne({ _id: askedBy });
        if (!checkUser) {
            return res.status(400).send({ status: false, msg: "you are not a valid user...." })
        }
        if (checkUser.creditScore === 0) {
            return res.status(400).send({ status: false, msg: "Your credit Score be not Sufficient and you should answer the question first" });
        }
        checkUser.creditScore -= 100;
        checkUser.save();
        const data = await questionModel.create(req.body);
        return res.status(201).send({ status: true, msg: "successfully", data });
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
}

const allQueAns = async (req, res) => {
    try {
        let sort
        if (req.query) {
            if (req.query.sort == "descending") {
                sort = -1
            }
            else {
                sort = 1
            }
        }
        const questionData = await questionModel.find({ isDeleted: false }).sort({ createdAt: sort }).select({ createdAt: 0, updatedAt: 0, askedBy: 0, isDeleted: 0 });
        const len = questionData.length;
        const answerData = await answerModel.find({ isDeleted: false }).select({ _id: 0, updatedAt: 0, isDeleted: 0 });

        const len1 = answerData.length;
        const questionWithAnswer = [];

        for (let i = 0; i < len; i++) {
            let data = {};
            const answerArray = []
            data.question = questionData[i];
            for (let j = 0; j < len1; j++) {
                if ((questionData[i]._id).toString() === (answerData[j].questionId).toString()) {
                    answerArray.push(answerData[j]);
                }
            }
            data.answer = answerArray;
            questionWithAnswer.push(data);
        }
        return res.status(200).send({ status: true, msg: "successfully", questionWithAnswer })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
}

const getParticularQuestion = async (req, res) => {
    try {
        const questionId = req.params.questionId;
        let checkId = ObjectId.isValid(questionId)
        if (!checkId) {
            return res.status(400).send({ status: false, message: "Please Provide a valid userId in query params" });;
        }
        let questionData = await questionModel.findOne({ _id: questionId })
        questionData = questionData.toObject();
        const answerData = await answerModel.find({ questionId: questionId, isDeleted: false });
        if (answerData.length < 1) {
            return res.status(400).send({ status: false, msg: "No answer is found for this question" })
        }
        questionData.answer = answerData;
        return res.status(200).send({ status: true, msg: "successfully", questionData })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
}

const updateQuestion = async (req, res) => {
    try {
        const questionId = req.params.questionId
        //-------------------------------------------------//
        let checkId = ObjectId.isValid(questionId)
        if (!checkId) {
            return res.status(400).send({ status: false, message: "Please Provide a valid userId in query params" });;
        }
        if (!validation.isValidRequestBody(req.body)) {
            return res.status(400).send({ status: false, msg: "Please provide field to update" });
        }
        const { description, tag } = req.body;
        if (description) {
            if (!validation.isValid(description)) {
                return res.stasus(400).send({ status: false, msg: "You provide only key of description not key value" });
            }
        }
        if (tag) {
            if (!validation.isValid(tag)) {
                return res.status(400).send({ status: false, msg: "You provide only key of tag not key value" });
            }
        }

        const questionData = await questionModel.findOne({ _id: questionId, isDeleted: false });
        if (!questionData) {
            return res.status(400).send({ status: false, msg: "No question is exits with questionId" });
        }

        if (req.userId != questionData.askedBy) {
            return res.status(400).send({ status: false, msg: "you are not authorized to make changes" });
        }
        const data = await questionModel.findOneAndUpdate({ _id: questionId }, { description: description, tag: tag }, { new: true });
        return res.status(200).send({ status: true, msg: "successfully", data });
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
}

const questionDelete = async (req, res) => {
    try {
        const questionId = req.params.questionId
        let checkId = ObjectId.isValid(questionId)
        if (!checkId) {
            return res.status(400).send({ status: false, message: "Please Provide a valid questionId in query params" });
        }
        const questionData = await questionModel.findOne({ _id: questionId });
        if (!questionData) {
            return res.status(400).send({ status: false, msg: "No question is exits with questionId" });
        }
        if (req.userId != questionData.askedBy) {
            return res.status(400).send({ status: false, msg: "you are not authorized to make changes" });
        }
        if (questionData.isDeleted === true) {
            return res.status(400).send({ status: false, msg: "This question is already deleted" });
        }
        questionData.isDeleted = true;
        questionData.save();
        return res.status(200).send({ status: true, msg: "successfully", questionData });
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}
module.exports = { questionDetails, allQueAns, getParticularQuestion, updateQuestion, questionDelete }