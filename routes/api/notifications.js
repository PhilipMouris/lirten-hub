const express = require("express");
const Joi = require("joi");
const router = express.Router();
const Notifications = require("../../models/Notifications");

router.get("/", async (req, res) => {
  const notifications = await Notifications.find();
  return res.json({ data: notifications });
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const notifications = await Notifications.find({ userId: id });
  return res.json({ data: notifications });
});
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  await Notifications.findByIdAndRemove(id);
  return res.sendStatus(200);
});
router.delete("/deleteAll/:userId", async (req, res) => {
  const { userId } = req.params;
  await Notifications.deleteMany({ userId });
  return res.sendStatus(200);
});
router.put("/markAsRead/:userId", async (req, res) => {
  const { userId } = req.params;
  await Notifications.updateMany({ userId }, { read: true });
  return res.sendStatus(200);
});

module.exports = router;
