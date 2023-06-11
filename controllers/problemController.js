const Problem = require("../models/problemModel");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
const User = require("../models/userModel");
const Team = require("../models/teamModel");
const Contest = require("../models/contestModel");
const judge0Utils = require("../utils/judge0Utils");

exports.getAllProblems = catchAsync(async (req, res) => {
  // EXECUTE A QUERY
  const features = new APIFeatures(Problem.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const problems = await features.query;
  
  if (!problems) {
    return next(new AppError("not found", 404));
  }

  res.status(200).json({
    status: "sucess",
    results: problems.length,
    data: problems,
  });
});

exports.getProblem = catchAsync(async (req, res, next) => {
  const problem = await Problem.findById(req.params.id);

  if (!problem) {
    return next(new AppError("not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      problem,
    },
  });
});

exports.createProblem = catchAsync(async (req, res, next) => {
  const { inputs, outputs } = req.body;

  if (inputs.length !== outputs.length) {
    return res
      .status(400)
      .json({ message: "Inputs and outputs must have the same length" });
  }

  const newProblem = await Problem.create(req.body);

  res.status(201).json({
    status: "success",
    data: newProblem,
  });
});

exports.updateProblem = catchAsync(async (req, res) => {
  const newProblem = await Problem.findByIdAndUpdate(
    { _id: req.params.id },
    req.body
  );

  res.status(200).json({
    status: "sucess",
    data: {
      tour: newProblem,
    },
  });
});

exports.deleteProblem = catchAsync(async (req, res) => {
  await Problem.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getProblemNames = catchAsync(async (req, res) => {
  const problems = req.body.problems;
  console.log(problems);

  const problemTitles = [];
  for (const problemId of problems) {
    const problem = await Problem.findById(problemId).select('title');
    if (problem) {
      problemTitles.push(problem.title);
    }
  }

  res.json(problemTitles);
});


exports.userSubmitContestProblem = catchAsync(async (req, res) => {
  const { contestId, code, language } = req.body;
  const problemId = req.params.id; // Retrieve problem ID from req.params
  const user = req.user;

// Retrieve problem inputs and outputs
const problem = await Problem.findById(problemId);

if (!problem) {
  return res.status(404).json({ message: "Problem not found" });
}

if (!user) {
  return res.status(404).json({ message: "User not found" });
}

// Find the contest object
const contest = await Contest.findById(contestId);
if (!contest) {
  return res.status(404).json({ message: "Contest not found" });
}

// Find the team object within the list of teams included in the contest
const contestant = contest.users.find(
  (userObj) => userObj.userId.toString() === user._id.toString()
);
if (!contestant) {
  return res.status(404).json({ message: "User is not found in the contest" });
}

// Find the problem based on the ID in the contest
const contestProblem = contest.problems.find(
  (problem) => problem._id.toString() === problemId.toString()
);
if (!contestProblem) {
  return res.status(404).json({ message: "Problem not found in contest" });
}

// Check if the team has already submitted the problem
const hasSubmittedProblem = contestant.solvedProblems.includes(problemId.toString());

if (hasSubmittedProblem) {
  return res
    .status(400)
    .json({ message: "Problem already submitted before" });
}

// Combine the inputs and hiddenInputs arrays into a single inputs array
const inputs = [...problem.inputs, ...problem.hiddenInputs];

// Combine the outputs and hiddenOutputs arrays into a single outputs array
const outputs = [...problem.outputs, ...problem.hiddenOutputs];

// Create an array to store the submission results
const submissionResults = [];

let allAccepted = true; // Track if all test cases are accepted

 // Iterate over the inputs and expected outputs
 for (let i = 0; i < inputs.length; i++) {
  const stdin = inputs[i];
  const expectedOutput = outputs[i];

  // Call the submit function asynchronously for each input-output pair
  const status = await exports.submit(code, language, stdin, expectedOutput);

  // Add the result to the submissionResults array
  submissionResults.push({
    input: stdin,
    expectedOutput: expectedOutput,
    status: status || "Pending",
  });

  // If the status is not 'Accepted', mark allAccepted as false and stop submitting further test cases
  if (status !== "Accepted") {
    allAccepted = false;
    const testCaseNumber = i + 1;
    
    return res.status(400).json({
      message: `${status} on test case number ${testCaseNumber}`,
      status: submissionResults
    });
  }
}

// Update the problem's status based on the overall result
const problemStatus = allAccepted
? "Accepted"
: submissionResults[submissionResults.length - 1].status;

// If the problem is accepted and the team hasn't submitted it before, increment the number of solved problems
if (allAccepted && !hasSubmittedProblem) {
contestant.numberOfSolvedProblems = (contestant.numberOfSolvedProblems || 0) + 1;
}

// Add the submitted problem to the team's submittedProblems array
contestant.solvedProblems.push(problem._id);

// Update the team's solved problems count and submitted problems array within the contest object
await contest.save();

// Send success response
res.status(200).json({
message: "Problem submitted successfully",
status: submissionResults,
});


});

exports.teamSubmitContestsProblem = catchAsync(async (req, res) => {
  const { contestId, teamId, code, language } = req.body;
  const problemId = req.params.id; // Retrieve problem ID from req.params

  // Retrieve problem inputs and outputs
  const problem = await Problem.findById(problemId);

  if (!problem) {
    return res.status(404).json({ message: "Problem not found" });
  }

  const submittingTeam = await Team.findById(teamId);

  if (!submittingTeam) {
    return res.status(404).json({ message: "Team not found" });
  }

  // Check if the user submitting is enrolled in the teamMembers list
  const submittingUser = req.user; // Assuming you have the user information available in req.user
  const isMember = submittingTeam.teamMembers.some(
    (member) => member.user.toString() === submittingUser._id.toString()
  );

  if (!isMember) {
    return res.status(401).json({ message: `User is not a member in ${submittingTeam.teamName} team` });
  }

  // Find the contest object
  const contest = await Contest.findById(contestId);
  if (!contest) {
    return res.status(404).json({ message: "Contest not found" });
  }

  // Find the team object within the list of teams included in the contest
  const team = contest.teams.find(
    (teamObj) => teamObj.teamId.toString() === submittingTeam._id.toString()
  );
  if (!team) {
    return res.status(404).json({ message: "Team not found in contest" });
  }

  // Find the problem based on the ID in the contest
  const contestProblem = contest.problems.find(
    (problem) => problem._id.toString() === problemId.toString()
  );
  if (!contestProblem) {
    return res.status(404).json({ message: "Problem not found in contest" });
  }


  // Check if the team has already submitted the problem
  const hasSubmittedProblem = team.solvedProblems.includes(problemId.toString());

  if (hasSubmittedProblem) {
    return res
      .status(400)
      .json({ message: "Problem already submitted by the team" });
  }


  // Combine the inputs and hiddenInputs arrays into a single inputs array
const inputs = [...problem.inputs, ...problem.hiddenInputs];

// Combine the outputs and hiddenOutputs arrays into a single outputs array
const outputs = [...problem.outputs, ...problem.hiddenOutputs];

  // Create an array to store the submission results
  const submissionResults = [];

  let allAccepted = true; // Track if all test cases are accepted

  // Iterate over the inputs and expected outputs
  for (let i = 0; i < inputs.length; i++) {
    const stdin = inputs[i];
    const expectedOutput = outputs[i];

    // Call the submit function asynchronously for each input-output pair
    const status = await exports.submit(code, language, stdin, expectedOutput);

    // Add the result to the submissionResults array
    submissionResults.push({
      input: stdin,
      expectedOutput: expectedOutput,
      status: status || "Pending",
    });

    // If the status is not 'Accepted', mark allAccepted as false and stop submitting further test cases
    if (status !== "Accepted") {
      allAccepted = false;
      const testCaseNumber = i + 1;
      return res.status(400).json({
        message: `${status} on test case number ${testCaseNumber}`,
        status: submissionResults,
      });
    }
  }

  // Update the problem's status based on the overall result
  const problemStatus = allAccepted
    ? "Accepted"
    : submissionResults[submissionResults.length - 1].status;

  // If the problem is accepted and the team hasn't submitted it before, increment the number of solved problems
  if (allAccepted && !hasSubmittedProblem) {
    team.numberOfSolvedProblems = (team.numberOfSolvedProblems || 0) + 1;
  }

  // Add the submitted problem to the team's submittedProblems array
  team.solvedProblems.push(problem._id);

  // Update the team's solved problems count and submitted problems array within the contest object
  await contest.save();

  // Send success response
  res.status(200).json({
    message: "Problem submitted successfully",
    status: submissionResults,
  });
});

// team.teamMembers.includes(req.user._id) &&

exports.submitProblem = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const problemId = req.params.id;
  const { code, language } = req.body;

  const problem = await Problem.findById(problemId);
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Combine the inputs and hiddenInputs arrays into a single inputs array
const inputs = [...problem.inputs, ...problem.hiddenInputs];

// Combine the outputs and hiddenOutputs arrays into a single outputs array
const outputs = [...problem.outputs, ...problem.hiddenOutputs];

  // Create an array to store the submission results
  const submissionResults = [];

  let allAccepted = true; // Track if all test cases are accepted

  // Iterate over the inputs and expected outputs
  for (let i = 0; i < inputs.length; i++) {
    const stdin = inputs[i];
    const expectedOutput = outputs[i];

    // Call the submit function asynchronously for each input-output pair
    const status = await exports.submit(code, language, stdin, expectedOutput);

    // Add the result to the submissionResults array
    submissionResults.push({
      input: stdin,
      expectedOutput: expectedOutput,
      status: status || "Pending",
    });

    // If the status is not 'Accepted', mark all Accepted as false and stop submitting further test cases
    if (status !== "Accepted") {
      allAccepted = false;
      const testCaseNumber = i + 1;
      // Push the problem's status to the user's submittedProblems array
      user.submittedProblems.push({
        problem: problem._id, // Store problem id
        status: status,
      });
      await User.updateOne({ _id: userId }, user);

      return res.status(400).json({
        message: `${status} on test case number ${testCaseNumber}`,
        status: submissionResults,
      });
    }
  }

  // Update the problem's status based on the overall result
  const problemStatus = allAccepted
    ? "Accepted"
    : submissionResults[submissionResults.length - 1].status;

  if (allAccepted) {
    // Increment the numberOfSolutions if all test cases are accepted
    if (!isNaN(problem.numberOfSolutions)) {
      problem.numberOfSolutions = parseInt(problem.numberOfSolutions) + 1;
    } else {
      problem.numberOfSolutions = 1;
    }
  }

  // Push the problem's status to the user's submittedProblems array
  user.submittedProblems.push({
    problem: problem._id, // Store problem id
    status: problemStatus,
  });

  // Update the user and problem in the database
  await User.updateOne({ _id: userId }, user);
  await Problem.updateOne({ _id: problemId }, problem);

  // Send the response with the submission results
  res.status(200).json({
    message: "Problem submitted successfully",
    status: submissionResults,
  });
});

// Function to submit code and get the submission status
exports.submit = (code, language, stdin, expectedOutput) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Submit the code to Judge0 and get the submission token
      const submissionToken = await judge0Utils.submitCodeToJudge0(
        code,
        language,
        stdin,
        expectedOutput
      );
      // Store the submissionToken in your database or associate it with the user's submission

      // Get the submission status from Judge0 using the submission token
      const status = await judge0Utils.getSubmissionStatusFromJudge0(
        submissionToken
      );

      // Return the submission status
      resolve(status);
    } catch (error) {
      console.error("Error submitting code:", error);
      reject(error);
    }
  });
};
