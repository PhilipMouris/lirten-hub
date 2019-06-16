import React from "react";
import { Route } from "react-router-dom";
import Vacancy from "./pages/Vacancy";
import SignUp from "./pages/SignUp";
import Vacancies from "./pages/Vacancies";
import CreateVacancy from "./pages/CreateVacancy";
import SubmitModal from "./components/reviews/SubmitModal";
import SubmitFeedbackModal from "./components/feedbacks/SubmitFeedbackModal";
import EditProfileTest from "./pages/EditProfileTest";
import EditProfile from "./pages/EditProfile";
import Members from "./pages/Members";
import Partners from "./pages/Partners";
import LifeCoaches from "./pages/LifeCoaches";
import LifeCoachProfile from "./pages/LifeCoachProfile";
import PartnerProfile from "./pages/PartnerProfile";
import HomePage from "./pages/HomePage";
import CreateAdmin from "./pages/CreateAdmin";
import MemberProfile from "./pages/MemberProfile";

export default () => {
  return [
    <Route key={"/EditTest"} path="/EditTest" component={EditProfileTest} />,
    <Route key={"/EditProfile"} path="/EditProfile" component={EditProfile} />,
    <Route key={"/SubmitModal"} path="/SubmitModal" component={SubmitModal} />,
    <Route
      key={"/SubmitFeedbackModal"}
      path="/SubmitFeedbackModal"
      component={SubmitFeedbackModal}
    />,
    <Route key={"/Vacancy"} exact path="/Vacancy/:id" component={Vacancy} />,
    <Route
      key={"/SignUp"}
      exact
      path="/SignUp"
      state={"hi"}
      component={SignUp}
    />,
    <Route key={"/Vacancies"} path="/Vacancies" component={Vacancies} />,
    <Route
      key={"/CreateVacancy"}
      exact
      path="/CreateVacancy/:partnerId"
      component={CreateVacancy}
    />,
    <Route key={"/Members"} exact path="/Members" component={Members} />,
    <Route key={"/Partners"} exact path="/Partners" component={Partners} />,
    <Route
      key={"/lifeCoaches"}
      exact
      path="/LifeCoaches"
      component={LifeCoaches}
    />,
    <Route
      key={"/LifeCoach"}
      exact
      path="/LifeCoach/:id"
      component={LifeCoachProfile}
    />,
    <Route
      key={"/Partner"}
      exact
      path="/Partner/:id"
      component={PartnerProfile}
    />,
    <Route
      key={"/EditVacancy"}
      exact
      path={"/EditVacancy/:partnerId"}
      component={CreateVacancy}
    />,
    <Route key={"/HomePage"} exact path={"/"} component={HomePage} />,
    <Route
      key={"/CreateAdmin"}
      exact
      path="/CreateAdmin"
      component={CreateAdmin}
    />,
    <Route key={"/Member"} exact path="/Member/:id" component={MemberProfile} />
  ];
};
