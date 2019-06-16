import React, { Component } from "react";
import { Responsive, Image, Grid } from "semantic-ui-react";
import SignUp from "../components/Signup/SignUpForm";
import EditProfileForm from "../components/profiles/EditProfileForm";
import { withRouter } from "react-router-dom";
class EditProfile extends Component {
  redirectProfile = (id, user) => {
    if (user.type === "partner") {
      user._id = id;
      this.props.history.push({
        pathname: `/Partner/${id}`
      });
    } else if (user.type === "lifeCoach") {
      user._id = id;
      this.props.history.push({
        pathname: `/LifeCoach/${id}`
      });
    } else if (user.type === "member") {
      user._id = id;
      this.props.history.push({
        pathname: `/Member/${id}`
      });
    }
  };
  render() {
    return (
      <div>
        <Responsive {...Responsive.onlyComputer}>
          <Grid columns={3}>
            <Grid.Column width={4} />
            <Grid.Column width={8}>
              <EditProfileForm
                redirect={this.redirectProfile}
                user={this.props.location.user}
              />
            </Grid.Column>
            <Grid.Column width={4} />
          </Grid>
        </Responsive>
        <Responsive {...Responsive.onlyTablet}>
          <EditProfileForm
            redirect={this.redirectProfile}
            user={this.props.location.user}
          />
        </Responsive>
        <Responsive {...Responsive.onlyMobile}>
          <EditProfileForm
            redirect={this.redirectProfile}
            user={this.props.location.user}
          />
        </Responsive>
      </div>
    );
  }
}
export default withRouter(EditProfile);
