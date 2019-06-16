import React, { Component } from "react";
import "../../styling/PartnerProfile.css";
import {
  Modal,
  Loader,
  Header,
  Message,
  Icon,
  Transition,
  Grid
} from "semantic-ui-react";
import JobApplicationCard from "../partnerProfile/JobApplicationCard";
import { get, put, del } from "../../services/axios";

export default class MemberJobApps extends Component {
  state = {
    loading: true,
    actionId: ""
  };
  componentDidMount() {
    const { member } = this.props;
    const url = `jobApplications/MemberApplications/${member._id}`;
    get(url)
      .then(jobApplications => {
        this.setState({ loading: false, jobApplications });
      })
      .catch(err => {
        this.setState({ error: true });
      });
  }
  handleDelete = actionId => {
    this.setState({ actionId });
    const { jobApplications } = this.state;
    const url = `jobApplications/delete/${actionId}`;
    del(url, {})
      .then(() => {
        const index = jobApplications.findIndex(
          jobApp => jobApp._id === actionId
        );
        jobApplications.splice(index, 1);
        this.setState({ jobApplications, error: false });
      })
      .catch(err => this.setState({ error: true }));
  };
  render() {
    const { open, close } = this.props;
    const { loading, jobApplications, error, actionId } = this.state;
    return (
      <Modal size="small" open={open} onClose={close} closeIcon>
        <Modal.Header as={Header} inverted className="modal-header">
          View Job Applications
        </Modal.Header>
        <Modal.Content style={{ minHeight: "5em" }}>
          {loading ? <Loader id="workaround" size="massive" /> : null}
          <Header textAlign="center">
            <Message
              className="error-message"
              compact
              error
              hidden={!error}
              icon
            >
              <Icon size="mini" name="times circle" />
              Something went wrong !
            </Message>
            <Message
              style={{ marginBottom: "1em" }}
              info
              compact
              hidden={loading || jobApplications.length > 0}
            >
              No Job Applications found
            </Message>
          </Header>
          {jobApplications && (
            <Grid
              style={{ marginLeft: "0.5em" }}
              centered
              columns={2}
              stackable
            >
              <Transition.Group duration={400}>
                {jobApplications.map(jobApplication => (
                  <Grid.Column key={jobApplication._id}>
                    <JobApplicationCard
                      handleDelete={this.handleDelete}
                      actionId={actionId}
                      fromPartner={false}
                      key={jobApplication._id}
                      jobApplication={jobApplication}
                      fromMember={true}
                    />
                  </Grid.Column>
                ))}
              </Transition.Group>
            </Grid>
          )}
        </Modal.Content>
      </Modal>
    );
  }
}
