import React, { Component } from "react";
import decode from "jwt-decode";
import * as axios from "../../services/axios.js";
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
  Icon
} from "semantic-ui-react";
import "../../styling/signup.css";
import EditProfileTest from "../../pages/EditProfileTest.js";
class EditProfileForm extends React.Component {
  state = {
    userInfo: {
      email: "",
      name: "",
      fax: "",
      phone: "",
      salary: "",
      address: "",
      approved: false,
      partners: [],
      members: [],
      projects: [],
      hourlyRate: "",
      type: "",
      dateOfBirth: "",
      image: "",
      gender: "",
      hourlyRate: "",
      skills: [],
      interests: [],
      availability: "",
      location: "",
      fieldOfWork:""
    },
    memberAttrs: [
      "name",
      "dateOfBirth",
      "gender",
      "hourlyRate",
      "email",
      "skills",
      "interests",
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
      "image",
      "approved",
      "fieldOfWork"
    ],
    lifeCoachAttrs: [
      "name",
      "dateOfBirth",
      "gender",
      "hourlyRate",
      "email",
      "image"
    ],

    options: [
      { key: "member", text: "Member", value: "member" },

      {
        key: "lifeCoach",
        text: "LifeCoach",
        value: "lifeCoach"
      },
      {
        key: "partner",
        text: "Partner",
        value: "partner"
      }
    ],
    errorContent: "",
    addedSkills: [],
    addedInterests: [],
    addedMembers: [],
    addedProjects: [],
    addedPartners: [],
    user_id: "",
    hidden: true
  };
  handleAllChanges = (prop, e) => {
    let { userInfo } = this.state;
    if (!Object.keys(userInfo)) return;
    Object.keys(userInfo).map(key => {
      if ("" + key == prop) {
        userInfo[key] = e.target.value;
      }
    });
    this.setState({ userInfo: userInfo });
  };
  getCorrectDate = dateIn => {
    let date = new Date(dateIn);
    let year = date.getFullYear();
    let month = date.getUTCMonth().valueOf() + 1 + "";
    let day = date.getDay() + "";
    month = month.length == 1 ? "0" + month : month;
    day = day.length == 1 ? "0" + day : day;
    return year + "-" + month + "-" + day;
  };
  componentDidMount() {
    const user = this.props.user;
    const { memberAttrs, partnerAttrs, lifeCoachAttrs } = this.state;
    const { userData, ...basicAttrs } = user;
    const allUserData = { ...userData };
    const data = {
      ...basicAttrs,
      ...allUserData
    };

    console.log(data, "DATA");
    let newData = {};
    this.setState({
      user_id: user._id,
      userInfo: {
        ...this.state.userInfo,
        type: user.type
      }
    });
    Object.keys(data).map(key => {
      if (key === "type") {
        newData[key] = data[key];
      }

      if (user.type === "member") {
        if (
          data[key] != null &&
          data[key].length != 0 &&
          memberAttrs.includes(key)
        )
          if (key === "skills") {
            this.setState({
              addedSkills: data[key].map(project => {
                return { key: project, text: project, value: project };
              })
            });
          } else if (key === "interests") {
            this.setState({
              addedInterests: data[key].map(project => {
                return { key: project, text: project, value: project };
              })
            });
          }
        newData[key] = data[key];
      } else if (user.type === "partner") {
        if (
          data[key] != null &&
          data[key].length != 0 &&
          partnerAttrs.includes(key)
        ) {
          if (key === "partners") {
            this.setState({
              addedPartners: data[key].map(partner => {
                return { key: partner, text: partner, value: partner };
              })
            });
          } else if (key === "projects") {
            this.setState({
              addedProjects: data[key].map(project => {
                return { key: project, text: project, value: project };
              })
            });
          } else if (key === "members") {
            this.setState({
              addedMembers: data[key].map(member => {
                return { key: member, text: member, value: member };
              })
            });
          }
          newData[key] = data[key];
        }
      } else if (user.type === "lifeCoach") {
        if (
          data[key] != null &&
          data[key].length != 0 &&
          lifeCoachAttrs.includes(key)
        )
          newData[key] = data[key];
      }
      if (key === "dateOfBirth") {
        newData[key] = this.getCorrectDate(data[key]);
      }
    });
    console.log(newData, "NEW");
    this.setState({ userInfo: { ...this.state.userInfo, ...newData } });
  }
  checkInputArray = arr => {
    let result = true;
    console.log(arr, "ARRAYY");
    arr.map(inp => {
      if (inp.length == 0) result = false;
    });
    return result;
  };
  checkInput = () => {
    let { email, name, dateOfBirth, type, gender } = this.state.userInfo;
    let allReq = [email, name];
    let MemReq = [dateOfBirth, gender];
    let AdminCoachReq = [dateOfBirth, gender];
    console.log(type, "TYPE");
    if (!this.checkInputArray(allReq)) {
      return false;
    }
    if (type === "member") {
      if (!this.checkInputArray(MemReq)) {
        return false;
      }
    } else if (type != "partner") {
      console.log("IN AdminCoach REQ CHECK");
      if (!this.checkInputArray(AdminCoachReq)) return false;
    }
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
  update = () => {
    let { type } = this.state.userInfo;
    this.setState({ loading: true });
    let { memberAttrs, partnerAttrs, lifeCoachAttrs, user_id } = this.state;
    let url =
      type === "member"
        ? "users/members/update/"
        : type === "partner"
        ? "users/partners/update/"
        : type === "lifeCoach"
        ? "users/lifeCoaches/update/"
        : "";
    url = url + user_id;
    let data = this.state.userInfo;
    let newData = {};
    Object.keys(data).map(key => {
      if (type === "member") {
        if (
          data[key] != null &&
          data[key].length != 0 &&
          memberAttrs.includes(key)
        )
          newData[key] = data[key];
      } else if (type === "partner") {
        if (
          data[key] != null &&
          data[key].length != 0 &&
          partnerAttrs.includes(key)
        )
          newData[key] = data[key];
      } else if (type === "lifeCoach") {
        if (
          data[key] != null &&
          data[key].length != 0 &&
          lifeCoachAttrs.includes(key)
        )
          newData[key] = data[key];
      }
    });
    console.log(newData, "New Data");
    axios
      .put(url, newData)
      .then(data => {
        this.setState({ hidden: true, loading: false });
        let userData = {};
        let user = {};
        Object.keys(newData).map(key => {
          if (type === "partner") {
            if (
              newData[key] != null &&
              newData[key].length != 0 &&
              partnerAttrs.includes(key) &&
              key !== "name" &&
              key !== "email" &&
              key !== "password" &&
              key !== "type"
            ) {
              userData[key] = newData[key];
            } else if (
              newData[key] != null &&
              newData[key].length != 0 &&
              partnerAttrs.includes(key) &&
              (key === "name" || key === "email" || key !== "type")
            ) {
              user[key] = newData[key];
            }
          } else if (type === "lifeCoach") {
            if (
              newData[key] != null &&
              newData[key].length != 0 &&
              lifeCoachAttrs.includes(key) &&
              key !== "name" &&
              key !== "email" &&
              key !== "password" &&
              key !== "type"
            ) {
              userData[key] = newData[key];
            } else if (
              newData[key] != null &&
              newData[key].length != 0 &&
              lifeCoachAttrs.includes(key) &&
              (key === "name" || key === "email" || key !== "type")
            ) {
              user[key] = newData[key];
            }
          } else if (type === "member") {
            if (
              newData[key] != null &&
              newData[key].length != 0 &&
              memberAttrs.includes(key) &&
              key !== "name" &&
              key !== "email" &&
              key !== "password" &&
              key !== "type"
            ) {
              userData[key] = newData[key];
            } else if (
              newData[key] != null &&
              newData[key].length != 0 &&
              memberAttrs.includes(key) &&
              (key === "name" || key === "email" || key !== "type")
            ) {
              user[key] = newData[key];
            }
          }
        });
        if (type === "lifeCoach") {
          userData = {
            ...userData,
            monthlySlots: this.props.user.userData.monthlySlots,
            ratings: this.props.user.userData.ratings
          };
        }
        user = {
          ...user,
          userData: userData,
          password: this.props.user.password,
          type: this.props.user.type
        };
        this.redirect(user_id, user);
      })
      .catch(error => {
        console.log(error);
        this.setState({
          errorContent: error.response.data.error,
          hidden: false
        });
      });
  };
  redirect = (id, user) => {
    this.props.redirect(id, user);
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
      type,
      dateOfBirth,
      image,
      gender,
      fieldOfWork,
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
      addedMembers,
      addedProjects,
      loading
    } = this.state;
    console.log(dateOfBirth, "DOB");
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
                onSubmit={this.update}
              >
                <Header inverted as="h1">
                  {" "}
                  Update Your Profile{" "}
                </Header>
                <Form.Field required>
                  <label>Name</label>
                  <Input
                    inverted
                    fluid
                    type="name"
                    iconPosition="left"
                    icon="male"
                    name="name"
                    value={name}
                    onChange={e => this.handleAllChanges("name", e)}
                    placeholder="Peter Johnson"
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
                    onChange={e => this.handleAllChanges("email", e)}
                    placeholder="example@gmail.com"
                  />
                </Form.Field>

                {type === "member"
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
                        />
                      </Form.Field>,

                      <Form.Field>
                        <label>Interests</label>
                        <Form.Dropdown
                          options={interests}
                          selection
                          fluid
                          multiple
                          allowAdditions
                          search
                          value={interests}
                          onAddItem={this.handleInterestAdd}
                          onChange={this.handleChangeInterest}
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
                      <Form.Group widths={16}>
                        <Form.Input
                          value={hourlyRate}
                          width={10}
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
                {type === "partner"
                  ? [
                      <Form.Group widths="equal">
                        <Form.Input
                          value={fax}
                          fluid
                          onChange={e => this.handleAllChanges("fax", e)}
                          label="Fax"
                        />

                        <Form.Input
                          value={phone}
                          fluid
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
                        />
                      </Form.Field>,
                      <Form.Field>
                        <Form.Dropdown
                          options={addedMembers}
                          selection
                          label="Members"
                          multiple
                          fluid
                          allowAdditions
                          search
                          value={members}
                          onAddItem={this.handleMemberAdd}
                          onChange={this.handleChangeMembers}
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
                        />
                      </Form.Field>,
                      <Form.Field required>
                        <label>Field of Work </label>
                        <Input
                          value={fieldOfWork}
                          onChange={e => this.handleAllChanges("fieldOfWork", e)}
                        />
                        </Form.Field>
                    ]
                  : null}
                {type === "lifeCoach"
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
                      <Form.Group>
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
                  disabled={!this.checkInput()}
                  color="yellow"
                  type="submit"
                  fluid
                >
                  Update
                </Button>
              </Form>

              <Message icon hidden={hidden} error size="small">
                <Icon name="times circle" />
                <Message.Content>
                  <Message.Header>{errorContent}</Message.Header>
                </Message.Content>
              </Message>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )

      //   </div>
    );
  }
}

export default EditProfileForm;
