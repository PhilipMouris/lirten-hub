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
import ReviewCard from "./ReviewCard";
export default class FeedbackSegment extends Component {
  state = {
    error: false,
    added: {}
  };
  del = id => {
    this.props.del(id);
  };
  edit = (id, reviewTextEdit, editRating) => {
    this.props.edit(id, reviewTextEdit, editRating);
  };
  render() {
    const { error } = this.state;
    const { myProfile, partnerId, reviews, reviewsCount } = this.props;
    console.log(reviews, "REVIEWSS");
    return (
      <Segment style={{ marginBottom: "1em" }} id="vacancy-segment" padded>
        <Header as="h1" textAlign="center">
          {myProfile ? "My Reviews" : "Reviews"}
          {reviewsCount >= 0 ? ` (${reviewsCount})` : ""}
        </Header>
        {reviews ? (
          <div>
            <Header textAlign="center">
              <Message info compact hidden={reviews.length > 0}>
                No Reviews yet
              </Message>
            </Header>
            <Comment.Group>
              <Transition.Group duration={400}>
                {reviews.map(review => (
                  <div key={review._id}>
                    <ReviewCard
                      partnerId={partnerId}
                      edit={this.edit}
                      del={this.del}
                      review={review}
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
