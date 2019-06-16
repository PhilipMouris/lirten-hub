import React, { Component } from "react";
import { Segment, Header, Icon } from "semantic-ui-react";
import "../../styling/PartnerProfile.css";

export default class ActionSegment extends Component {
  render() {
    const {
      editProfile,
      createVacancy,
      submitFeedback,
      changePassword,
      myProfile,
      deleteProfile,
      memberType
    } = this.props;
    if (!myProfile && !memberType) return null;
    console.log(changePassword, "HII");
    return (
      <Segment padded id="action-segment">
        {myProfile ? (
          <div>
            <Header size="small" onClick={editProfile} className="click">
              Edit Profile
              <Icon id="action-icon" color="yellow" name="edit" />
            </Header>
            <Header size="small" onClick={changePassword} className="click">
              Change Password
              <Icon id="action-icon" color="black" name="lock" />
            </Header>
            <Header size="small" onClick={createVacancy} className="click">
              Add Vacancy
              <Icon id="action-icon" color="green" name="plus" />
            </Header>
            <Header
              size="small"
              color="red"
              onClick={deleteProfile}
              className="click"
            >
              Delete Profile
              <Icon id="action-icon" color="red" name="close" />
            </Header>
          </div>
        ) : null}
        {memberType ? (
          <Header size="small" onClick={submitFeedback} className="click">
            Feedback
            <Icon id="action-icon" color="teal" name="reply" />
          </Header>
        ) : null}
      </Segment>
    );
  }
}
