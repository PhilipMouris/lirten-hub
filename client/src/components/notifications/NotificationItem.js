import React, { Component } from "react";
import { Item, Header, Responsive } from "semantic-ui-react";
import "../../styling/Menus.css";
import { withRouter } from "react-router";

class NotificationItem extends Component {
  redirect = () => {
    this.props.history.push(this.props.notification.link);
  };
  render() {
    const { notification, read, img, isDesktop } = this.props;
    const { link, date, title, body } = notification;
    return (
      <Item onClick={this.redirect} id={"no-back"}>
        {isDesktop && (
          <Item.Image avatar src={img || notification.img} size="tiny" />
        )}
        <Item.Content id="item">
          <Header size="tiny">
            {title}
            <Header.Subheader>{date.slice(0, 15)}</Header.Subheader>
          </Header>
          <Item.Description style={{ fontSize: "0.8em" }}>
            {body}
          </Item.Description>
        </Item.Content>
      </Item>
    );
  }
}
export default withRouter(NotificationItem);
