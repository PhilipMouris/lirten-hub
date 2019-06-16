import React, { Component } from "react";
import "../styling/Homepage.css";
import Landing from "../components/homepage/Landing";
import Partners from "../components/homepage/Partners";
import Info from "../components/homepage/Info";
import LifeCoachSection from "../components/homepage/LifeCoachSection";
import Feedback from "../components/homepage/Feedback";

export default class HomePage extends Component {
  render() {
    return (
      <div>
        <Landing />
        <Partners />
        <Info />
        <LifeCoachSection />
        <Feedback />
      </div>
    );
  }
}
