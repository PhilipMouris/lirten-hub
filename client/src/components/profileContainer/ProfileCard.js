import React, { Component } from "react";
import {
  Card,
  Image,
  Header,
  Rating,
  Divider,
  Label,
  Popup,
  Button
} from "semantic-ui-react";
import "../../styling/ProfileContainer.css";
import Highlightable from "../highlightable/Higlightable.js";

export default class ProfileCard extends Component {
  state = { approveLoading: false };
  approve = () => {
    this.setState({ approveLoading: true });
    const { _id } = this.props.data;
    this.props.approve(_id);
  };
  delete = () => {
    const { _id } = this.props.data;
    this.props.del(_id);
  };
  redirect = () => {
    const { redirect, data, adminType } = this.props;
    if (adminType) return;
    const { _id } = this.props.data;
    if (redirect) redirect(_id, data);
  };
  adminRedirect = () => {
    const { redirect, data, adminType } = this.props;
    const { _id } = this.props.data;
    if (redirect) redirect(_id, data);
  };

  render() {
    const { approveLoading } = this.state;
    const {
      name,
      email,
      userData,
      rating,
      ratingCount,
      type,
      image
    } = this.props.data;
    let { searchWords, adminType } = this.props;
    searchWords = searchWords.split(" ");
    const {
      age,
      skills,
      location,
      joinDate,
      availability,
      address,
      phone,
      fieldOfWork,
      hourlyRate,
      gender,
      approved
    } = userData;
    const imageSrc =
      image && image !== null && image.includes(".") && image.includes("/")
        ? image
        : "https://react.semantic-ui.com/images/wireframe/image.png";
    const memberAttributes = [
      <Card.Header key={age} className="card-header" textAlign="center">
        <Highlightable
          green={true}
          textToHighlight={age + " Years"}
          searchWords={searchWords}
        />
      </Card.Header>,
      <Card.Header key={email} className="card-header" textAlign="center">
        <Highlightable
          green={true}
          textToHighlight={location}
          searchWords={searchWords}
        />
      </Card.Header>,
      <Card.Header key={email + 1} className="card-header" textAlign="center">
        <Highlightable
          textToHighlight={availability}
          searchWords={searchWords}
        />
      </Card.Header>,

      skills
        ? skills.map((skill, index) => (
            <Label
              className="skill-label"
              color="yellow"
              key={email + index + 2}
            >
              <Highlightable
                green={true}
                textToHighlight={skill}
                searchWords={searchWords}
              />
            </Label>
          ))
        : null
    ];

    const partnerAttributes = [
      <Card.Header key={email} className="card-header" textAlign="center">
        <Highlightable
          green={true}
          textToHighlight={fieldOfWork}
          searchWords={searchWords}
        />
      </Card.Header>,
      <Card.Header key={email + 1} className="card-header" textAlign="center">
        <Highlightable
          green={true}
          textToHighlight={phone ? "" + phone : phone}
          searchWords={searchWords}
        />
      </Card.Header>,
      <Card.Header key={email + 2} className="card-header" textAlign="center">
        <Highlightable textToHighlight={address} searchWords={searchWords} />
      </Card.Header>
    ];
    const lifeCoachAttributes = [
      <Card.Header key={age} className="card-header" textAlign="center">
        <Highlightable
          green={true}
          textToHighlight={age + " Years"}
          searchWords={searchWords}
        />
      </Card.Header>,
      <Card.Header key={email} className="card-header" textAlign="center">
        <Highlightable
          green={true}
          textToHighlight={hourlyRate ? hourlyRate + "/Hour" : undefined}
          searchWords={searchWords}
        />
      </Card.Header>
    ];
    return (
      <Card onClick={this.redirect} className="hvr-grow centered">
        <Image onClick={this.adminRedirect}>
          <div
            className="images"
            style={{ backgroundImage: "url(" + imageSrc + ")" }}
          />
        </Image>

        <Card.Content>
          <Card.Header className="first-header" textAlign="center">
            <Highlightable
              green={true}
              textToHighlight={name}
              searchWords={searchWords}
            />
          </Card.Header>
          {rating >= 0 ? (
            <Card.Header className="card-header" textAlign="center">
              <Rating icon="star" disabled maxRating={5} rating={rating} />
            </Card.Header>
          ) : null}
          <Card.Header
            className="card-header blue"
            size="tiny"
            textAlign="center"
          >
            <Highlightable
              green={true}
              textToHighlight={email}
              searchWords={searchWords}
            />
          </Card.Header>
          {type === "member"
            ? memberAttributes
            : type === "partner"
            ? partnerAttributes
            : lifeCoachAttributes}

          {!approved && type === "partner" ? (
            <div>
              <Popup
                on="hover"
                position="top right"
                content="Pending approval"
                trigger={<Label corner icon="clock outline" color="yellow" />}
              />
              <Card.Header textAlign="center">
                <Button
                  style={{ marginBottom: "0.4em" }}
                  loading={approveLoading}
                  onClick={this.approve}
                  basic
                  color="green"
                >
                  Approve
                </Button>
              </Card.Header>
            </div>
          ) : null}
          {adminType ? (
            <Card.Header textAlign="center">
              <Button
                style={{ marginTop: "4px" }}
                onClick={this.delete}
                color="red"
              >
                Delete
              </Button>
            </Card.Header>
          ) : null}
        </Card.Content>
        <Card.Content extra>
          <div>
            {ratingCount >= 0 ? (
              <div>
                <span> {ratingCount} Ratings </span>
                <Divider fitted hidden />
              </div>
            ) : null}
            {joinDate ? (
              <span>Joined at {joinDate.toString().slice(0, 10)}</span>
            ) : null}
          </div>
        </Card.Content>
      </Card>
    );
  }
}
