import React, { Component } from "react";
import {
  Segment,
  Header,
  Icon,
  Message,
  Input,
  Transition,
  Comment
} from "semantic-ui-react";
import "../../styling/PartnerProfile.css";
import { get, del, put } from "../../services/axios";
import FeedBackCard from "./FeedBackCard";

export default class FeedbackSegment extends Component {
  state = {
    loading: true,
    error: false,
    added: {}
  };
  componentDidMount() {
    const { id } = this.props;
    const url = `feedback/readPartnerFeedbacks/${id}`;
    get(url)
      .then(feedbacks => {
        this.setState({
          feedbacks,
          feedbackCount: feedbacks.length,
          loading: false,
          error: false
        });
      })
      .catch(error => {
        this.setState({ loading: false, error: true });
      });
  }
  componentWillReceiveProps(nextProps) {
    const { added } = this.state;
    const { _id } = added;
    const { data } = nextProps.feedback;
    if (data) {
      if (_id !== data._id) this.addFeedBack(data);
    }
  }

  addFeedBack = feedback => {
    const { feedbacks, feedbackCount } = this.state;
    feedbacks.push(feedback);
    const newCount = feedbacks.length;
    this.setState({ feedbacks, feedbackCount: newCount });
  };
  editFeedBack = (id, feedbackText) => {
    const url = `feedback/update/${this.props.id}/${id}`;
    put(url, { feedbackText }).catch(error => {
      this.setState({ error: true });
    });
    const { feedbacks } = this.state;
    const index = feedbacks.findIndex(feedback => feedback._id === id);
    feedbacks[index].feedbackText = feedbackText;
    this.setState({ feedbacks });
  };
  deleteFeedBack = id => {
    const { feedbacks } = this.state;
    const url = `feedback/delete/${this.props.id}/${id}`;
    del(url, {}).catch(error => {
      this.setState({ error: true });
    });
    const index = feedbacks.findIndex(feedback => feedback._id === id);
    feedbacks.splice(index, 1);
    this.setState({ feedbacks });
  };
  render() {
    const {
      loading,
      error,
      action,
      actionId,
      feedbackCount,
      feedbacks
    } = this.state;
    const { myProfile, memberId } = this.props;
    return (
      <Segment
        style={{ marginBottom: "1em" }}
        id="vacancy-segment"
        loading={loading}
        padded
      >
        <Message className="error-message" compact error hidden={!error} icon>
          <Icon size="mini" name="times circle" />
          Something went wrong !
        </Message>
        <Header as="h1" textAlign="center">
          {myProfile ? "My Feedback" : "Feedback"}
        </Header>
        {feedbacks ? (
          <div>
            <Header textAlign="center">
              <Message info compact hidden={feedbacks.length > 0}>
                No feedbacks yet
              </Message>
            </Header>
            <Comment.Group>
              <Transition.Group duration={400}>
                {feedbacks.map(feedback => (
                  <div key={feedback._id}>
                    <FeedBackCard
                      memberId={memberId}
                      edit={this.editFeedBack}
                      del={this.deleteFeedBack}
                      feedback={feedback}
                    />
                  </div>
                ))}
              </Transition.Group>
            </Comment.Group>
          </div>
        ) : null}
      </Segment>
    );
  }
}
