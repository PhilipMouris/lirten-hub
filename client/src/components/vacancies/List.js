import React, { Component } from "react";
import { get, put, del, post } from "../../services/axios";
import {
  Header,
  Card,
  Image,
  Label,
  Icon,
  Divider,
  Popup,
  Confirm,
  Modal,
  Button
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import Highlighter from "react-highlight-words";
import "../../styling/Vacancies.css";
import Highlightable from "../highlightable/Higlightable.js";
import decode from "jwt-decode";
import { withRouter } from "react-router-dom";

class List extends Component {
  state = { approveLoading: false, openConfirm: false, deletedId: "" };
  closeConfirm = () => {
    this.setState({ openConfirm: false });
  };
  openConfirm = (e, value) => {
    this.setState({ openConfirm: true, deletedId: value });
  };
  approve = (e, value, pid) => {
    this.setState({ approveLoading: true });
    // const { _id } = this.props.data;
    this.props.approve(value, pid);
  };
  deleteM = () => {
    // const { _id } = this.props.data;
    this.closeConfirm();
    this.props.del(this.state.deletedId);
  };
  componentWillReceiveProps(newProps) {
    this.setState({ approveLoading: newProps.approveLoading });
  }
  componentDidMount() {
    this.setState({ approveLoading: this.props.approveLoading });
  }
  updateRecommendation = () => {
    let { memberId, memberType, vacancy } = this.props;
    if (memberType) {
      if (memberId) {
        let url =
          "vacancies/updateRecommendation/" + memberId + "/" + vacancy._id;
        let body = {};
        console.log("In updateRcomm");
        post(url, body).then(resp => {
          console.log(resp);
        });
      }
    }
  };
  handleClick = (e, id) => {
    if (e.target.name === "deleteButton" || e.target.name == "approveButton") {
      e.preventDefault();
      e.stopPropagation();
    } else {
      if (this.props.memberType) this.updateRecommendation();
      this.redirect();
    }
  };

  redirect = () => {
    const { fromPartner, vacancy } = this.props;
    if (fromPartner) return;
    this.props.history.push({
      pathname: "/Vacancy/" + vacancy._id,
      state: { vacancy }
    });
  };
  redirectComp = () => {
    const { fromPartner, vacancy } = this.props;
    if (!fromPartner) return;
    this.props.history.push({
      pathname: "/Vacancy/" + vacancy._id,
      state: { vacancy }
    });
  };
  delete = () => {
    const { _id } = this.props.vacancy;
    this.props.del(_id);
  };
  edit = () => {
    const { edit, vacancy } = this.props;
    edit(vacancy);
  };
  viewJobApplications = () => {
    this.props.viewJobApplications(this.props.vacancy._id, this.props.vacancy);
  };

  render() {
    const { approveLoading, openConfirm } = this.state;
    const {
      error,
      vacancy,
      searchKey,
      fromPartner,
      deletedId,
      adminType,
      pendingCount
    } = this.props;
    const searchWords = searchKey.split(" ");
    return error ? (
      <Header as="h2" textAlign="center">
        Something went wrong!
      </Header>
    ) : (
      <div>
        <Card
          onClick={e => this.handleClick(e, vacancy._id)}
          className="vacancy-card hvr-grow"
        >
          <Card.Content>
            {vacancy.title ? (
              <Card.Header>
                <Highlightable
                  textToHighlight={vacancy.title}
                  searchWords={searchWords}
                />
              </Card.Header>
            ) : (
              <Card.Header>
                <Highlightable
                  searchWords={searchWords}
                  textToHighlight={`${vacancy.partner.name} Vacancy`}
                />
              </Card.Header>
            )}

            <span className="highlight-meta">
              <Highlightable
                searchWords={searchWords}
                textToHighlight={`${vacancy.partner.name}${
                  vacancy.location ? " - " + vacancy.location : ""
                }`}
              />
            </span>
            <Card.Description>
              <Highlightable
                searchWords={searchWords}
                textToHighlight={vacancy.description}
              />
            </Card.Description>
            {vacancy.skills
              ? vacancy.skills.map(skill => (
                  <Label color="yellow" key={skill} className="vacancy-label">
                    <Highlightable
                      searchWords={searchWords}
                      textToHighlight={skill}
                    />
                  </Label>
                ))
              : []}
            {fromPartner ? (
              <div>
                <Divider />
                <Icon
                  onClick={this.edit}
                  size="big"
                  name="pencil alternate"
                  color="yellow"
                />
                <Icon
                  onClick={this.viewJobApplications}
                  size="big"
                  name="wpforms"
                  color="blue"
                />
                <Icon
                  loading={vacancy._id == deletedId}
                  onClick={this.delete}
                  size="big"
                  name="times circle"
                  color="red"
                />
                <Icon
                  onClick={this.redirectComp}
                  size="big"
                  name="expand"
                  color="green"
                />
              </div>
            ) : null}
            {vacancy.state === "taken" ? (
              <Popup
                on="hover"
                position="top right"
                content={"Taken"}
                trigger={
                  <Label corner size="mini" icon="check" color="green" />
                }
              />
            ) : null}
          </Card.Content>
          {adminType && (
            <Card.Content extra>
              {vacancy.state === "unapproved" ||
              vacancy.state === "Not taken" ? (
                <div>
                  <Popup
                    on="hover"
                    position="top right"
                    content="Pending approval"
                    trigger={
                      <Label corner icon="clock outline" color="yellow" />
                    }
                  />
                  <Card.Header>
                    {!fromPartner && adminType ? (
                      <Button
                        name="approveButton"
                        style={{ marginBottom: "0.6em" }}
                        size="small"
                        loading={approveLoading}
                        onClick={e =>
                          this.approve(e, vacancy._id, vacancy.partner._id)
                        }
                        basic
                        color="green"
                      >
                        Approve
                      </Button>
                    ) : null}
                  </Card.Header>
                </div>
              ) : null}
              {adminType ? (
                <Card.Header>
                  <Button
                    name="deleteButton"
                    onClick={e => this.openConfirm(e, vacancy._id)}
                    color="red"
                  >
                    Delete
                  </Button>
                </Card.Header>
              ) : null}
            </Card.Content>
          )}

          {vacancy.partner.image ? (
            <Image
              onClick={this.redirectComp}
              size="tiny"
              src={vacancy.partner.image}
            />
          ) : (
            <Image
              onClick={this.redirectComp}
              size="tiny"
              src="https://via.placeholder.com/150"
            />
          )}
        </Card>
        <Confirm
          open={openConfirm}
          onCancel={this.closeConfirm}
          onConfirm={this.deleteM}
        />
      </div>
    );
  }
}

export default withRouter(List);
