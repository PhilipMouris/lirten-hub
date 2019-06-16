import React, { Component } from "react";
import { Grid, Form, Button, Header } from "semantic-ui-react";
import "../../styling/AdminForm.css";
import * as Axios from "../../services/axios.js";

export default class AdminForm extends Component {
  state = {
    name: "",
    email: "",
    phone: "",
    password: "",
    gender: "",
    salary: "",
    currency: "",
    isSuper: false,
    dateOfBirth: "",
    image: "",
    loader: false,
    errorHidden: true,
    errorMessage: "",
    successHidden: true
  };

  handleAllChanges = (prop, e) => {
    const newState = this.state;
    newState[prop] = e.target.value;
    newState.errorHidden = true;
    newState.successHidden = true;
    this.setState(newState);
  };

  handleChecked = e => {
    this.setState({ isSuper: !this.state.isSuper });
  };

  handleGenderChange = (e, { value }) => {
    this.setState({ gender: value });
  };

  createAdmin = () => {
    this.setState({ loader: true });
    const {
      name,
      email,
      phone,
      password,
      gender,
      currency,
      isSuper,
      dateOfBirth,
      image
    } = this.state;
    let { salary } = this.state;
    salary += currency;
    const url = "users/admins/create";
    const data = {
      name,
      email,
      phone,
      password,
      gender,
      salary,
      dateOfBirth,
      image
    };
    //deleting any empty props incase they are empty
    Object.keys(data).forEach(key => {
      if (data[key].length === 0) delete data[key];
    });
    data.isSuper = isSuper;
    Axios.post(url, data)
      .then(resp => {
        this.setState({
          name: "",
          email: "",
          phone: "",
          password: "",
          gender: "",
          salary: "",
          currency: "",
          isSuper: false,
          dateOfBirth: "",
          image: "",
          loader: false,
          errorHidden: true,
          errorMessage: "",
          successHidden: false
        });
      })
      .catch(error => {
        this.setState({ loader: false });
        if (error.response.data.error) {
          this.setState({
            errorMessage: error.response.data.error,
            errorHidden: false,
            successHidden: true
          });
        } else {
          this.setState({
            errorMessage: "Something went wrong",
            errorHidden: false,
            successHidden: true
          });
        }
      });
  };

  render() {
    const {
      name,
      email,
      phone,
      password,
      gender,
      salary,
      currency,
      isSuper,
      dateOfBirth,
      image,
      loader,
      errorHidden,
      errorMessage,
      successHidden
    } = this.state;
    const { isMobile } = this.props;
    const formSize = isMobile ? "tiny" : "large";
    const genderOptions = [
      { key: "male", text: "Male", value: "Male" },
      { key: "female", text: "Female", value: "Female" }
    ];
    return (
      <Grid centered padded>
        <Grid.Row>
          <Form
            inverted
            error
            className="box-shadow admin-form"
            size={formSize}
            onSubmit={this.createAdmin}
          >
            <Header inverted size="huge" textAlign="left">
              Create Admin
              <Header.Subheader>
                Create admins to help manage the system
              </Header.Subheader>
            </Header>
            <Form.Input
              onChange={e => {
                this.handleAllChanges("name", e);
              }}
              value={name}
              type="text"
              label="Full Name"
              required
            />
            <Form.Input
              onChange={e => {
                this.handleAllChanges("email", e);
              }}
              value={email}
              type="text"
              label="Email"
              required
            />
            <Form.Input
              onChange={e => {
                this.handleAllChanges("password", e);
              }}
              value={password}
              type="password"
              label="Password"
              required
            />
            <Form.Input
              fluid
              type="date"
              value={dateOfBirth}
              onChange={e => this.handleAllChanges("dateOfBirth", e)}
              label="Birth Date"
              required
            />
            <Form.Input
              onChange={e => {
                this.handleAllChanges("phone", e);
              }}
              value={phone}
              type="text"
              label="Phone Number"
            />
            <Form.Dropdown
              fluid
              options={genderOptions}
              label="Gender"
              selection
              value={gender}
              onChange={this.handleGenderChange}
            />
            <Form.Group>
              <Form.Input
                value={salary}
                width={14}
                type="Number"
                label="Salary"
                onChange={e => {
                  this.handleAllChanges("salary", e);
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
              value={image}
              label="Photo Link"
              type="text"
              onChange={e => {
                this.handleAllChanges("image", e);
              }}
            />
            <Form.Checkbox
              checked={isSuper}
              label="Do you want this admin to be a super admin?"
              onChange={this.handleChecked}
            />
            <Button loading={loader} fluid color="yellow" type="submit">
              Create
            </Button>
            {errorHidden ? (
              ""
            ) : (
              <span style={{ color: "red" }}> {errorMessage}</span>
            )}
            {successHidden ? (
              ""
            ) : (
              <span style={{ color: "green" }}>Admin Created Successfully</span>
            )}
          </Form>
        </Grid.Row>
      </Grid>
    );
  }
}
