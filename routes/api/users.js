const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const tokenKey = require("../../config/keys").secretOrKey;
const Recovered = require("../../models/Recovered");
const router = express.Router();
const deleteMember = require("../../services/deleteMember");
const deletePartner = require("../../services/deletePartner");
const nodemailer = require("nodemailer");
const Email = require("../../mail/forgetPassword");
// Sub routes imports
const lifeCoaches = require("./lifeCoaches");
const members = require("./members");
const partners = require("./partners");
const admins = require("./admins");
const User = require("../../models/User");
// sub routes redirect
router.use("/partners", partners);
router.use("/lifeCoaches", lifeCoaches);
router.use("/members", members);
router.use("/admins", admins);
router.get("/", async (req, res) => {
  const usersDisplay = await User.find();
  return res.json({ data: usersDisplay });
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(400).send({ error: "id not found" });
    return res.json({ data: user });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { id } = req.params;
    try {
      if (!(req.user.type === "admin" || req.user.id === id))
        return res.sendStatus(401);
      const deletedUser = await User.findByIdAndRemove(id);
      if (!deletedUser) {
        return res.status(400).send({ error: "id not found" });
      }
      if (deletedUser.type === "member") await deleteMember(id);
      if (deletedUser.type === "partner") await deletePartner(id);
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  }
);

router.put(
  "/updatePassword/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { id } = req.params;
    if (req.user.id !== id) return res.sendStatus(401);
    const { oldPassword, newPassword } = req.body;
    const schema = {
      newPassword: Joi.string().required(),
      oldPassword: Joi.string().required()
    };
    const result = Joi.validate(req.body, schema);
    if (result.error)
      return res.status(400).send({ error: result.error.details[0].message });
    try {
      const user = await User.findById(id);
      if (!user) return res.status(400).send({ error: "id not found" });
      const { password } = user;
      const passwordCheck = bcrypt.compareSync(oldPassword, password);
      if (!passwordCheck)
        return res.status(400).send({ error: "Passwords don't match" });
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(newPassword, salt);
      await User.updateOne({ _id: id }, { password: hashedPassword });
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.status(400);
    }
  }
);

router.post("/login", async (req, res) => {
  try {
    const schema = {
      email: Joi.string().required(),
      password: Joi.string().required()
    };
    const result = Joi.validate(req.body, schema);
    if (result.error)
      return res.status(400).send({ error: result.error.details[0].message });
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Email does not exist" });
    const match = bcrypt.compareSync(password, user.password);
    if (match) {
      const payload = {
        id: user._id,
        type: user.type,
        name: user.name,
        email: user.email,
        image: user.image
      };
      const token = jwt.sign(payload, tokenKey, { expiresIn: "1h" });
      return res.json({ data: `Bearer ${token}` });
    } else return res.status(400).send({ error: "Wrong password" });
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
});

const replace = async (email, userId) => {
  let randomCode = "";
  for (let i = 0; i < 9; i++) {
    let charCode = Math.floor(Math.random() * (126 - 48) + 48);
    randomCode += String.fromCharCode(charCode);
  }
  const req = {
    from: "notification@lirtenHub.com",
    to: email,
    subject: "Password Reset",
    html: Email.replace("Code:", "Code: " + randomCode)
  };
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(randomCode, salt);
  const recoveredUser = await Recovered.findOne({ userId });
  if (recoveredUser) {
    await Recovered.updateOne({ userId }, { recovery: hashedPassword });
  } else {
    await Recovered.create({
      userId,
      recovery: hashedPassword
    });
  }

  return req;
};
router.post("/sendEmail", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.sendStatus(400);
    const request = await replace(email, user._id);
    transporter.sendMail(request, (error, info) => {
      if (error) {
        console.log(error);
        return res.sendStatus(400).send({ error });
      } else {
        console.log("Email sent: " + info.response);
        return res.json({ data: info.respose });
      }
    });
  } catch (error) {
    return res.sendStatus(400);
  }
});
router.post("/Recovery", async (req, res) => {
  try {
    const { recovery, email } = req.body;
    const userR = await User.findOne({ email });
    if (!userR) return res.sendStatus(400);
    const user = await Recovered.find({ userId: userR._id });
    if (!user) return res.sendStatus(400);
    const match = bcrypt.compareSync(recovery, user[0].recovery);
    if (match) {
      return res.json({ data: 1 });
    } else {
      return res.json({ data: -1 });
    }
  } catch (error) {
    console.log(error, "error");
    return res.sendStatus(400);
  }
});
router.post("/forgotPassword", async (req, res) => {
  try {
    const { password, email } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    await User.updateOne({ email }, { password: hashedPassword });
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
});

module.exports = router;
