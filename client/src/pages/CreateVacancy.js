import React, { Component } from "react";
import { Responsive, Image, Grid } from "semantic-ui-react";
import VacancyForm from "../components/vacancies/VacancyForm";
class CreateVacancy extends Component {
  render() {
    return (
      <div>
        <Responsive {...Responsive.onlyComputer}>
          <Grid columns={3}>
            <Grid.Column />
            <Grid.Column>
              <VacancyForm
                partnerId={this.props.match.params.partnerId}
                isMobile={false}
              />
            </Grid.Column>
            <Grid.Column>
              <Image style={{ marginTop: "2em" }} src="/assets/job.png" />
            </Grid.Column>
          </Grid>
        </Responsive>
        <Responsive {...Responsive.onlyTablet}>
          <VacancyForm
            partnerId={this.props.match.params.partnerId}
            isMobile={false}
          />
        </Responsive>
        <Responsive {...Responsive.onlyMobile}>
          <VacancyForm
            partnerId={this.props.match.params.partnerId}
            isMobile={true}
          />
        </Responsive>
      </div>
    );
  }
}
export default CreateVacancy;
