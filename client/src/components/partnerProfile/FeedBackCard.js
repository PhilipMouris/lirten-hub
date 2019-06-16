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
  TextArea
} from "semantic-ui-react";
import { withRouter } from "react-router-dom";
class FeedbackCard extends Component {
  state = {
    edit: false,
    feedbackTextEdit: ""
  };
  del = () => {
    const { _id } = this.props.feedback;
    this.props.del(_id);
  };
  edit = () => {
    const { feedbackText } = this.props.feedback;
    this.setState({ edit: true, feedbackTextEdit: feedbackText });
  };
  cancel = () => {
    const { feedbackText } = this.props.feedback;
    this.setState({ edit: false, feedbackTextEdit: feedbackText });
  };
  save = () => {
    const { feedbackTextEdit } = this.state;
    const { _id } = this.props.feedback;
    this.setState({ edit: false });
    this.props.edit(_id, feedbackTextEdit);
  };
  changeText = e => {
    this.setState({ feedbackTextEdit: e.target.value });
  };
  redirect = () => {
    const { member } = this.props.feedback;
    this.props.history.push({
      pathname: `/Member/${member._id}`
    });
  };
  render() {
    const { datePosted, feedbackText, member } = this.props.feedback;
    const { email, name } = member;
    const { edit, feedbackTextEdit } = this.state;
    const { memberId } = this.props;
    const imageSrc = member.image
      ? member.image
      : "https://react.semantic-ui.com/images/avatar/large/matthew.png";
    return (
      <div id="comment">
        <Comment size="large">
          <Comment.Avatar id="avatar" src={imageSrc} />
          <Comment.Content>
            <Comment.Author as="a" onClick={this.redirect}>
              {name}
            </Comment.Author>
            <Comment.Metadata>
              <div>{datePosted.toString().slice(0, 10)}</div>
            </Comment.Metadata>
            <Comment.Text>
              {edit ? (
                <TextArea value={feedbackTextEdit} onChange={this.changeText} />
              ) : (
                feedbackText
              )}
            </Comment.Text>
            {memberId === member._id ? (
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
export default withRouter(FeedbackCard);
