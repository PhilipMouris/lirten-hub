import React, { Component } from "react";
import "./App.css";
import { Responsive } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import DesktopMenu from "./components/appMenus/DesktopMenu.js";
import MobileMenu from "./components/appMenus/MobileMenu.js";
import LoginModal from "./components/login/LoginModal.js";
import Footer from "./components/footer/Footer.js";
import decode from "jwt-decode";
import * as UserActions from "./actions/UserActions.js";
import { post, get, del, put } from "./services/axios";
import { connect } from "react-redux";
const firebase = require("firebase");

const config = {
  apiKey: "AIzaSyCww59lGaExhAFFK1kkVQxp4EWHoI-mBI0",
  authDomain: "lirten-hub.firebaseapp.com",
  databaseURL: "https://lirten-hub.firebaseio.com",
  projectId: "lirten-hub",
  storageBucket: "lirten-hub.appspot.com",
  messagingSenderId: "901639143723"
};

class App extends Component {
  state = {
    isSidebarVisible: false,
    openLoginModal: false,
    notifications: [],
    notificationCount: 0,
    firebaseToken: ""
  };
  componentDidMount() {
    this.setToken();
    try {
      firebase.initializeApp(config);
      firebase
        .messaging()
        .usePublicVapidKey(
          "BPgRlyFu7oPQNI34lY9AVdRysmu2JTKA-uDq5y62_nx1CcY0RcpuWz5uB189K9yfvTLtG06QvCnYD9QRVaxYgWQ"
        );
      firebase
        .messaging()
        .getToken()
        .then(token => this.setState({ firebaseToken: token }));
      firebase.messaging().onMessage(payload => {
        let { notifications, notificationCount } = this.state;
        //notifications.push(payload);
        const { userInfo } = this.props;
        if (!payload.data.userIds.includes(userInfo.id)) return;
        notifications = [payload].concat(notifications);
        this.setState({
          notifications,
          notificationCount: notificationCount + 1
        });
      });
    } catch (error) {
      console.log("Unsupported browser for notifications");
    }
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
        post(url, { userId, token }).then(resp => console.log(resp));
        console.log("Token:" + token + " " + userId);
        this.setState({ firebaseToken: token });
      })
      .catch(function(err) {
        console.log(err, "ERROR");
        console.log("Error! :: " + err);
      });
  };
  handleTokenChange = e => {
    this.setToken();
  };
  redirectProfile = () => {
    const { userInfo } = this.props;
    switch (userInfo.type) {
      case "partner":
        this.props.history.push("/Partner/" + userInfo.id);
        break;
      case "lifeCoach":
        this.props.history.push("/LifeCoach/" + userInfo.id);
        break;
      case "member":
        this.props.history.push("/Member/" + userInfo.id);
        break;
      //MEMBER GOES HERE
    }
  };
  markAsRead = () => {
    const { userInfo } = this.props;
    const url = `notifications/markAsRead/${userInfo.id}`;
    put(url, {}).then(() => {
      this.setState({ notificationCount: 0 });
    });
  };

  setToken = () => {
    const token = localStorage.getItem("jwtToken");
    let { notifications, notificationCount } = this.state;
    if (!token) return;
    const userInfoToken = decode(token);
    this.props.dispatch(UserActions.AC_logIn(userInfoToken));
    const url = `notifications/${userInfoToken.id}`;
    get(url).then(notifications => {
      notifications = notifications.reverse().sort((a, b) => {
        if (!a.read) {
          if (b.read) return -1;
        }
        if (a.read) {
          if (b.read) return 0;
          else {
            return 1;
          }
        }
      });
      this.setState({
        notifications,
        notificationCount: notifications.filter(notif => !notif.read).length
      });
    });
  };
  showSideBar = () => {
    this.setState({ isSidebarVisible: true });
  };
  hideSidebar = () => {
    this.setState({ isSidebarVisible: false });
  };
  redirectSignUp = () => {
    localStorage.setItem("firebasePerm", this.askPerm);
    this.props.history.push("/SignUp");
  };
  openLoginModal = () => {
    this.setState({ openLoginModal: true });
  };
  closeLoginModal = () => {
    this.setState({ openLoginModal: false });
  };
  logOut = () => {
    localStorage.removeItem("jwtToken");
    let { firebaseToken } = this.state;
    if (this.props.firebaseToken) firebaseToken = this.props.firebaseToken;
    const { userInfo } = this.props;
    this.setState({ notifications: [], notificationCount: 0 });
    if (firebaseToken !== null && firebaseToken) {
      const url = `subscribers/delete/${userInfo.id}/${firebaseToken}`;
      del(url, {});
    }
    //delete newState.userInfo;
    //this.setState(newState);
    this.setState({ firebaseToken: "" });
    this.props.dispatch(UserActions.AC_logOut());
  };

  deleteNotifications = () => {
    const { userInfo } = this.props;
    const url = `notifications/deleteAll/${userInfo.id}`;
    del(url, {}).then(() => {
      this.setState({ notifications: [] });
    });
  };
  redirectHome = () => {
    this.props.history.push("/");
  };
  redirectCreateAdmin = () => {
    const { userInfo } = this.props;
    this.props.history.push({
      pathname: "/CreateAdmin",
      state: { userInfo }
    });
  };
  render() {
    const {
      isSidebarVisible,
      openLoginModal,
      notifications,
      notificationCount
    } = this.state;
    const { userInfo } = this.props;
    return (
      <div className="app-wrapper">
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <DesktopMenu
            redirectCreateAdmin={this.redirectCreateAdmin}
            markAsRead={this.markAsRead}
            notificationCount={notificationCount}
            redirectProfile={this.redirectProfile}
            redirectSignUp={this.redirectSignUp}
            login={this.openLoginModal}
            userInfo={userInfo}
            logOut={this.logOut}
            notifications={notifications}
            deleteNotifications={this.deleteNotifications}
          />
          <div className="app-container">{this.props.children}</div>
        </Responsive>
        <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
          <MobileMenu
            markAsRead={this.markAsRead}
            notificationCount={notificationCount}
            redirectProfile={this.redirectProfile}
            showSideBar={this.showSideBar}
            isSidebarVisible={isSidebarVisible}
            login={this.openLoginModal}
            userInfo={userInfo}
            logOut={this.logOut}
            notifications={notifications}
            deleteNotifications={this.deleteNotifications}
            redirectHome={this.redirectHome}
            hideSidebar={this.hideSidebar}
          />
          <div
            onClick={this.hideSidebar}
            className="element app-container"
            //temp height (until there are children)
            style={{ minHeight: "60em" }}
          >
            {this.props.children}
          </div>
        </Responsive>
        <LoginModal
          askPerm={this.askPerm}
          setToken={this.setToken}
          open={openLoginModal}
          close={this.closeLoginModal}
        />
        <Footer
          logOut={this.logOut}
          userInfo={userInfo}
          redirectSignUp={this.redirectSignUp}
          login={this.openLoginModal}
        />
      </div>
    );
  }
}
const mapStateToProps = state => {
  const { userInfo, firebaseToken } = state;
  return { userInfo, firebaseToken };
};

export default withRouter(connect(mapStateToProps)(App));
