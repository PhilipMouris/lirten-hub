import React, { Component } from "react";
import "../../styling/ProfileContainer.css";
import { Header, Icon, Checkbox, Divider } from "semantic-ui-react";

export default class SideOption extends Component {
  state = {
    visible: false,
    currentlyChecked: []
  };
  handleSwitch = () => {
    this.setState({ visible: !this.state.visible });
  };
  handleChange = (e, { value, checked }) => {
    let { currentlyChecked } = this.state;
    const { title } = this.props;
    if (checked) currentlyChecked.push(value);
    else currentlyChecked = currentlyChecked.filter(val => val !== value);
    this.props[title](currentlyChecked);
    this.setState({ currentlyChecked });
  };
  render() {
    const { title, filterValues } = this.props;
    const { visible } = this.state;
    return (
      <div>
        <Header color="grey" size="small">
          {title}
          <Icon
            onClick={this.handleSwitch}
            id="option-icon"
            name={visible ? "minus" : "plus"}
          />
        </Header>
        {filterValues.map(value => {
          return (
            <div
              key={value}
              style={{ maxHeight: visible ? "1.5em" : "0em" }}
              className="options-div"
            >
              <Checkbox
                onChange={this.handleChange}
                value={value}
                label={value}
              />
              <Divider hidden fitted />
            </div>
          );
        })}
        <Divider hidden />
      </div>
    );
  }
}
