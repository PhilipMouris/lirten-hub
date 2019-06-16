import React, { Component } from "react";
import "../../styling/Menus.css";
import { Link } from "react-router-dom";
import { Menu, Header, Icon, Divider } from "semantic-ui-react";
export default class MobileField extends Component {
  render() {
    const { to, icon, name, hideSidebar } = this.props;
    return (
      <div>
        <Link onClick={hideSidebar} className="mainMenu-link" to={to}>
          <Menu.Item>
            <Header textAlign="center" icon inverted>
              <Icon name={icon} />
              {name}
            </Header>
          </Menu.Item>
        </Link>
        <Divider fitted />
      </div>
    );
  }
}
