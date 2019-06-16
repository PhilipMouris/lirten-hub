import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class LifeCoachSection extends Component {
  render() {
    return (
      <div className="homepage-lifecoaches">
        <h4>
          Robust life coaches that are guaranteed to propel your life forwards
        </h4>
        <Link to="/LifeCoaches">
          <button>View Our Life Coaches</button>
        </Link>
      </div>
    );
  }
}
