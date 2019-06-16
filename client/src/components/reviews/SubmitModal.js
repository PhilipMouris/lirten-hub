import React, { Component } from "react";
import * as axios from "../../services/axios.js";
import decode from "jwt-decode";
import {
  Modal,
  Button,
  Header,
  Rating,
  Grid,
  Dimmer,
  Loader,
  Form,
  TextArea,
  List
} from "semantic-ui-react";
import "../../styling/applyModal.css";
class SubmitModal extends Component {
  constructor() {
    super();
    this.state = {
      reviewText: "",
      rating: 0,
      partnerId: "",
      member: null
    };
  }
  handleChange = (e, { value }) => {
    if (value != "") {
      this.setState({ disabled: false, reviewText: value });
    } else {
      this.setState({ disabled: true, reviewText: value });
    }
  };
  getCurrentPartner = () => {
    // let decoded = decode(localStorage.getItem("jwtToken"));
    // if (decoded.type) {
    //   if (decoded.type === "partner") {
    //     this.setState({ partnerId: decoded.id });
    //     return decoded.id;
    //   }
    // }
    return "5ca9f44f4af55e8cbcdd9a52";
  };
  handleRate = (e, { rating, maxRating }) => {
    this.setState({ rating });
  };
  handleClick = () => {
    let url = "reviews/create";
    this.setState({ loading: true });
    const { member, partner } = this.props;
    const partnerID = this.props.partnerId;
    const { reviewText, rating } = this.state;
    let body = {
      reviewText: reviewText,
      rating: rating + "",
      partnerID: partnerID,
      memberID: member._id
    };
    axios.post(url, body).then(data => {
      this.props.add(data.data.data);
      this.setState({ loading: false });
      const notifUrl = `subscribers/send`;
      const req = {
        userIds: [member._id],
        data: {
          title: "Review!",
          body: `New Review posted on your profile`,
          link: `/Member/${member._id}`,
          actionTitle: "Visit",
          img: data.data.data.partner.image
        }
      };
      axios.post(notifUrl, req);
      this.props.close();
    });
  };

  render() {
    const { memberId, open, member } = this.props;
    const { loading } = this.state;
    const name = member ? member.name : "N/A";
    const placeholder = "What do you think about " + name;
    return (
      <Modal closeIcon open={open} onClose={this.props.close}>
        <Modal.Header className="modal-header" inverted>
          Submit a Review
        </Modal.Header>
        <Modal.Content>
          <Grid padded columns={2} divided>
            <Grid.Row>
              <Grid.Column>
                <Header as="h3"> Member Details</Header>
                <Header as="h5">
                  Name: <span>{member ? member.name : "N/a"}</span>
                </Header>
                <Header as="h5">
                  Skills:{" "}
                  <span>
                    {member ? (
                      <List bulleted>
                        {" "}
                        {member.userData.skills &&
                          member.userData.skills.map(skill => (
                            <List.Item>{skill}</List.Item>
                          ))}
                      </List>
                    ) : (
                      "N/a"
                    )}
                  </span>
                </Header>
                <Header as="h5">
                  Availability:{" "}
                  <span>{member ? member.userData.availability : "N/a"}</span>
                </Header>
                <Header as="h5">
                  Location:{" "}
                  <span>{member ? member.userData.location : "N/a"}</span>
                </Header>
              </Grid.Column>
              <Grid.Column stretched>
                <Form.Field>
                  <Header as="h3">Rating</Header>
                  <Rating
                    icon="star"
                    size="large"
                    maxRating={5}
                    onRate={this.handleRate}
                  />
                </Form.Field>
                <Header as="h3">Review Text</Header>
                <Form>
                  <Form.Field required>
                    <TextArea
                      rows={8}
                      onChange={this.handleChange}
                      placeholder={placeholder}
                    />
                  </Form.Field>
                </Form>

                <div id="sendAppButton">
                  <Button
                    loading={loading}
                    disabled={this.state.disabled}
                    onClick={this.handleClick}
                    color="yellow"
                    style={{ marginTop: "1em" }}
                  >
                    Send Review
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
export default SubmitModal;
