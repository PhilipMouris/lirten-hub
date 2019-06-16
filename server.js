const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");
const path = require("path");
// API Imports go here
const users = require("./routes/api/users");
const vacancies = require("./routes/api/vacancies");
const jobApplications = require("./routes/api/jobApplications");
const feedbacks = require("./routes/api/feedback");
const slots = require("./routes/api/slot");
const review = require("./routes/api/review");
const recommender = require("./services/recommendations");
const subscribers = require("./routes/api/subscribers");
const notifications = require("./routes/api/notifications");

const app = express();
app.use(cors());
// DB Config
const db = require("./config/keys").mongoURI;
const dbConfig = { useNewUrlParser: true };
mongoose
  .connect(
    db,
    dbConfig
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
// Passport configuration
require("./config/passport")(passport);

//firebase serviceworker
app.get("/messageTest", (req, res) => {
  res.sendFile(path.join(__dirname + "/messageTest.html"));
});
/*app.get("/firebase-messaging-sw.js", (req, res) => {
  res.sendFile(path.join(__dirname + "/firebase-messaging-sw.js"));
});*/

// API Routes go here
app.use("/api/users", users);
app.use("/api/vacancies", vacancies);
app.use("/api/jobApplications", jobApplications);
app.use("/api/feedback", feedbacks);
app.use("/api/slots", slots);
app.use("/api/reviews", review);
app.use("/api/subscribers", subscribers);
app.use("/api/notifications", notifications);

recommender.setVacanciesProperties();
recommender.setMemberProperties();
// recommender.resetDatabase();
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// 404s
app.use((req, res) => {
  return res.sendStatus(404);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server up and running on port ${port}`));
