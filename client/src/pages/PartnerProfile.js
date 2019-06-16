import React, { Component } from "react";
import { get, del, put } from "../services/axios";
import {
  Loader,
  Dimmer,
  Header,
  Message,
  Icon,
  Grid,
  Confirm,
  Segment,
  Divider
} from "semantic-ui-react";
import "../styling/PartnerProfile.css";
//import storageChanged from "storage-changed";
import { withRouter } from "react-router-dom";
import * as UserActions from "../actions/UserActions";
import UpdatePassModal from "../components/profiles/UpdatePassModal";

import PartnerBasicInfo from "../components/partnerProfile/PartnerBasicInfo";
import ActionSegment from "../components/partnerProfile/ActionSegment";
import VacancySegment from "../components/partnerProfile/VacancySegment";
import FeedbackSegment from "../components/partnerProfile/FeedBackSegment";
import SubmitFeedbackModal from "../components/feedbacks/SubmitFeedbackModal";
import decode from "jwt-decode";
import { connect } from "react-redux";

class PartnerProfile extends Component {
  state = {
    loggedIn: false,
    loading: false,
    passModal: false,
    partner: undefined,
    error: false,
    open: false,
    deleteConfirm: false,
    feedback: {}
  };

  componentDidMount() {
    const { state } = this.props.location;
    const { id } = this.props.match.params;
    if (state) {
      const { partner } = state;
      this.setState({ partner });
      this.props.history.replace({
        pathname: "/Partner/" + id,
        state: undefined
      });
    } else {
      this.getPartner(id);
    }
  }

  getPartner = id => {
    this.setState({ loading: true });
    const url = "users/" + id;
    get(url)
      .then(partner => {
        this.setState({ partner, loading: false, error: false });
      })
      .catch(err => {
        this.setState({ loading: false, error: true });
      });
  };
  editProfile = () => {
    this.props.history.push({
      pathname: "/EditProfile",
      user: this.state.partner
    });
  };
  openConfirm = () => {
    this.setState({ deleteConfirm: true });
  };
  closeConfirm = () => {
    this.setState({ deleteConfirm: false });
  };
  logOut = () => {
    localStorage.removeItem("jwtToken");
    // let { firebaseToken } = this.state;
    let firebaseToken = null;
    if (this.props.firebaseToken) firebaseToken = this.props.firebaseToken;
    const { userInfo } = this.props;
    // this.setState({ notifications: [], notificationCount: 0 });
    if (firebaseToken !== null && firebaseToken) {
      const url = `subscribers/delete/${userInfo.id}/${firebaseToken}`;
      del(url, {});
    }
    // //delete newState.userInfo;
    // //this.setState(newState);
    // this.setState({ firebaseToken: "" });
    this.props.dispatch(UserActions.AC_logOut());
  };
  deleteProfile = () => {
    const { partner } = this.state;
    const url = `users/delete/${partner._id}`;
    del(url, {}).then(res => {
      console.log(res);
      this.logOut();
      this.redirectDeleted();
    });
  };
  redirectDeleted = () => {
    this.props.history.push("/");
  };
  createVacancy = () => {
    const { id } = this.props.match.params;
    const { partner } = this.state;
    this.props.history.push({
      pathname: "/CreateVacancy/" + id,
      state: { partner }
    });
  };
  open = () => {
    this.setState({ open: true });
  };
  closeUpdate = () => {
    this.setState({ passModal: false });
  };
  close = () => {
    this.setState({ open: false });
  };
  openPassModal = () => {
    this.setState({ passModal: true });
  };
  closePassModal = () => {
    this.setState({ passModal: false });
  };
  addFeedBack = feedback => {
    this.setState({ feedback });
  };

  render() {
    const {
      partner,
      error,
      loading,
      passModal,
      vacancyCount,
      deleteConfirm,
      open,
      feedback
    } = this.state;
    const { id } = this.props.match.params;
    const { userInfo } = this.props;
    let myProfile = false;
    let memberId = "";
    let memberType = false;
    let adminType = false;
    if (!userInfo) {
      myProfile = false;
      memberId = "";
      memberType = false;
    } else {
      if (userInfo.id === id) {
        myProfile = true;
        memberType = false;
      } else {
        if (userInfo.type === "member") {
          myProfile = false;
          memberId = userInfo.id;
          memberType = true;
        } else {
          if (userInfo.type === "admin") adminType = true;
        }
      }
    }
    if (loading) {
      return (
        <Dimmer active={loading}>
          <Loader size="massive" />
        </Dimmer>
      );
    }
    return (
      <div>
        <Message className="error-message" compact error hidden={!error} icon>
          <Icon size="mini" name="times circle" />
          Something went wrong !
        </Message>
        {partner ? (
          <SubmitFeedbackModal
            addFeedBack={this.addFeedBack}
            close={this.close}
            partner={partner}
            open={open}
            memberId={memberId}
          />
        ) : null}
        <Grid centered className="partner-container" columns={3}>
          <Grid.Column only="computer" width={3}>
            <ActionSegment
              myProfile={myProfile}
              memberType={memberType}
              submitFeedback={this.open}
              editProfile={this.editProfile}
              createVacancy={this.createVacancy}
              deleteProfile={this.openConfirm}
              changePassword={this.openPassModal}
            />
          </Grid.Column>
          <Grid.Column only="computer" width={10}>
            <PartnerBasicInfo partner={partner} />
            <VacancySegment
              admin={adminType}
              partner={partner}
              myProfile={myProfile}
              id={id}
            />
            <FeedbackSegment
              memberId={memberId}
              feedback={feedback}
              id={id}
              partner={partner}
              myProfile={myProfile}
            />
          </Grid.Column>
          <Grid.Column only="mobile" width={14}>
            <PartnerBasicInfo
              submitFeedback={this.open}
              editProfile={this.editProfile}
              createVacancy={this.createVacancy}
              isMobile={true}
              myProfile={myProfile}
              memberType={memberType}
              partner={partner}
              changePassword={this.openPassModal}
            />
            <VacancySegment partner={partner} myProfile={myProfile} id={id} />
            <FeedbackSegment
              memberId={memberId}
              feedback={feedback}
              id={id}
              partner={partner}
              myProfile={myProfile}
              admin={adminType}
            />
          </Grid.Column>
          <Grid.Column only="tablet" width={14}>
            <PartnerBasicInfo isTablet={true} partner={partner} />
            <ActionSegment
              myProfile={myProfile}
              memberType={memberType}
              submitFeedback={this.open}
              editProfile={this.editProfile}
              createVacancy={this.createVacancy}
              deleteProfile={this.openConfirm}
              changePassword={this.openPassModal}
            />
            <VacancySegment
              admin={adminType}
              partner={partner}
              myProfile={myProfile}
              id={id}
            />
            <FeedbackSegment
              memberId={memberId}
              feedback={feedback}
              id={id}
              partner={partner}
              myProfile={myProfile}
            />
          </Grid.Column>

          <Grid.Column only="computer" width={3} />
        </Grid>
        <Confirm
          open={deleteConfirm}
          onCancel={this.closeConfirm}
          content="Are you sure you want to delete your profile?"
          onConfirm={this.deleteProfile}
        />
        {partner ? (
          <UpdatePassModal
            id={partner._id}
            open={passModal}
            closeUpdateModal={this.closeUpdate}
          />
        ) : null}
      </div>
    );
  }
}
const mapStateToProps = state => {
  const { userInfo, firebaseToken } = state;
  return { userInfo, firebaseToken };
};

export default withRouter(connect(mapStateToProps)(PartnerProfile));
