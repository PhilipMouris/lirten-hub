import React, { Component } from "react";
import {
  Header,
  Card,
  Image,
  Label,
  Grid,
  Divider,
  Button,
  Comment,
  TextArea,
  Rating
} from "semantic-ui-react";
import { withRouter } from "react-router-dom";
class ReviewCard extends Component {
  state = {
    edit: false,
    reviewTextEdit: ""
  };
  del = () => {
    const { _id } = this.props.review;
    this.props.del(_id);
  };
  edit = () => {
    const { reviewText, rating } = this.props.review;
    this.setState({
      edit: true,
      reviewTextEdit: reviewText,
      editRating: rating
    });
  };
  cancel = () => {
    const { reviewText } = this.props.review;
    this.setState({
      editRating: undefined,
      edit: false,
      reviewTextEdit: reviewText
    });
  };
  save = () => {
    const { reviewTextEdit, editRating } = this.state;
    const { _id } = this.props.review;
    this.setState({ edit: false });
    this.props.edit(_id, reviewTextEdit, editRating);
  };
  changeText = e => {
    this.setState({ reviewTextEdit: e.target.value });
  };
  handleRate = (e, { rating }) => this.setState({ editRating: rating });

  redirect = () => {
    const { partner } = this.props.review;
    this.props.history.push({
      pathname: `/Partner/${partner._id}`,
      state: { partner }
    });
  };

  render() {
    const { datePosted, reviewText, partner, rating } = this.props.review;
    const { email, name } = partner;
    const { edit, reviewTextEdit, editRating } = this.state;
    const { partnerId } = this.props;
    const imageSrc = partner.image
      ? partner.image
      : "https://react.semantic-ui.com/images/avatar/large/matthew.png";
    return (
      <div id="comment">
        <Comment size="large">
          <Comment.Avatar id="avatar" src={imageSrc} />
          <Comment.Content>
            <Comment.Author as="a" onClick={this.redirect}>
              {name}
              <Rating
                maxRating={5}
                onRate={this.handleRate}
                disabled={!edit}
                icon="star"
                rating={editRating || rating}
              />
            </Comment.Author>
            <Divider hidden fitted />
            <Comment.Metadata>
              <div>{datePosted.toString().slice(0, 10)}</div>
            </Comment.Metadata>
            <Comment.Text>
              {edit ? (
                <TextArea value={reviewTextEdit} onChange={this.changeText} />
              ) : (
                reviewText
              )}
            </Comment.Text>
            {partnerId === partner._id ? (
              <Comment.Actions>
                {edit ? (
                  [
                    <Comment.Action key="cance" onClick={this.cancel}>
                      Cancel
                    </Comment.Action>,
                    <Comment.Action key="Save" onClick={this.save}>
                      Save
                    </Comment.Action>
                  ]
                ) : (
                  <Comment.Action onClick={this.edit}>Edit</Comment.Action>
                )}
                <Comment.Action onClick={this.del}>{`Delete`}</Comment.Action>
              </Comment.Actions>
            ) : null}
          </Comment.Content>
        </Comment>
        <Divider />
      </div>
    );
  }
}
export default withRouter(ReviewCard);
