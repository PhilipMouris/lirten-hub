import React, { Component } from "react";
import { Menu, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import "../../styling/Menus.css";
export default class DesktopField extends Component {
  render() {
    const { to, icon, text } = this.props;
    return (
      <Menu.Item>
        <Link className="mainMenu-link" to={to}>
          <div className="tooltip">
            <Icon size="big" name={icon} />
            <span className="tooltiptext">{text}</span>
          </div>
        </Link>
      </Menu.Item>
    );
  }
}
