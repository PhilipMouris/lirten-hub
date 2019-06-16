import React, { Component } from "react";
import { get } from "../services/axios";
import Container from "../components/profileContainer/Container.js";
import { Dimmer, Loader } from "semantic-ui-react";
export default class Members extends Component {
  state = {
    loading: true,
    error: false,
    members: [],
    locationFilters: [],
    skillFilters: []
  };
  componentDidMount() {
    get("users/members")
      .then(members => {
        this.setData(members);
        this.setState({ members, loading: false });
      })

      .catch(error => this.setState({ error: true, loading: false }));
  }

  setData = members => {
    const locationFilters = [];
    const skillFilters = [];
    members.forEach(member => {
      const { reviews, location, skills } = member.userData;
      //geting location
      if (location) {
        if (!locationFilters.includes(location)) locationFilters.push(location);
      }
      //getting skills
      if (skills) {
        skills.forEach(skill => {
          if (!skillFilters.includes(skill)) skillFilters.push(skill);
        });
      }
      //rating
      if (!reviews) {
        member.rating = 0;
        member.ratingCount = 0;
        return;
      }
      const ratingSum = reviews.reduce((acc, review) => {
        if (!review.rating) return acc;
        return parseInt(review.rating) + acc;
      }, 0);
      const avg = ratingSum === 0 ? 0 : ratingSum / reviews.length;
      member.rating = avg;
      member.ratingCount = reviews.length;
    });

    this.setState({ locationFilters, skillFilters });
  };
  redirectProfile = (id, member) => {
    this.props.history.push({
      pathname: "/Member/" + id,
      state: { member }
    });
  };

  render() {
    const { members, loading, locationFilters, skillFilters } = this.state;
    const { userInfo } = this.props;
    return (
      <div>
        <Dimmer active={loading}>
          <Loader size="massive" />
        </Dimmer>
        <Container
          redirect={this.redirectProfile}
          loading={loading}
          pageTitle="Members"
          pageSubHeader="A large database of professional talents"
          data={members}
          filterTitles={["Available", "Skills", "Location"]}
          filterValues={[
            ["Full-Time", "Part-Time"],
            skillFilters,
            locationFilters
          ]}
        />
      </div>
    );
  }
}
