import React, { Component } from "react";
import { Menu, Button, Icon, Image, Dropdown, Label } from "semantic-ui-react";
import "../../styling/Menus.css";
import { Link } from "react-router-dom";
import DesktopField from "./Desktopfield.js";
import { withRouter } from "react-router-dom";
import Notifications from "../notifications/Notifications.js";
class DesktopMenu extends Component {
  state = {
    openDropDown: false,
    openNotif: false
  };
  openDropDown = () => {
    this.setState({ openDropDown: true });
  };
  closeDropDown = () => {
    this.setState({ openDropDown: false });
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
    const { openDropDown, openNotif } = this.state;
    const {
      userInfo,
      logOut,
      login,
      redirectSignUp,
      notificationCount,
      notifications,
      deleteNotifications
    } = this.props;
    return (
      <Menu className="main-menu" borderless fixed="top">
        <Menu.Item>
          <Link className="mainMenu-link" to="/">
            Logo Here
          </Link>
        </Menu.Item>
        <DesktopField to="/Members" icon="users" text="Members" />
        <DesktopField to="/Partners" icon="building outline" text="Partners" />
        <DesktopField to="/LifeCoaches" icon="flag" text="Life Coaches" />
        <DesktopField to="/Vacancies" icon="wpforms" text="Vacancies" />
        <Menu.Item position="right">
          {userInfo ? (
            <div>
              {userInfo.type == "admin" && (
                <Icon
                  style={{ cursor: "pointer" }}
                  onClick={this.props.redirectCreateAdmin}
                  size="big"
                  name="plus"
                  inverted
                />
              )}
              <Image
                className="user-menu"
                src={
                  userInfo && userInfo.image
                    ? userInfo.image
                    : "https://react.semantic-ui.com/images/avatar/large/matthew.png"
                }
                avatar
                style={{ cursor: "pointer" }}
                onClick={this.props.redirectProfile}
                onMouseEnter={this.openDropDown}
                onMouseLeave={this.closeDropDown}
              />
              <Dropdown
                icon=""
                id="drop-options"
                pointing="top left"
                open={openDropDown}
              >
                <Dropdown.Menu>
                  <Dropdown.Header> {userInfo.name} </Dropdown.Header>
                  <Dropdown.Header>{userInfo.email}</Dropdown.Header>
                </Dropdown.Menu>
              </Dropdown>
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
                      <span id="notification-font"> {notificationCount} </span>
                    </Label>
                  ) : null}
                </Icon>

                {userInfo && openNotif ? (
                  <Notifications
                    isDesktop={true}
                    deleteNotifications={deleteNotifications}
                    close={this.closeNotif}
                    openNotif={openNotif}
                    addNotificationCount={this.props.addNotificationCount}
                    userId={userInfo.id}
                    notifications={notifications}
                  />
                ) : null}
              </Icon.Group>

              <Button onClick={logOut} inverted>
                Log out
              </Button>
            </div>
          ) : (
            <div>
              <Button onClick={login} className="login-button" inverted>
                Log In
              </Button>
              <Button onClick={redirectSignUp} inverted>
                Sign Up
              </Button>
            </div>
          )}
        </Menu.Item>
      </Menu>
    );
  }
}
export default withRouter(DesktopMenu);
