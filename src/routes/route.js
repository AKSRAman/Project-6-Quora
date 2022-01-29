const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const questionController = require("../controllers/questionController")
const answerController = require("../controllers/answerController")
const middleware = require("../middelwares/middleware");
const validation = require("../validation/validation")

//---------------user Routes--------------------------//
router.post("/register", validation.checkUser, userController.RegisterUser);
router.post("/logIn", userController.logIn);
router.get("/user/:userId/profile", middleware.middleware, userController.getDetails);
router.put("/user/:userId/profile", middleware.middleware, validation.updateUser, userController.update);

//----------------------question routes------------//
router.post("/question", middleware.middleware, questionController.questionDetails)
router.get("/questionWithAnswer", questionController.allQueAns)
router.get("/questionWithAnswer/:questionId", questionController.getParticularQuestion)
router.put("/updateQuestion/:questionId", middleware.middleware, questionController.updateQuestion)
router.delete("/deleteQuestion/:questionId", middleware.middleware, questionController.questionDelete)

//-------------------answer routes---------------------------//
router.post("/answer", middleware.middleware, answerController.answerDetails);
router.get("/questions/:questionId/answers", answerController.getAnswerDetail);
router.put("/answers/:answerId", middleware.middleware, answerController.updateAnswer)
router.delete("/answers/:answerId", middleware.middleware, answerController.deleteAnswer)










module.exports = router