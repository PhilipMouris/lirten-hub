import React, { Component } from "react";
import { Segment, Header, Icon } from "semantic-ui-react";
import "../../styling/PartnerProfile.css";

export default class MemberActions extends Component {
  render() {
    const {
      editProfile,
      submitReview,
      myProfile,
      partnerType,
      changePassword,
      deleteProfile,
      openJobApps
    } = this.props;
    if (!myProfile && !partnerType) return null;
    return (
      <Segment padded id="member-actions">
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
            <Header size="small" onClick={openJobApps} className="click">
              My Applications
              <Icon id="action-icon" color="teal" name="wpforms" />
            </Header>

            <Header size="small" color="red" onClick={deleteProfile} className="click">
              Delete Profile
              <Icon id="action-icon"  color="red" name="close" />
            </Header>
          </div>
        ) : null}
        {partnerType ? (
          <Header size="small" onClick={submitReview} className="click">
            Review
            <Icon id="action-icon" color="teal" name="reply" />
          </Header>
        ) : null}
      </Segment>
    );
  }
}
