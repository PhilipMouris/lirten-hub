import React, { Component } from "react";
import decode from "jwt-decode";
import * as axios from "../../services/axios.js";
import { AC_logIn, AC_set_firebaseToken } from "../../actions/UserActions";
import { connect } from "react-redux";
import {
  Form,
  Grid,
  Header,
  Input,
  Button,
  Divider,
  Dropdown,
  Segment,
  Message,
  Container,
  Dimmer,
  Loader,
  Icon,
  Popup
} from "semantic-ui-react";
import "../../styling/signup.css";
const firebase = require("firebase");

class SignUp extends React.Component {
  state = {
    userInfo: {
      email: "",
      password: "",
      name: "",
      phone: "",
      salary: "",
      isSuper: "",
      fax: "",
      address: "",
      approved: false,
      partners: [],
      members: [],
      projects: [],
      hourlyRate: "",
      fieldOfWork: "",
      type: "Partner",
      dateOfBirth: "",
      image: "",
      gender: "",
      hourlyRate: "",
      skills: [],
      interests: [],
      availability: "",
      location: ""
    },
    memberAttrs: [
      "name",
      "dateOfBirth",
      "gender",
      "hourlyRate",
      "email",
      "skills",
      "interests",
      "password",
      "image",
      "availability",
      "location"
    ],
    partnerAttrs: [
      "name",
      "address",
      "email",
      "fax",
      "phone",
      "partners",
      "members",
      "projects",
      "fieldOfWork",
      "password",
      "image",
      "approved"
    ],
    lifeCoachAttrs: [
      "name",
      "password",
      "dateOfBirth",
      "gender",
      "hourlyRate",
      "email",
      "image"
    ],

    options: [
      { key: "member", text: "Member", value: "Member" },

      {
        key: "lifeCoach",
        text: "LifeCoach",
        value: "LifeCoach"
      },
      {
        key: "partner",
        text: "Partner",
        value: "Partner"
      }
    ],
    errorContent: "",
    addedSkills: [],
    addedInterests: [],
    addedMembers: [],
    addedProjects: [],
    addedPartners: [],
    loading: false,
    user_id: "",
    hidden: true,
    errorFieldName: "",
    errorFieldMessage: ""
  };
  validateData = () => {
    const {
      password,
      name,
      phone,
      salary,
      isSuper,
      fax,
      address,
      approved,
      hourlyRate,
      fieldOfWork,
      type,
      dateOfBirth
    } = this.state.userInfo;
    //checking name only includes letters
    for (let i = 0; i < name.length; i++) {
      if (
        (name.charCodeAt(i) < 65 || name.charCodeAt(i) > 122) &&
        name.charCodeAt(i) !== 32
      ) {
        this.setErrorField(
          "name",
          "Name cannot contain special characters or numbers"
        );
        return false;
      }
    }
    //password > 6
    if (password.length < 6) {
      this.setErrorField("password", "Password must be atleast 6 characters");
      return false;
    }
    return true;
  };
  setErrorField = (errorFieldName, errorFieldMessage) => {
    this.setState({ errorFieldName, errorFieldMessage });
  };
  handleAllChanges = (prop, e) => {
    let { userInfo } = this.state;
    if (!Object.keys(userInfo)) return;
    Object.keys(userInfo).map(key => {
      if ("" + key == prop) {
        userInfo[key] = e.target.value;
      }
    });
    this.setState({
      userInfo: userInfo,
      errorFieldName: "",
      errorFieldMessage: ""
    });
  };
  componentDidMount() {
    this.setState({ reserveAttrs: this.state.userInfo });
  }
  askPerm = userId => {
    firebase
      .messaging()
      .requestPermission()
      .then(function(e = null) {
        console.log("Granted!" + e);

        return firebase.messaging().getToken();
      })
      .then(token => {
        const url = "subscribers/add";
        axios.post(url, { userId, token }).then(resp => console.log(resp));
        console.log("Token:" + token + " " + userId);
        this.props.dispatch(AC_set_firebaseToken(token));
      })
      .catch(function(err) {
        console.log(err, "ERROR");
        console.log("Error! :: " + err);
      });
  };
  checkInputArray = arr => {
    let result = true;
    arr.map(inp => {
      if (inp.length == 0) result = false;
    });
    return result;
  };
  checkInput = () => {
    let {
      email,
      password,
      type,
      name,
      dateOfBirth,
      gender
    } = this.state.userInfo;
    let allReq = [email, password, type, name];
    let MemReq = [dateOfBirth, gender];
    let AdminCoachReq = [dateOfBirth];
    if (!this.checkInputArray(allReq)) return false;
    if (type === "Member") {
      if (!this.checkInputArray(MemReq)) return false;
    } else if (type != "Partner")
      if (!this.checkInputArray(AdminCoachReq)) return false;
    return true;
  };
  handleDropChange = (e, { value }) => {
    let { userInfo } = this.state;
    if (userInfo) {
      userInfo["type"] = value;
      this.setState({ userInfo: userInfo });
    }
  };
  handleGenderChange = (e, { value }) => {
    let { userInfo } = this.state;
    if (userInfo) {
      userInfo["gender"] = value;
      this.setState({ userInfo: userInfo });
    }
  };
  handleAvailabilityDrop = (e, { value }) => {
    let { userInfo } = this.state;
    if (userInfo) {
      userInfo["availability"] = value;
      this.setState({ userInfo: userInfo });
    }
  };
  handleSkillAdd = (e, { value }) => {
    this.setState({
      addedSkills: [
        { key: value, text: value, value: value },
        ...this.state.addedSkills
      ]
    });
  };
  handleInterestAdd = (e, { value }) => {
    this.setState({
      addedInterests: [
        { key: value, text: value, value: value },
        ...this.state.addedInterests
      ]
    });
  };
  handlePartnerAdd = (e, { value }) => {
    this.setState({
      addedPartners: [
        { key: value, text: value, value: value },
        ...this.state.addedPartners
      ]
    });
  };
  handleProjectAdd = (e, { value }) => {
    this.setState({
      addedProjects: [
        { key: value, text: value, value: value },
        ...this.state.addedProjects
      ]
    });
  };
  handleMemberAdd = (e, { value }) => {
    this.setState({
      addedMembers: [
        { key: value, text: value, value: value },
        ...this.state.addedMembers
      ]
    });
  };
  //   handleChangeGeneral = (prop,e,{value}) => {
  //       console.log(e,value,"EVENT")
  //     // let { userInfo } = this.state;
  //     // if (userInfo) {
  //     //   userInfo[prop] = e.target.value;
  //     // }
  //     // this.setState({ userInfo: userInfo });
  //   };
  handleChangeSkill = (e, { value }) => {
    let { userInfo } = this.state;
    if (userInfo) {
      userInfo["skills"] = value;
    }
    this.setState({ userInfo: userInfo });
  };
  handleChangePartners = (e, { value }) => {
    let { userInfo } = this.state;
    if (userInfo) {
      userInfo["partners"] = value;
    }
    this.setState({ userInfo: userInfo });
  };
  handleChangeProjets = (e, { value }) => {
    let { userInfo } = this.state;
    if (userInfo) {
      userInfo["projects"] = value;
    }
    this.setState({ userInfo: userInfo });
  };
  handleChangeMembers = (e, { value }) => {
    let { userInfo } = this.state;
    if (userInfo) {
      userInfo["members"] = value;
    }
    this.setState({ userInfo: userInfo });
  };
  handleChangeInterest = (e, { value }) => {
    let { userInfo } = this.state;
    if (userInfo) {
      userInfo["interests"] = value;
    }
    this.setState({ userInfo: userInfo });
  };
  signUp = () => {
    let { type } = this.state.userInfo;
    let { memberAttrs, partnerAttrs, lifeCoachAttrs } = this.state;
    if (!this.validateData()) {
      window.scroll(0, 0);
      return;
    }
    let url =
      type === "Member"
        ? "users/members/create"
        : type === "Partner"
        ? "users/partners/create/"
        : type === "LifeCoach"
        ? "users/lifeCoaches/create/"
        : "";
    let data = this.state.userInfo;
    let newData = {};
    this.setState({ loading: true });
    Object.keys(data).map(key => {
      if (type === "Member") {
        if (
          data[key] != null &&
          data[key].length != 0 &&
          memberAttrs.includes(key)
        )
          newData[key] = data[key];
      } else if (type === "Partner") {
        if (
          data[key] != null &&
          data[key].length != 0 &&
          partnerAttrs.includes(key)
        )
          newData[key] = data[key];
      } else if (type === "LifeCoach") {
        if (
          data[key] != null &&
          data[key].length != 0 &&
          lifeCoachAttrs.includes(key)
        )
          newData[key] = data[key];
      }
    });
    axios
      .post(url, newData)
      .then(data => {
        if (type === "Partner") {
          const notifUrl = `subscribers/sendAllAdmins`;
          const req = {
            data: {
              title: "Partner Pending Approval!",
              body: `A new partner requested approval`,
              link: `/Partners`,
              actionTitle: "Visit",
              img: data.data.data.image
            }
          };
          axios.post(notifUrl, req).then(resp => console.log(resp));
        }
        this.setState({ hidden: true });
        console.log(data);
        let body = {
          email: newData.email,
          password: newData.password
        };
        axios.post("users/login", body).then(data => {
          localStorage.setItem("jwtToken", data.data.data);
          this.props.dispatch(AC_logIn(decode(data.data.data)));
          this.askPerm(decode(data.data.data).id);
          this.setState({ loading: false });
          this.redirect();
        });
      })
      .catch(error => {
        this.setState({
          errorContent: error.response.data.error,
          hidden: false,
          loading: false
        });
      });
  };
  redirect = () => {
    this.props.redirect();
  };

  render() {
    let {
      email,
      password,
      name,
      phone,
      salary,
      isSuper,
      fax,
      partners,
      members,
      projects,
      hourlyRate,
      fieldOfWork,
      type,
      dateOfBirth,
      image,
      gender,
      address,
      skills,
      interests,
      availability,
      location
    } = this.state.userInfo;
    let genderOptions = [
      { key: "male", text: "Male", value: "Male" },
      { key: "female", text: "Female", value: "Female" }
    ];
    let availabilityOptions = [
      { key: "part", text: "Part-Time", value: "part-time" },
      { key: "full", text: "Full-Time", value: "full-time" }
    ];
    let {
      options,
      hidden,
      addedSkills,
      errorContent,
      addedInterests,
      addedPartners,
      loading,
      addedMembers,
      addedProjects,
      errorFieldName,
      errorFieldMessage
    } = this.state;

    return (
      //   <div class="signup">
      loading ? (
        <div>
          <Dimmer active>
            <Loader size="huge" inverted />
          </Dimmer>
        </div>
      ) : (
        <Grid id="signup" columns={1} centered stackable>
          <Grid.Row columns={1} id="header-row">
            <Grid.Column textAlign="center">
              <Form
                inverted
                size="big"
                widths={16}
                error
                onSubmit={this.signUp}
              >
                <Header textAlign="left" inverted as="h1">
                  {" "}
                  Join Lirten Hub{" "}
                  <Header.Subheader>A world of opportunities</Header.Subheader>
                </Header>
                {!hidden && (
                  <Message icon hidden={hidden} error size="small">
                    <Icon name="times circle" />
                    <Message.Content>
                      <Message.Header>{errorContent}</Message.Header>
                    </Message.Content>
                  </Message>
                )}
                <Form.Field required>
                  <label>Name</label>
                  <Popup
                    style={{ color: "red" }}
                    trigger={
                      <Input
                        inverted
                        fluid
                        type="name"
                        iconPosition="left"
                        icon="male"
                        name="name"
                        value={name}
                        error={errorFieldName === "name"}
                        onChange={e => this.handleAllChanges("name", e)}
                        placeholder="Peter Johnson"
                      />
                    }
                    content={errorFieldMessage}
                    open={errorFieldName === "name"}
                  />
                </Form.Field>
                <Form.Field required>
                  <label>Email</label>
                  <Input
                    fluid
                    type="email"
                    iconPosition="left"
                    icon="mail"
                    name="Email"
                    value={email}
                    pattern="^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$"
                    onChange={e => this.handleAllChanges("email", e)}
                    placeholder="example@gmail.com"
                  />
                </Form.Field>
                <Popup
                  style={{ color: "red", marginBottom: "-1em" }}
                  trigger={
                    <Form.Field required>
                      <label>Password</label>
                      <Input
                        icon="lock"
                        fluid
                        iconPosition="left"
                        type="password"
                        name="password"
                        value={password}
                        error={errorFieldName === "password "}
                        onChange={e => this.handleAllChanges("password", e)}
                      />
                    </Form.Field>
                  }
                  content={errorFieldMessage}
                  open={errorFieldName === "password"}
                />

                <Form.Field required>
                  <label>User Type</label>
                  <Dropdown
                    fluid
                    floating
                    options={options}
                    selection
                    value={type}
                    onChange={this.handleDropChange}
                  />
                </Form.Field>
                {type === "Member"
                  ? [
                      <Form.Group widths="equal">
                        <Form.Input
                          fluid
                          type="date"
                          value={dateOfBirth}
                          onChange={e =>
                            this.handleAllChanges("dateOfBirth", e)
                          }
                          required
                          label="Birth Date"
                        />

                        {/* <Form.Field required>
                        <label>Gender</label> */}
                        <Form.Dropdown
                          fluid
                          options={genderOptions}
                          label="Gender"
                          selection
                          value={gender}
                          onChange={this.handleGenderChange}
                        />
                        {/* </Form.Field> */}
                      </Form.Group>,

                      <Form.Field>
                        <label>Skills</label>
                        <Form.Dropdown
                          options={addedSkills}
                          selection
                          fluid
                          multiple
                          allowAdditions
                          search
                          value={skills}
                          onAddItem={this.handleSkillAdd}
                          onChange={this.handleChangeSkill}
                          noResultsMessage=""
                        />
                      </Form.Field>,

                      <Form.Field>
                        <label>Interests</label>
                        <Form.Dropdown
                          options={addedInterests}
                          selection
                          fluid
                          multiple
                          allowAdditions
                          search
                          value={interests}
                          onAddItem={this.handleInterestAdd}
                          onChange={this.handleChangeInterest}
                          noResultsMessage=""
                        />
                      </Form.Field>,
                      <Form.Group widths="equal">
                        <Form.Dropdown
                          options={availabilityOptions}
                          selection
                          fluid
                          label="Availability"
                          value={availability}
                          onChange={this.handleAvailabilityDrop}
                        />

                        <Form.Input
                          fluid
                          value={location}
                          onChange={e => this.handleAllChanges("location", e)}
                          label="Location"
                        />
                      </Form.Group>,
                      <Form.Input
                        value={image}
                        onChange={e => this.handleAllChanges("image", e)}
                        label="Image Link"
                      />
                    ]
                  : null}
                {type === "Partner"
                  ? [
                      <Form.Input
                        value={fieldOfWork}
                        fluid
                        onChange={e => this.handleAllChanges("fieldOfWork", e)}
                        label="Work Field"
                      />,
                      <Form.Group widths="equal">
                        <Form.Input
                          value={fax}
                          fluid
                          onChange={e => this.handleAllChanges("fax", e)}
                          label="Fax"
                        />

                        <Form.Input
                          type="tel"
                          value={phone}
                          pattern={"^[0-9]{5,11}$"}
                          fluid
                          placeholder={"5-11 digits"}
                          onChange={e => this.handleAllChanges("phone", e)}
                          label="Phone"
                        />
                      </Form.Group>,
                      <Form.Group widths="equal">
                        <Form.Input
                          value={address}
                          fluid
                          onChange={e => this.handleAllChanges("address", e)}
                          label="Address"
                        />
                        <Form.Input
                          value={image}
                          // width={16}
                          fluid
                          onChange={e => this.handleAllChanges("image", e)}
                          label="Link"
                        />
                      </Form.Group>,
                      <Form.Field>
                        <Form.Dropdown
                          label="Partners"
                          options={addedPartners}
                          selection
                          multiple
                          allowAdditions
                          search
                          width={16}
                          value={partners}
                          onAddItem={this.handlePartnerAdd}
                          onChange={this.handleChangePartners}
                          noResultsMessage=""
                        />
                      </Form.Field>,
                      <Form.Field>
                        <Form.Dropdown
                          options={addedMembers}
                          selection
                          label="Board Members"
                          multiple
                          fluid
                          allowAdditions
                          search
                          value={members}
                          onAddItem={this.handleMemberAdd}
                          onChange={this.handleChangeMembers}
                          noResultsMessage=""
                        />
                      </Form.Field>,
                      <Form.Field>
                        <Form.Dropdown
                          options={addedProjects}
                          selection
                          multiple
                          label="Projects"
                          allowAdditions
                          search
                          fluid
                          value={projects}
                          onAddItem={this.handleProjectAdd}
                          onChange={this.handleChangeProjets}
                          noResultsMessage=""
                        />
                      </Form.Field>
                    ]
                  : null}
                {type === "LifeCoach"
                  ? [
                      <Form.Group widths="equal">
                        <Form.Input
                          type="date"
                          value={dateOfBirth}
                          onChange={e =>
                            this.handleAllChanges("dateOfBirth", e)
                          }
                          required
                          fluid
                          label="Birth Date"
                        />
                        <Form.Field required>
                          <label>Gender</label>
                          <Dropdown
                            options={genderOptions}
                            selection
                            fluid
                            value={gender}
                            onChange={this.handleGenderChange}
                          />
                        </Form.Field>
                      </Form.Group>,
                      <Form.Group widths="equal">
                        <Form.Input
                          value={hourlyRate}
                          fluid
                          onChange={e => this.handleAllChanges("hourlyRate", e)}
                          label="Hour Rate"
                        />
                        <Form.Input
                          value={image}
                          onChange={e => this.handleAllChanges("image", e)}
                          label="Image Link"
                        />
                      </Form.Group>
                    ]
                  : null}
                <Button
                  fluid
                  disabled={!this.checkInput()}
                  color="yellow"
                  type="submit"
                >
                  Sign Up
                </Button>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )

      //   </div>
    );
  }
}
const mapStateToProps = state => {
  return {};
};
export default connect(mapStateToProps)(SignUp);
