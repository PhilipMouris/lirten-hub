import React, { Component } from "react";
import "../../styling/Menus.css";
import {
  Menu,
  Sidebar,
  Icon,
  Header,
  Divider,
  Image,
  Label
} from "semantic-ui-react";
import Notifications from "../notifications/Notifications.js";
import MobileField from "./MobileField";
class MobileMenu extends Component {
  state = {
    openNotif: false
  };
  openNotif = e => {
    const { notificationCount, markAsRead } = this.props;
    if (notificationCount > 0) {
      this.props.markAsRead();
    }
    this.setState({ openNotif: !this.state.openNotif });
  };
  closeNotif = () => {
    this.setState({ openNotif: false });
  };
  render() {
    const { openNotif } = this.state;
    const {
      isSidebarVisible,
      showSideBar,
      userInfo,
      login,
      logOut,
      notificationCount,
      notifications,
      deleteNotifications,
      hideSidebar
    } = this.props;
    return (
      <div>
        <Menu className="main-menu mobile-menu" borderless fixed="top">
          <Menu.Item onClick={this.props.redirectHome}>
            <Header inverted>Lirten Hub</Header>
          </Menu.Item>
          <Menu.Item position="right">
            {userInfo ? (
              <Icon.Group size="large">
                <Icon
                  className="mainMenu-link"
                  id="notifTarget"
                  size="large"
                  name="bell outline"
                  inverted
                  style={{ cursor: "pointer" }}
                  onClick={this.openNotif}
                >
                  {notificationCount > 0 ? (
                    <Label circular floating color="red">
                      <span id="notification-font">{notificationCount}</span>
                    </Label>
                  ) : null}
                </Icon>
                {userInfo && openNotif ? (
                  <Notifications
                    deleteNotifications={deleteNotifications}
                    close={this.closeNotif}
                    openNotif={openNotif}
                    addNotificationCount={this.props.addNotificationCount}
                    userId={userInfo.id}
                    notifications={notifications}
                  />
                ) : null}
              </Icon.Group>
            ) : null}

            <Icon size="big" inverted name="sidebar" onClick={showSideBar} />
          </Menu.Item>
        </Menu>
        <Sidebar
          as={Menu}
          animation="overlay"
          width="thin"
          visible={isSidebarVisible}
          vertical
          inverted
          stackable
          direction="right"
          size="tiny"
        >
          {userInfo ? (
            <Menu.Item
              onClick={() => {
                this.props.hideSidebar();
                this.props.redirectProfile();
              }}
            >
              <Image
                className="user-menu"
                src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
                avatar
              />
              <Header size="small" className="profile-header" inverted>
                {userInfo.name}
              </Header>
              <Header size="small" inverted>
                {userInfo.email}
              </Header>
            </Menu.Item>
          ) : null}
          <Divider fitted />
          <MobileField
            hideSidebar={hideSidebar}
            to="/Members"
            icon="users"
            name="Members"
          />
          <MobileField
            hideSidebar={hideSidebar}
            to="/Partners"
            icon="building outline"
            name="Partners"
          />
          <MobileField
            hideSidebar={hideSidebar}
            to="/LifeCoaches"
            icon="flag outline"
            name="Life Coaches"
          />
          <MobileField
            hideSidebar={hideSidebar}
            to="/Vacancies"
            icon="wpforms"
            name="Vacancies"
          />
          {userInfo ? (
            <Menu.Item
              onClick={() => {
                hideSidebar();
                logOut();
              }}
            >
              <Header textAlign="center" icon inverted>
                Log out
              </Header>
            </Menu.Item>
          ) : (
            [
              <Menu.Item
                key="login"
                onClick={() => {
                  hideSidebar();
                  login();
                }}
              >
                <Header textAlign="center" icon inverted>
                  Log In
                </Header>
              </Menu.Item>,
              <MobileField
                hideSidebar={hideSidebar}
                key="signUp"
                to="/SignUp"
                name="Sign up"
              />
            ]
          )}
        </Sidebar>
      </div>
    );
  }
}
export default MobileMenu;
