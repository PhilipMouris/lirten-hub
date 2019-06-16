import React, { Component } from "react";
import { Responsive, Image, Grid } from "semantic-ui-react";
import SignUp from "../components/Signup/SignUpForm";
class SignUpPage extends Component {
  redirect = () => {
    this.props.history.push("/");
  };
  render() {
    return (
      <div>
        <Responsive {...Responsive.onlyComputer}>
          <Grid columns={3}>
            <Grid.Column width={4} />
            <Grid.Column width={8}>
              <SignUp redirect={this.redirect} />
            </Grid.Column>
            <Grid.Column width={4} />
          </Grid>
        </Responsive>
        <Responsive {...Responsive.onlyTablet}>
          <SignUp redirect={this.redirect} />
        </Responsive>
        <Responsive {...Responsive.onlyMobile}>
          <SignUp redirect={this.redirect} />
        </Responsive>
      </div>
    );
  }
}
export default SignUpPage;
