const express = require("express");
const User = require("../../models/User");
const validator = require("../../validations/lifeCoachesValidation");
const LifeCoach = require("../../models/LifeCoach");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const router = express.Router();
router.get("/", async (req, res) => {
  const lifeCoaches = await User.find({ type: "lifeCoach" });
  return res.json({ data: lifeCoaches });
});

router.post("/create", async (req, res) => {
  const isValidated = validator.createValidation(req.body);
  if (isValidated.error) {
    return res
      .status(400)
      .send({ error: isValidated.error.details[0].message });
  }
  const { name, email, password, image, ...userData } = req.body;
  const emailCheck = await User.findOne({ email });
  if (emailCheck)
    return res.status(400).json({ error: "Email already exists" });
  //hashing password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  const { dateOfBirth } = userData;
  const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
  userData.age = age;
  const lifeCoach = new LifeCoach(userData);
  const user = await User.create({
    type: "lifeCoach",
    name,
    email,
    image,
    userData: lifeCoach,
    password: hashedPassword
  });
  return res.json({ data: user });
});
router.put(
  "/update/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id } = req.params;
      if (req.user.id !== id && req.user.type !== "member")
        return res.sendStatus(401);
      const query = { _id: id, type: "lifeCoach" };
      const user = await User.findOne(query);
      const isValidated = validator.updateValidation(req.body);
      if (!user)
        // Bad request if not found
        return res.status(400).send({ error: "id not found" });
      if (isValidated.error) {
        return res
          .status(400)
          .send({ error: isValidated.error.details[0].message });
      }
      const { name, email, image, ...userData } = req.body;
      const emailCheck = await User.findOne({ _id: { $ne: id }, email });
      if (emailCheck)
        return res.status(400).json({ error: "Email already exists" });
      const { dateOfBirth } = userData;
      const newAge =
        new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
      userData.age = newAge;
      //saving monthlySlots (can only be updated from slot routes)
      userData.monthlySlots = user.userData.monthlySlots;
      userData.joinDate = user.userData.joinDate;
      if (!userData.ratings)
        if (user.userData.ratings) userData.ratings = user.userData.ratings;
      await User.updateOne(query, { name, email, image, userData });
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  }
);

module.exports = router;
