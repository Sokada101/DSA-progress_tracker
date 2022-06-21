const express = require('express');

const checkAuth = require('../middleware/check-auth');

const problemController = require('../controllers/problem');

const router = express.Router();


router.post("", checkAuth, problemController.createProblem);

router.put("/:id", checkAuth, problemController.updateProblem);

router.get("", checkAuth, problemController.getProblems);

router.get("/unsolved", checkAuth, problemController.getUnsolvedProblems);

router.get("/solved", checkAuth, problemController.getSolvedProblems);

router.get("/:id", checkAuth, problemController.getProblem);

router.delete("/:id", checkAuth, problemController.deleteProblem);

module.exports = router;
