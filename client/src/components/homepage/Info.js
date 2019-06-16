import React, { Component } from "react";
import { Icon } from "semantic-ui-react";

export default class Info extends Component {
  render() {
    return (
      <div className="homepage-info-section">
        <div>
          <Icon name="list" size="big" />
          <h3>Freelance Jobs</h3>
          <p>
            We offer freelance jobs from a wide range of finely selected
            partners. Our freelance jobs need all sorts of skills, whatever you
            can do, we have something for you.
          </p>
        </div>
        <div>
          <Icon name="wpforms" size="big" />
          <h3>Vacancies</h3>
          <p>
            Are you more of a commitment person? We got you covered! Choose from
            an endless catalogue of vacancies finely selected by our team from
            our top notch partners.
          </p>
        </div>
        <div>
          <Icon name="add" size="big" />
          <h3>Services</h3>
          <p>
            From life coaching and live events, to certifications and
            masterclasses, we offer everything you may need to develop yourself
            and push your career forward.
          </p>
        </div>
      </div>
    );
  }
}
