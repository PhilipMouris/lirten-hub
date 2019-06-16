import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Landing extends Component {
  render() {
    return (
      <div className="landing">
        <div className="landing-text">
          <h1>Where talent meets opportunity</h1>
          <p>
            Whether you are want to hire or get hired, you have come to the
            right place
          </p>
          <Link to="/SignUp">
            <button>Get Started for Free</button>
          </Link>
        </div>
        <img
          src="/assets/landing-showcase.png"
          alt="ipad/iphone"
          className="landing-showcase"
        />
      </div>
    );
  }
}
