import React, { Component } from "react";
import { Responsive, Grid } from "semantic-ui-react";
import SuperAdminForm from "../components/admin/SuperAdminForm";
class CreateSuperAdmin extends Component {
  render() {
    return (
      <div>
        <Responsive {...Responsive.onlyComputer}>
          <Grid columns={3}>
            <Grid.Column />
            <Grid.Column>
              <SuperAdminForm isMobile={false} />
            </Grid.Column>
            <Grid.Column />
          </Grid>
        </Responsive>
        <Responsive {...Responsive.onlyTablet}>
          <SuperAdminForm isMobile={false} />
        </Responsive>
        <Responsive {...Responsive.onlyMobile}>
          <SuperAdminForm isMobile={true} />
        </Responsive>
      </div>
    );
  }
}
export default CreateSuperAdmin;