import React, { Component } from "react";
import { Responsive, Grid, Message, Loader, Dimmer } from "semantic-ui-react";
import AdminForm from "../components/admin/AdminForm";
import { connect } from "react-redux";
import { get } from "../services/axios";

class CreateAdmin extends Component {
  state = {
    isSuper: false,
    loader: true
  };
  componentDidMount() {
    const { state } = this.props.location;
    if (state) {
      const { userInfo } = state;
      const url = `users/${userInfo.id}`;
      get(url).then(data => {
        if (data.userData.isSuper) this.setState({ isSuper: true });
        this.setState({ loader: false });
      });
    }
  }
  render() {
    const { isSuper, loader } = this.state;
    if (loader)
      return (
        <Dimmer active>
          <Loader size="massive" active />
        </Dimmer>
      );

    return (
      <div>
        {isSuper ? (
          <div>
            <Responsive {...Responsive.onlyComputer}>
              <Grid columns={3}>
                <Grid.Column />
                <Grid.Column>
                  <AdminForm isMobile={false} />
                </Grid.Column>
                <Grid.Column />
              </Grid>
            </Responsive>
            <Responsive {...Responsive.onlyTablet}>
              <AdminForm isMobile={false} />
            </Responsive>
            <Responsive {...Responsive.onlyMobile}>
              <AdminForm isMobile={true} />
            </Responsive>
          </div>
        ) : (
          <Message size="big" error icon>
            Only super admins are allowed
          </Message>
        )}
      </div>
    );
  }
}

export const mapStateToProps = state => {
  const { userInfo } = state;
  return { userInfo };
};

export default connect(mapStateToProps)(CreateAdmin);
