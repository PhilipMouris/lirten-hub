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
import { withRouter } from "react-router-dom";
import * as UserActions from "../actions/UserActions";
import UpdatePassModal from "../components/profiles/UpdatePassModal";
import MemberBasicInfo from "../components/memberProfile/MemberBasicInfo";
import MemberActions from "../components/memberProfile/MemberActions";
import ReviewSegment from "../components/memberProfile/ReviewSegment";
import SubmitModal from "../components/reviews/SubmitModal";
import MemberJobApps from "../components/memberProfile/MemberJobApps";
import RecommendedVacancies from "../components/memberProfile/RecommendedVacancies";
import { connect } from "react-redux";

class MemberProfile extends Component {
  state = {
    loggedIn: false,
    loading: false,
    member: undefined,
    error: false,
    open: false,
    passModal: false,
    reviews: {},
    deleteConfirm: false,
    openJobApps: false
  };
  componentDidMount() {
    const { state } = this.props.location;
    const { id } = this.props.match.params;
    if (state) {
      const { member } = state;
      this.setState({ member });
      this.props.history.replace({
        pathname: "/Member/" + id,
        state: undefined
      });
    } else {
      this.getMember(id);
    }
  }
  getMember = id => {
    this.setState({ loading: true });
    const url = "users/" + id;
    get(url)
      .then(member => {
        const { reviews } = member.userData;
        if (!reviews) {
          member.rating = 0;
          member.ratingCount = 0;
        } else {
          const ratingSum = reviews.reduce((acc, review) => {
            if (!review.rating) return acc;
            return parseInt(review.rating) + acc;
          }, 0);
          const avg = ratingSum === 0 ? 0 : ratingSum / reviews.length;
          member.rating = avg;
          member.ratingCount = reviews.length;
        }
        this.setState({ member, loading: false, error: false });
      })
      .catch(err => {
        this.setState({ loading: false, error: true });
      });
  };
  editProfile = () => {
    this.props.history.push({
      pathname: "/EditProfile",
      user: this.state.member
    });
  };
  openPassModal = () => {
    this.setState({ passModal: true });
  };
  closePassModal = () => {
    this.setState({ passModal: false });
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
    const { member } = this.state;
    const url = `users/delete/${member._id}`;
    del(url, {}).then(res => {
      console.log(res);
      this.logOut();
      this.redirectDeleted();
    });
  };
  redirectDeleted = () => {
    this.props.history.push("/");
  };
  closeUpdate = () => {
    this.setState({ passModal: false });
  };
  open = () => {
    this.setState({ open: true });
  };
  close = () => {
    this.setState({ open: false });
  };
  add = review => {
    const { member } = this.state;
    const { reviews } = member.userData;
    if (reviews) {
      reviews.push(review);
    } else {
      member.userData.reviews = [review];
    }
    this.setState({ member });
  };
  del = id => {
    const { member } = this.state;
    const url = `reviews/delete/${member._id}/${id}`;
    del(url, {}).then(() => {
      const deleted = member.userData.reviews.findIndex(rev => rev._id === id);
      member.userData.reviews.splice(deleted, 1);
      this.setState({ member });
    });
  };
  edit = (id, reviewText, rating) => {
    const { member } = this.state;
    const url = `reviews/update/${member._id}/${id}`;
    const req = { reviewText, rating: "" + rating };
    put(url, req)
      .then(() => {
        const review = member.userData.reviews.find(
          review => review._id === id
        );
        review.reviewText = reviewText;
        review.rating = rating;
        this.setState({ member });
      })
      .catch(error => console.log(error.response));
  };
  changePassword = () => {};
  openJobApps = () => {
    this.setState({ openJobApps: true });
  };

  closeJobApps = () => {
    this.setState({ openJobApps: false });
  };
  render() {
    const {
      member,
      error,
      loading,
      open,
      passModal,
      openJobApps,
      deleteConfirm
    } = this.state;
    console.log(member, "MEMBER");
    const { id } = this.props.match.params;
    const { userInfo } = this.props;
    let myProfile = false;
    let partnerId = "";
    let partnerType = false;
    if (userInfo) {
      if (userInfo.id === id) myProfile = true;
      else {
        if (userInfo.type === "partner") {
          partnerId = userInfo.id;
          partnerType = true;
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
        {member ? (
          <div>
            <SubmitModal
              add={this.add}
              close={this.close}
              member={member}
              open={open}
              partnerId={partnerId}
            />
            <MemberJobApps
              open={openJobApps}
              close={this.closeJobApps}
              member={member}
            />
          </div>
        ) : null}
        <Message className="error-message" compact error hidden={!error} icon>
          <Icon size="mini" name="times circle" />
          Something went wrong !
        </Message>

        <Grid centered className="partner-container" columns={3}>
          <Grid.Column only="computer" width={3}>
            <MemberActions
              openJobApps={this.openJobApps}
              editProfile={this.editProfile}
              submitReview={this.open}
              myProfile={myProfile}
              partnerType={partnerType}
              deleteProfile={this.openConfirm}
              changePassword={this.openPassModal}
            />
          </Grid.Column>
          <Grid.Column only="computer" width={10}>
            <MemberBasicInfo member={member} />
            <ReviewSegment
              partnerId={partnerId}
              reviews={
                member
                  ? member.userData.reviews
                    ? member.userData.reviews
                    : []
                  : []
              }
              myProfile={myProfile}
              del={this.del}
              edit={this.edit}
            />
            {myProfile ? (
              <RecommendedVacancies
                myProfile={myProfile}
                member={member}
                id={id}
              />
            ) : null}
          </Grid.Column>
          <Grid.Column only="mobile" width={14}>
            <MemberBasicInfo
              partnerType={partnerType}
              myProfile={myProfile}
              isMobile={true}
              member={member}
              editProfile={this.editProfile}
              submitReview={this.open}
              openJobApps={this.openJobApps}
              changePassword={this.openPassModal}
            />
            <ReviewSegment
              partnerId={partnerId}
              reviews={
                member
                  ? member.userData.reviews
                    ? member.userData.reviews
                    : []
                  : []
              }
              myProfile={myProfile}
              del={this.del}
              edit={this.edit}
            />
            {myProfile ? (
              <RecommendedVacancies
                myProfile={myProfile}
                member={member}
                id={id}
              />
            ) : null}
          </Grid.Column>
          <Grid.Column only="tablet" width={14}>
            <MemberBasicInfo isTablet={true} member={member} />
            <MemberActions
              editProfile={this.editProfile}
              submitReview={this.open}
              myProfile={myProfile}
              partnerType={partnerType}
              openJobApps={this.openJobApps}
              deleteProfile={this.openConfirm}
              changePassword={this.openPassModal}
            />
            <ReviewSegment
              partnerId={partnerId}
              reviews={
                member
                  ? member.userData.reviews
                    ? member.userData.reviews
                    : []
                  : []
              }
              myProfile={myProfile}
              del={this.del}
              edit={this.edit}
            />
            {myProfile ? (
              <RecommendedVacancies
                myProfile={myProfile}
                member={member}
                id={id}
              />
            ) : null}
          </Grid.Column>
          <Grid.Column only="computer" width={3} />
        </Grid>
        <Confirm
          open={deleteConfirm}
          onCancel={this.closeConfirm}
          content="Are you sure you want to delete your profile?"
          onConfirm={this.deleteProfile}
        />
        {member ? (
          <UpdatePassModal
            id={member._id}
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

export default withRouter(connect(mapStateToProps)(MemberProfile));
