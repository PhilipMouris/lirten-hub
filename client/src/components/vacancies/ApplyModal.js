import React, { Component } from "react";
import * as axios from "../../services/axios.js";
import decode from "jwt-decode";
import { Modal, Button, Header, Grid, Form, TextArea } from "semantic-ui-react";
import "../../styling/applyModal.css";
class ApplyModal extends Component {
  constructor() {
    super();
    this.state = {
      applicationText: "",
      disabled: true,
      loading: false
    };
  }

  handleChange = (e, { value }) => {
    if (value != "") {
      this.setState({ disabled: false, applicationText: value });
    } else {
      this.setState({ disabled: true, applicationText: value });
    }
  };
  handleClick = () => {
    this.setState({ loading: true });
    let url = "jobApplications/create";
    const { vacancy, memberId, memberName } = this.props;
    const { applicationText } = this.state;
    let body = {
      vacancyId: vacancy._id,
      memberId: memberId,
      applicationText: applicationText
    };
    axios.post(url, body).then(data => {
      this.props.applied();
      this.setState({ loading: false });
      this.props.handleClose();
      const notifUrl = `subscribers/send`;
      const req = {
        userIds: [vacancy.partner._id],
        data: {
          title: "Job Application!",
          body: `${memberName} has applied on ${
            vacancy.title ? vacancy.title : "your vacancy"
          }`,
          link: `/Partner/${vacancy.partner._id}`,
          actionTitle: "Visit",
          img: data.data.data.member.image
        }
      };
      axios.post(notifUrl, req).then(resp => console.log(resp));
    });
  };

  render() {
    let { memberId, vacancy, handleClose, hidden } = this.props;
    const { loading } = this.state;
    return (
      <Modal closeIcon open={!hidden} onClose={handleClose}>
        <Modal.Header as={Header} inverted className="modal-header">
          Send Job Application
        </Modal.Header>
        <Modal.Content>
          <Grid padded columns={2} divided>
            <Grid.Row>
              <Grid.Column>
                <Header as="h3">Vacancy Details:</Header>
                <Header as="h5">
                  Title: <span>{vacancy.title}</span>
                </Header>
                <Header as="h5">
                  Employer: <span>{vacancy.partner.name}</span>
                </Header>
                <Header as="h5">
                  Availability: <span>{vacancy.availability}</span>
                </Header>
                <Header as="h5">
                  Location: <span>{vacancy.location}</span>
                </Header>
                <Header as="h5">
                  Start Date:{" "}
                  <span>
                    {vacancy.startDate
                      ? vacancy.startDate.toString().slice(0, 10)
                      : "N/A"}
                  </span>
                </Header>
                <Header as="h5">
                  Duration: <span>{vacancy.duration}</span>
                </Header>
              </Grid.Column>
              <Grid.Column stretched>
                <Header as="h3">Application Text</Header>
                <Form>
                  <Form.Field required>
                    <TextArea
                      rows={8}
                      onChange={this.handleChange}
                      placeholder="Why would we hire you ?"
                    />
                  </Form.Field>
                </Form>

                <div id="sendAppButton">
                  <Button
                    loading={loading}
                    disabled={this.state.disabled}
                    onClick={this.handleClick}
                    color="yellow"
                  >
                    Send Application
                  </Button>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}
export default ApplyModal;
