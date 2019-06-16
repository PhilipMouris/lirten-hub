import React, { Component } from "react";
import "../../styling/ProfileContainer.css";
import {
  Grid,
  Segment,
  Message,
  Icon,
  Transition,
  Header,
  Image,
  Responsive
} from "semantic-ui-react";
import SideSegment from "./SideSegment.js";
import ProfileCard from "./ProfileCard.js";
import search from "../../services/search.js";
import StepGrid from "./StepGrid.js";

export default class Container extends Component {
  state = {
    currentLocation: [],
    currentAvailable: [],
    currentSkill: [],
    currentFieldOfWork: [],
    currentRate: [],
    currentRating: "",
    currentGender: [],
    currentApproval: [],
    searchBar: "",
    memberExclued: [
      "_id",
      "ratingCount",
      "password",
      "type",
      "gender",
      "interest",
      "joinDate",
      "reviews",
      "image",
      "__v",
      "dateOfBirth"
    ],
    partnerExcluded: [
      "_id",
      "type",
      "__v",
      "approved",
      "feedback",
      "password",
      "image",
      "members",
      "partners"
    ],
    lifeCoachExcluded: [
      "_id",
      "type",
      "__v",
      "password",
      "image",
      "monthlySlots",
      "dateOfBirth"
    ]
  };
  handleLocationFilter = currentLocation => {
    this.setState({ currentLocation });
  };

  handleSkillFilter = currentSkill => {
    this.setState({ currentSkill });
  };

  handleAvailableFilter = currentAvailable => {
    this.setState({ currentAvailable });
  };
  handleFieldOfWorkFilter = currentFieldOfWork => {
    this.setState({ currentFieldOfWork });
  };
  handleRateFilter = currentRate => {
    this.setState({ currentRate });
  };
  handleRatingFilter = currentRating => {
    console.log(currentRating, "HIII");
    this.setState({ currentRating });
  };
  handleGenderFilter = currentGender => {
    this.setState({ currentGender });
  };
  handleApprovalFilter = currentApproval => {
    this.setState({ currentApproval });
  };

  setSearchBar = searchBar => {
    this.setState({ searchBar });
  };

  filterAvailable = data => {
    const { currentAvailable } = this.state;
    if (currentAvailable.length === 0) return data;
    data = data.filter(member => {
      const { availability } = member.userData;
      if (!availability) return false;
      let found = false;
      currentAvailable.forEach(available => {
        if (
          availability
            .toUpperCase()
            .includes(available.slice(0, 5).toUpperCase())
        )
          found = true;
      });
      return found;
    });
    return data;
  };
  filterSkills = data => {
    const { currentSkill } = this.state;
    if (currentSkill.length === 0) return data;
    data = data.filter(member => {
      const { skills } = member.userData;
      if (!skills || skills.length === 0) return false;
      let found = false;
      skills.forEach(skill => {
        currentSkill.forEach(current => {
          if (skill.toUpperCase().includes(current.toUpperCase())) found = true;
        });
      });
      return found;
    });
    return data;
  };
  filterLocation = data => {
    const { currentLocation } = this.state;
    if (currentLocation.length === 0) return data;
    data = data.filter(member => {
      const { location } = member.userData;
      if (!location) return false;
      let found = false;
      currentLocation.forEach(loc => {
        if (location.toUpperCase().includes(loc.toUpperCase())) found = true;
      });
      return found;
    });
    return data;
  };
  filterField = data => {
    const { currentFieldOfWork } = this.state;
    if (currentFieldOfWork.length === 0) return data;
    data = data.filter(partner => {
      const { fieldOfWork } = partner.userData;
      if (!fieldOfWork) return false;
      let found = false;
      currentFieldOfWork.forEach(field => {
        if (fieldOfWork === field) found = true;
      });
      return found;
    });
    return data;
  };
  filterGender = data => {
    const { currentGender } = this.state;
    if (currentGender.length === 0) return data;
    data = data.filter(lifeCoach => {
      const { gender } = lifeCoach.userData;
      if (!gender) return false;
      let found = false;
      currentGender.forEach(gen => {
        if (gen.toUpperCase() === gender.toUpperCase()) found = true;
      });
      return found;
    });
    return data;
  };
  filterRates = data => {
    const { currentRate } = this.state;
    if (currentRate.length === 0) return data;
    data = data.filter(lifeCoach => {
      const { hourlyRate } = lifeCoach.userData;
      if (!hourlyRate) return false;
      let found = false;
      currentRate.forEach(rate => {
        if (rate === hourlyRate) found = true;
      });
      return found;
    });
    return data;
  };
  filterRating = data => {
    const { currentRating } = this.state;
    if (currentRating.length === 0 || currentRating === 0) return data;
    data = data.filter(lifeCoach => lifeCoach.rating >= currentRating);
    return data;
  };
  filterApproved = data => {
    const { currentApproval } = this.state;
    if (currentApproval.length === 0 || !this.props.adminType) return data;
    data = data.filter(partner => {
      let found = false;
      currentApproval.forEach(key => {
        if (key === "Yes" && partner.userData.approved) found = true;
        if (key === "No" && !partner.userData.approved) found = true;
      });
      return found;
    });
    return data;
  };

  render() {
    const {
      filterTitles,
      filterValues,
      pageTitle,
      pageSubHeader,
      loading,
      adminType,
      pendingCount,
      approve,
      approveLoading,
      del,
      redirect
    } = this.props;
    const {
      searchBar,
      memberExclued,
      partnerExcluded,
      lifeCoachExcluded
    } = this.state;
    let { data } = this.props;
    if (pageTitle === "Members") {
      data = this.filterLocation(
        this.filterSkills(
          this.filterAvailable(search(data, searchBar, memberExclued))
        )
      );
    }
    if (pageTitle === "Partners") {
      data = this.filterApproved(
        this.filterField(search(data, searchBar, partnerExcluded))
      );
    }
    if (pageTitle === "Life Coaches") {
      data = this.filterRating(
        this.filterGender(
          this.filterRates(search(data, searchBar, lifeCoachExcluded))
        )
      );
    }

    return (
      <Grid stackable columns={3}>
        <Grid.Column width={3}>
          <SideSegment
            adminType={adminType}
            pendingCount={pendingCount}
            setSearch={this.setSearchBar}
            Skills={this.handleSkillFilter}
            Location={this.handleLocationFilter}
            Available={this.handleAvailableFilter}
            Field={this.handleFieldOfWorkFilter}
            HourlyRate={this.handleRateFilter}
            Gender={this.handleGenderFilter}
            Approved={this.handleApprovalFilter}
            Rating={
              pageTitle === "Life Coaches" ? this.handleRatingFilter : false
            }
            filterTitles={filterTitles}
            pageTitle={pageTitle}
            pageSubHeader={pageSubHeader}
            filterValues={filterValues}
          />
        </Grid.Column>
        <Grid.Column mobile={3} computer={10} largeScreen={10} tablet={13}>
          {pageTitle === "Life Coaches" ? <StepGrid /> : null}

          <Grid
            stackable
            columns={window.innerWidth <= 1024 ? 2 : 3}
            as={Segment}
          >
            <Message compact error hidden={data.length > 0 || loading} icon>
              <Icon size="mini" name="search" />
              No results found{" "}
              {searchBar.length === 0 ? "" : "for " + searchBar + " "}
              using the current filters
            </Message>
            <Transition.Group duration={400}>
              {data.map(profile => (
                <Grid.Column key={profile._id}>
                  <ProfileCard
                    redirect={redirect}
                    del={del}
                    adminType={adminType}
                    approve={approve}
                    searchWords={searchBar}
                    data={profile}
                  />
                </Grid.Column>
              ))}
            </Transition.Group>
          </Grid>
        </Grid.Column>
        <Grid.Column only="computer" width={3} />
      </Grid>
    );
  }
}
