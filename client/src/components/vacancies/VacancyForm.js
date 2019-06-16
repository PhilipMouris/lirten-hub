import React, { Component } from "react";
import {
  Grid,
  Form,
  Dropdown,
  Button,
  Header,
  Divider
} from "semantic-ui-react";
import "../../styling/VacancyForm.css";
import { withRouter } from "react-router-dom";
import { post, put } from "../../services/axios.js";

class VacancyForm extends Component {
  state = {
    title: "",
    monthlyWage: "",
    currency: "",
    location: "",
    startDate: "",
    endDate: "",
    dailyHours: "",
    availability: "",
    description: "",
    currentValues: [],
    loader: false,
    errorHidden: true,
    errorMessage: "",
    _id: "",
    availabilityOptions: [
      { key: 1, text: "Full-Time", value: "fullTime" },
      { key: 2, text: "Part-Time", value: "partTime" }
    ],
    skillOptions: []
  };

  componentDidMount() {
    const { vacancy } = this.props.location.state;
    if (!vacancy) return;
    const { dailyHours, description, skills, title, location, _id } = vacancy;
    let { availability, startDate, endDate, monthlyWage } = vacancy;

    if (availability) {
      if (availability.includes(`ull`)) availability = `fullTime`;
      else {
        availability = `partTime`;
      }
    }
    const skillOptions = skills.map(skill => {
      return { text: skill, value: skill };
    });
    startDate = this.generateDate(startDate);
    endDate = this.generateDate(endDate);
    const monthlyWageCurrency = monthlyWage ? monthlyWage.split(" ") : "N/A";
    monthlyWage = monthlyWage ? monthlyWageCurrency[0] : "N/A";
    const currency =
      monthlyWageCurrency.length > 1 ? monthlyWageCurrency[1] : "N/A";

    this.setState({
      title,
      dailyHours,
      availability,
      description,
      skillOptions,
      currentValues: skills,
      startDate,
      endDate,
      location,
      monthlyWage,
      currency,
      _id,
      edit: true
    });
  }
  generateDate = dateString => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) month = "0" + month;
    let day = date.getDate();
    if (day < 10) day = "0" + day;
    return `${year}-${month}-${day}`;
  };

  handleAddition = (e, { value }) => {
    this.setState({
      skillOptions: [{ text: value, value }, ...this.state.skillOptions]
    });
  };
  handleSkillChange = (e, { value }) => this.setState({ currentValues: value });
  changeDropDown = (e, { value }) => this.setState({ availability: value });
  handleAllChanges = (prop, e) => {
    const newState = this.state;
    newState[prop] = e.target.value;
    newState.errorHidden = true;
    this.setState(newState);
  };
  createVacancy = () => {
    this.setState({ loader: true });
    const { partnerId } = this.props;
    const {
      availability,
      currency,
      currentValues,
      dailyHours,
      description,
      endDate,
      location,
      startDate,
      title,
      edit,
      _id
    } = this.state;
    let { monthlyWage } = this.state;
    monthlyWage += " " + currency;
    const url = edit ? `vacancies/update/${_id}` : "vacancies/create";
    const data = {
      partnerId,
      skills: currentValues,
      dailyHours,
      description,
      endDate,
      location,
      startDate,
      title,
      monthlyWage,
      state: "unapproved",
      availability
    };

    //deleting any empty props incase they are empty
    Object.keys(data).forEach(key => {
      if (!data[key]) {
        delete data[key];
        return;
      }
      if (data[key].length === 0) delete data[key];
    });
    const method = edit ? put : post;
    method(url, data)
      .then(resp => {
        this.setState({ loader: false });
        if (!edit) {
          const notifUrl = `subscribers/sendAllAdmins`;
          const req = {
            data: {
              title: "Vacancy Pending Approval!",
              body: `A new vacancy has been posted`,
              link: `/Vacancies`,
              actionTitle: "Visit",
              img: resp.data.data.partner.image
            }
          };
          post(notifUrl, req).then(resp => console.log(resp));
        }

        this.redirectProfile();
      })
      .catch(error => {
        this.setState({ loader: false });
        if (error.response.data.error) {
          this.setState({
            errorMessage: error.response.data.error,
            errorHidden: false
          });
        } else {
          this.setState({
            errorMessage: "Something went wrong",
            errorHidden: false
          });
        }
      });
  };
  redirectProfile = () => {
    const { partnerId } = this.props;
    let partner = undefined;
    const { state } = this.props.location;
    if (state) partner = state.partner;
    this.props.history.push({
      pathname: "/Partner/" + partnerId,
      state: { partner }
    });
  };

  render() {
    const {
      availabilityOptions,
      skillOptions,
      currentValues,
      availability,
      title,
      monthlyWage,
      currency,
      location,
      startDate,
      endDate,
      dailyHours,
      description,
      loader,
      errorHidden,
      errorMessage,
      edit
    } = this.state;
    const { isMobile } = this.props;
    const formSize = isMobile ? "tiny" : "large";
    const vacancyDuration = [
      <Form.Input
        key="startDate"
        value={startDate}
        type="Date"
        label="Start Date"
        onChange={e => {
          this.handleAllChanges("startDate", e);
        }}
      />,
      <Form.Input
        key="endDate"
        value={endDate}
        type="Date"
        label="End Date"
        onChange={e => {
          this.handleAllChanges("endDate", e);
        }}
      />
    ];

    return (
      <Grid centered padded>
        <Grid.Row>
          <Form
            inverted
            error
            className="box-shadow"
            size={formSize}
            onSubmit={this.createVacancy}
          >
            {edit ? (
              <Header inverted size="huge" textAlign="left">
                Edit Vacancy
                <Header.Subheader>Set new information</Header.Subheader>
              </Header>
            ) : (
              <Header inverted size="huge" textAlign="left">
                Create Vacancy
                <Header.Subheader>
                  Submit a vacancy for approval
                </Header.Subheader>
              </Header>
            )}
            <Form.Input
              onChange={e => {
                this.handleAllChanges("title", e);
              }}
              value={title}
              type="text"
              label="Title"
              required
            />
            <Form.Group>
              <Form.Input
                value={monthlyWage}
                width={14}
                type="Number"
                label="Monthly Wage"
                onChange={e => {
                  this.handleAllChanges("monthlyWage", e);
                }}
              />
              <Form.Input
                value={currency}
                width={3}
                label="Currency"
                type="text"
                onChange={e => {
                  this.handleAllChanges("currency", e);
                }}
              />
            </Form.Group>
            <Form.Input
              value={location}
              type="text"
              label="Location"
              onChange={e => {
                this.handleAllChanges("location", e);
              }}
            />
            {isMobile ? (
              vacancyDuration
            ) : (
              <Form.Group>{vacancyDuration}</Form.Group>
            )}
            <Form.Input
              key="hours"
              required
              value={dailyHours}
              type="Number"
              label="Daily Hours"
              onChange={e => {
                this.handleAllChanges("dailyHours", e);
              }}
            />
            <Form.Field>
              <label> Availability </label>
              <Dropdown
                options={availabilityOptions}
                onChange={this.changeDropDown}
                value={availability}
                selection
              />
            </Form.Field>
            <Form.Field>
              <label>Skills</label>
              <Dropdown
                options={skillOptions}
                placeholder="Add skills"
                search
                selection
                multiple
                allowAdditions
                value={currentValues}
                onAddItem={this.handleAddition}
                onChange={this.handleSkillChange}
                noResultsMessage=""
              />
            </Form.Field>
            <Form.TextArea
              required
              value={description}
              label="Description"
              onChange={e => {
                this.handleAllChanges("description", e);
              }}
            />

            <Button loading={loader} fluid color="yellow" type="submit">
              {edit ? <span>Edit </span> : <span>Create</span>}
            </Button>
            {errorHidden ? (
              ""
            ) : (
              <span style={{ color: "red" }}> {errorMessage}</span>
            )}
          </Form>
        </Grid.Row>
      </Grid>
    );
  }
}
export default withRouter(VacancyForm);
