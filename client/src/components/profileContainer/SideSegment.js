import React, { Component } from "react";
import "../../styling/ProfileContainer.css";
import { Segment, Header, Divider, Input } from "semantic-ui-react";
import SideFilter from "./SideFilter.js";
export default class SideSegment extends Component {
  state = {
    searchBar: "",
    rating: 0
  };
  changeSearchBar = e => {
    this.setState({ serachBar: e.target.value });
    this.props.setSearch(e.target.value);
  };
  changeRating = e => {
    this.setState({ rating: e.target.value });
    this.props.Rating(e.target.value);
  };
  render() {
    const {
      pageTitle,
      pageSubHeader,
      filterTitles,
      filterValues,
      Skills,
      Location,
      Available,
      Field,
      HourlyRate,
      Gender,
      Rating,
      adminType,
      pendingCount,
      Approved
    } = this.props;
    const { rating } = this.state;
    return (
      <Segment compact className="filterSegment">
        <Header size="large">
          {pageTitle}
          <Divider hidden fitted />
          {adminType ? " (" + pendingCount + ")" + " Pending" : ""}
          <Header.Subheader>{pageSubHeader}</Header.Subheader>
        </Header>
        <Divider />
        <Input
          onChange={this.changeSearchBar}
          fluid
          placeholder="Search using any field"
          icon="search"
        />
        <Header size="medium">Filters</Header>
        <Divider />
        {filterTitles.map((title, index) => {
          if (title === "Approved" && !adminType) return null;
          return (
            <SideFilter
              Approved={Approved}
              Rate={HourlyRate}
              Gender={Gender}
              Field={Field}
              Skills={Skills}
              Location={Location}
              Available={Available}
              key={title}
              title={title}
              filterValues={filterValues[index]}
            />
          );
        })}
        {Rating ? (
          <div>
            <Header color="grey" size="small">
              Ratings
            </Header>
            <input
              value={rating}
              onChange={this.changeRating}
              type="range"
              min="0"
              max="5"
              step="1"
            />
          </div>
        ) : null}
      </Segment>
    );
  }
}
