import React, { Component } from "react";
import * as axios from "../services/axios.js";
import ApplyModal from "../components/vacancies/ApplyModal";
import decode from "jwt-decode";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  Button,
  Grid,
  Header,
  Card,
  Divider,
  Loader,
  Container,
  Dimmer,
  Image,
  Icon,
  Responsive
} from "semantic-ui-react";
import "../styling/vacancy.css";

class Vacancy extends Component {
  constructor() {
    super();
    this.state = {
      vacancy: null,
      modalHidden: true,
      applied: false,
      loading: false
    };
  }

  getVacancy = async () => {
    this.setState({ loading: true });
    const id = this.props.match.params.id;
    const url = "vacancies/" + id;
    await axios.get(url).then(vacancy => {
      this.setState({ vacancy: vacancy, loading: false });
    });
  };
  componentDidMount() {
    if (this.props.location.state) {
      const { vacancy } = this.props.location.state;
      this.setState({ vacancy });
    } else {
      this.getVacancy();
    }
  }

  handleApply = () => {
    this.setState({ modalHidden: false });
  };
  setApplied = () => {
    this.setState({ applied: true, modalHidden: false });
  };
  toggleHidden = () => {
    this.setState({ modalHidden: !this.state.modalHidden });
  };
  handleClose = () => {
    this.setState({ modalHidden: true });
  };
  redirectProfile = () => {
    const { vacancy } = this.state;
    const { partner } = vacancy;
    this.props.history.push({
      pathname: `/Partner/${partner._id}`,
      state: { partner }
    });
  };
  render() {
    const { vacancy, applied, loading } = this.state;
    const { userInfo } = this.props;
    let toBeReturned = "";
    let memberType = false;
    let memberId = "";
    let memberName = "";
    if (userInfo) {
      if (userInfo.type === "member") {
        memberType = true;
        memberId = userInfo.id;
        memberName = userInfo.name;
      }
    }

    if (!vacancy) {
      toBeReturned = (
        <div>
          <Dimmer active={loading}>
            <Loader size="huge" inverted />
          </Dimmer>
        </div>
      );
    } else {
      let {
        skills,
        _id,
        availability,
        description,
        duration,
        endDate,
        dailyHours,
        state,
        startDate,
        location,
        monthlyWage,
        title,
        partner
      } = vacancy;
      let skillCards = [];
      const imageSrc = partner.image
        ? partner.image
        : "https://react.semantic-ui.com/images/avatar/small/matthew.png";
      if (skills) {
        if (skills.length > 0) {
          skills.map(skill => {
            skillCards.push(
              <Card className="skill-card" fluid>
                <Card.Content textAlign="center">
                  <Card.Header id="skill-header">{skill}</Card.Header>
                </Card.Content>
              </Card>
            );
          });
        }
      }
      toBeReturned = [
        <Grid celled container stackable centered raised id="vacancyGrid">
          <Grid.Row>
            <Grid.Column textAlign="center">
              <Header as="h1">{title}</Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row centered columns={2}>
            <Grid.Column width={10} textAlign="left">
              <Container>
                <Header as="h3">Description</Header>
                <p>{description}</p>
              </Container>
            </Grid.Column>
            <Grid.Column width={6}>
              <Header textAlign="center">Employer Details</Header>
              <Card
                className="hvr-grow"
                onClick={this.redirectProfile}
                style={{ margin: "auto", cursor: "pointer" }}
              >
                <Image onClick={this.adminRedirect}>
                  <div
                    className="images"
                    style={{ backgroundImage: "url(" + imageSrc + ")" }}
                  />
                </Image>
                <Card.Content>
                  <Card.Header textAlign="center">{partner.name}</Card.Header>
                  <Card.Description>{partner.fieldOfWork}</Card.Description>
                </Card.Content>
              </Card>
              <Divider />
              <Grid.Row textAlign="center">
                {!applied ? (
                  <Button
                    fluid
                    disabled={!memberType}
                    onClick={this.handleApply}
                    color="green"
                  >
                    Apply On This Job
                  </Button>
                ) : (
                  <Button disabled={true} icon fluid>
                    <Icon name="check circle" color="green" />
                    Application in Process
                  </Button>
                )}
              </Grid.Row>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={5}>
            <Grid.Column width={8} textAlign="center">
              <Header as="h3">Skills</Header>
              <Card.Group itemsPerRow={2}>{skillCards}</Card.Group>
            </Grid.Column>
            <Grid.Column width={2}>
              <Container>
                <Header as="h3">Availability</Header>
                <p>{availability}</p>
              </Container>
              <Divider />
              <Container>
                <Header as="h3">Location</Header>
                <p>{location}</p>
              </Container>
            </Grid.Column>
            <Grid.Column width={2}>
              <Container>
                <Header as="h3">Start Date</Header>
                <p>{startDate ? startDate.toString().slice(0, 10) : "N/A"}</p>
              </Container>
              <Divider />
              <Container>
                <Header as="h3">End Date</Header>
                <p>{endDate ? endDate.toString().slice(0, 10) : "N/A"}</p>
              </Container>
            </Grid.Column>
            <Grid.Column width={2}>
              <Container>
                <Header as="h3">Duration</Header>
                <p>{duration}</p>
              </Container>
              <Divider />
              <Container>
                <Header as="h3">Monthly Wage</Header>
                <p>{monthlyWage}</p>
              </Container>
            </Grid.Column>
            <Grid.Column width={2}>
              <Container>
                <Header as="h3">Daily Hours</Header>
                <p>{dailyHours}</p>
              </Container>
              <Divider />
              <Container>
                <Header as="h3">State</Header>
                <p>{state}</p>
              </Container>
            </Grid.Column>
          </Grid.Row>
        </Grid>,

        <ApplyModal
          memberName={memberName}
          vacancy={this.state.vacancy}
          memberId={memberId}
          hidden={this.state.modalHidden}
          handleClose={this.handleClose}
          applied={() => this.setApplied()}
        />
      ];
    }
    return toBeReturned;
  }
}
const mapStateToProps = state => {
  const { userInfo } = state;
  return { userInfo };
};
export default withRouter(connect(mapStateToProps)(Vacancy));
