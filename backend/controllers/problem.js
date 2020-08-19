const Problem = require("../models/problem");

exports.createProblem = (req, res, next) => {
  const problem = new Problem({
    title: req.body.title,
    reasons: req.body.reasons,
    solved: req.body.solved,
    creator: req.userData.userId,
  });
  problem
    .save()
    .then((result) => {
      res.status(201).json({
        message: "post added",
        problemId: result.id,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Adding a problem failed",
      });
    });
};

exports.updateProblem =( req, res, next) => {
  const problem = new Problem({
    _id: req.body.id,
    title: req.body.title,
    reasons: req.body.reasons,
    solved: req.body.solved,
    creator: req.userData.userId,
  });
  Problem.updateOne({ _id: req.params.id, creator: req.userData.userId }, problem)
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({
          message: "updated successfully",
        }) 
      } else {
          res.status(401).json({
            message: "not authorized to update"
          })
        };
    })
    .catch((err) => {
      res.status(500).json({
        message: "Couldn't update problem"
      })
    });
};

exports.getProblems = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const probQuery = Problem.find({ creator: req.userData.userId });
  let fetchedProblems;

  if (pageSize && currentPage) {
    probQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
      .sort({ _id: -1 });
  }
  probQuery
    .then((data) => {
      fetchedProblems = data;
      return Problem.countDocuments({ creator: req.userData.userId});
    })
    .then((count) => {
      res.status(200).json({
        message: "Problems were fetched successfully",
        problems: fetchedProblems,
        maxProbs: count,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Couldn't fetch problems"
      })
    });
};

exports.getUnsolvedProblems = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const probQuery = Problem.find({ creator: req.userData.userId, solved: "false" });
  let fetchedProblems;

  if (pageSize && currentPage) {
    probQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
      .sort({ _id: -1 });
  }
  probQuery
    .then((data) => {
      fetchedProblems = data;
      return Problem.countDocuments({ creator: req.userData.userId, solved: "false" });
    })
    .then((count) => {
      res.status(200).json({
        message: "Problems were fetched successfully",
        problems: fetchedProblems,
        maxProbs: count,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Couldn't fetch problems"
      })
    });
};

exports.getSolvedProblems = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const probQuery = Problem.find({ creator: req.userData.userId, solved: "true" });
  let fetchedProblems;

  if (pageSize && currentPage) {
    probQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
      .sort({ _id: -1 });
  }
  probQuery
    .then((data) => {
      fetchedProblems = data;
      return Problem.countDocuments({ creator: req.userData.userId, solved: "false" });
    })
    .then((count) => {
      res.status(200).json({
        message: "Problems were fetched successfully",
        problems: fetchedProblems,
        maxProbs: count,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Couldn't fetch problems"
      })
    });
};

exports.getProblem = (req, res, next) => {
  Problem.findById(req.params.id)
    .then((problem) => {
      if (problem) {
        res.status(200).json(problem);
      } else {
        res.status(404).json({
          message: "Problem Not Found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Couldn't fetch a problem",
      });
    });
};

exports.deleteProblem = (req, res, next) => {
  Problem.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({
          message: "deleted successfully",
        });
      } else {
        res.status(401).json({
          message: "not authorized",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Couldn't delete a problem",
      });
    });
};