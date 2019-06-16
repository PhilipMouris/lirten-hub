const express = require("express");
const Vacancy = require("../../models/Vacancy");
const JobApplication = require("../../models/JobApplication");
const validator = require("../../validations/jobApplicationValidation");
const User = require("../../models/User");
const passport = require("passport");

const router = express.Router();
router.get("/", async (req, res) => {
  const jobApplications = await JobApplication.find();
  return res.json({ data: jobApplications });
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const jobApplication = await JobApplication.findById(id);
    if (!jobApplication)
      // Bad request if not found
      return res.status(400).send({ error: "Job Application not found" });
    return res.json({ data: jobApplication });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

router.get(
  "/VacancyApplications/:vacancyId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { vacancyId } = req.params;
      const vacancy = await Vacancy.findById(vacancyId);
      if (!vacancy)
        // Bad request if not found
        return res.status(400).send({ error: "vacancy not found" });
      if (req.user.id != vacancy.partner._id) return res.sendStatus(401);
      const query = { "vacancy._id": vacancyId };
      const vacancyApplications = await JobApplication.find(query);
      return res.json({ data: vacancyApplications });
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  }
);

router.get("/MemberApplications/:memberId", async (req, res) => {
  try {
    const { memberId } = req.params;
    const member = await User.findOne({ _id: memberId, type: "member" });
    if (!member)
      // Bad request if not found
      return res.status(400).send({ error: "member not found" });
    const query = { "member._id": memberId };
    const memberApplications = await JobApplication.find(query);
    return res.json({ data: memberApplications });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      if (req.user.type !== "member") return res.sendStatus(401);
      const { memberId, vacancyId, applicationText } = req.body;
      const isValidated = validator.createValidation(req.body);
      if (isValidated.error) {
        return res
          .status(400)
          .send({ error: isValidated.error.details[0].message });
      }
      const member = await User.findOne({ _id: memberId, type: "member" });
      if (!member)
        // Bad request if not found
        return res.status(400).send({ error: "member not found" });
      const vacancy = await Vacancy.findById(vacancyId);
      if (!vacancy)
        // Bad request if not found
        return res.status(400).send({ error: "vacancy not found" });
      const jobApplication = await JobApplication.create({
        member,
        vacancy,
        applicationText
      });
      return res.json({ data: jobApplication });
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  }
);
//only applicationText can be updated [vacancy,member,datePosted] are not allowed
router.put(
  "/update/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id } = req.params;
      const jobApplication = await JobApplication.findById(id);
      const isValidated = validator.updateValidation(req.body);
      if (!jobApplication)
        // Bad request if not found
        return res.status(400).send({ error: "job application not found" });
      if (
        !(
          req.user.id == jobApplication.member._id ||
          req.user.id == jobApplication.vacancy.partner._id
        )
      )
        return res.sendStatus(401);
      if (isValidated.error) {
        return res
          .status(400)
          .send({ error: isValidated.error.details[0].message });
      }
      const { applicationText, state } = req.body;
      await JobApplication.updateOne({ _id: id }, { applicationText, state });
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  }
);

router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id } = req.params;
      const jobApplication = await JobApplication.findById(id);
      if (!jobApplication)
        // Bad request if not found
        return res.status(400).send({ error: "job application not found" });
      if (
        !(req.user.type === "admin" || req.user.id == jobApplication.member._id)
      )
        return res.sendStatus(401);
      const deletedJobApplication = await JobApplication.findByIdAndRemove(id);
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  }
);

module.exports = router;
