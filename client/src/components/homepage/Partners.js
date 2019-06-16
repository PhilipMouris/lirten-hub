import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Partners extends Component {
  render() {
    return (
      <div className="partners-section">
        <h1>The Top Brands in the World are our Partners</h1>
        <div>
          <img src="/assets/facebook.png" alt="facebook" />
          <img src="/assets/twitter.png" alt="twitter" />
          <img src="/assets/apple.png" alt="apple" />
          <img src="/assets/tesla.png" alt="tesla" />
          <img src="/assets/google.png" alt="google" />
          <img src="/assets/ibm.png" alt="ibm" />
          <img src="/assets/samsung.png" alt="samsung" />
          <img src="/assets/youtube.png" alt="youtube" />
          <img src="/assets/linkedin.png" alt="linkedin" />
          <img src="/assets/uber.png" alt="uber" />
        </div>
        <Link to="/Partners">
          <button>View All Partners</button>
        </Link>
      </div>
    );
  }
}
