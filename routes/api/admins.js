const express = require("express");
const User = require("../../models/User");
const Admin = require("../../models/Admin");
const validator = require("../../validations/adminValidation");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const router = express.Router();
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user.type !== "admin") return res.sendStatus(401);
    const admins = await User.find({ type: "admin" });
    return res.json({ data: admins });
  }
);

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const tempUser = await User.findById(req.user.id);
    if (!(tempUser.type === "admin" && tempUser.userData.isSuper === true))
      return res.sendStatus(401);
    const isValidated = validator.createValidation(req.body);
    if (isValidated.error) {
      return res
        .status(400)
        .send({ error: isValidated.error.details[0].message });
    }
    const { name, email, password, image, ...userData } = req.body;
    //checking email
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.status(400).json({ error: "Email already exists" });
    //hashing password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const { dateOfBirth } = userData;
    const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
    userData.age = age;
    const admin = new Admin(userData);
    const user = await User.create({
      type: "admin",
      name,
      email,
      image,
      userData: admin,
      password: hashedPassword
    });
    return res.json({ data: user });
  }
);

router.put(
  "/update/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id } = req.params;
      if (req.user.id !== id) return res.sendStatus(401);
      const query = { _id: id, type: "admin" };
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
      const age =
        new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
      userData.age = age;
      await User.updateOne(query, { name, email, image, userData });
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  }
);

module.exports = router;
