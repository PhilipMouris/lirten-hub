import React, { Component } from "react";
import "../../styling/PartnerProfile.css";
import { Image, Header, Grid, Segment, Button, List } from "semantic-ui-react";
import profile from "../../images/profile.png";
import ActionSegment from "./ActionSegment";

class PartnerBasicInfo extends Component {
  render() {
    const {
      partner,
      isMobile,
      submitFeedback,
      editProfile,
      createVacancy,
      myProfile,
      memberType,
      changePassword
    } = this.props;
    if (!partner) return null;
    const { name, email, image } = partner;
    const {
      address,
      fax,
      members,
      partners,
      phone,
      projects,
      fieldOfWork
    } = partner.userData;
    return (
      <div className="partner-info-container">
        <Image
          avatar
          size="small"
          onClick={this.adminRedirect}
          src={
            image &&
            image !== null &&
            image.includes(".") &&
            image.includes("/")
              ? image
              : profile
          }
        />
        <Header as="h1" textAlign="center">
          {name}
        </Header>
        <Grid id="mobile-padding" columns={4} divided stackable as={Segment}>
          <Grid.Row>
            <Grid.Column>
              <Header sub>Email </Header>
              <span>{email}</span>
            </Grid.Column>
            <Grid.Column>
              <Header sub>Address</Header>
              <span>{address}</span>
            </Grid.Column>
            <Grid.Column>
              <Header sub>Phone</Header>
              <span>{phone}</span>
            </Grid.Column>
            <Grid.Column>
              <Header sub>Fax</Header>
              <span>{fax}</span>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Header sub>Board Members </Header>
              <List bulleted>
                {!members
                  ? "N/A"
                  : members.map(member => (
                      <List.Item key={member}>{member}</List.Item>
                    ))}
              </List>
            </Grid.Column>
            <Grid.Column>
              <Header sub> Partners </Header>
              <List bulleted>
                {!partners
                  ? "N/A"
                  : partners.map(partner => (
                      <List.Item key={partner}>{partner}</List.Item>
                    ))}
              </List>
            </Grid.Column>
            <Grid.Column>
              <Header sub> Projects </Header>
              <List bulleted>
                {!projects
                  ? "N/A"
                  : projects.map(project => (
                      <List.Item key={project}>{project}</List.Item>
                    ))}
              </List>
            </Grid.Column>
            <Grid.Column>
              <Header sub> Field </Header>
              <span> {fieldOfWork}</span>
            </Grid.Column>
            {isMobile ? (
              <Grid.Column>
                <ActionSegment
                  myProfile={myProfile}
                  memberType={memberType}
                  submitFeedback={submitFeedback}
                  editProfile={editProfile}
                  createVacancy={createVacancy}
                  changePassword={changePassword}
                />
              </Grid.Column>
            ) : null}
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
export default PartnerBasicInfo;
