import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Icon } from "semantic-ui-react";
import "../../styling/Footer.css";

class Footer extends Component {
  render() {
    const { userInfo, redirectSignUp, logOut, login } = this.props;
    return (
      <div className="footer">
        <h1>Logo Here</h1>
        <div className="footer-links">
          <Link to="/Members">Members</Link>
          <Link to="/Partners">Partners</Link>
          <Link to="/LifeCoaches">Life Coaches</Link>
          <Link to="/Vacancies">Vacancies</Link>
        </div>
        <div className="footer-icons">
          <h2>Follow Us</h2>
          <div>
            <Icon name="linkedin" inverted size="big" />
            <Icon name="facebook f" inverted size="big" />
            <Icon name="twitter" inverted size="big" />
          </div>
        </div>
        <div>
          <h2>Contact Us</h2>
          <p>Main Office: Tagamoaa</p>
          <p>Tel: 0123445566</p>
          <p>email: lirtenhub@gmail.com</p>
        </div>
        <div className="footer-signup">
          {userInfo ? (
            <Button onClick={logOut} inverted>
              Log out
            </Button>
          ) : (
            [
              <Button
                key="footerLogin"
                onClick={login}
                className="login-button"
                inverted
              >
                Log In
              </Button>,
              <Button key="footerSignUp" onClick={redirectSignUp} inverted>
                Sign Up
              </Button>
            ]
          )}
        </div>
        <div className="footer-copyright">© 2019 Copyright: Overflow</div>
      </div>
    );
  }
}

export default Footer;
