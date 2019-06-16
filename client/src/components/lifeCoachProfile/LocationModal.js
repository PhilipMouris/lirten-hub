import React, { Component } from "react";
import { Modal, Button, Header, Input } from "semantic-ui-react";
import { put } from "../../services/axios";

class LocationModal extends Component {
  state = {
    location: "",
    loading: false,
    error: ""
  };

  handleLocationChange = event => {
    this.setState({ location: event.target.value });
  };

  handleSubmit = () => {
    const { booked, date, confirmed, _id, member } = this.props.slot;
    const memberId = this.props.slot.member._id;
    const body = {
      booked,
      date,
      confirmed,
      memberId,
      location: this.state.location
    };
    this.setState({ loading: true });
    put("slots/update/" + this.props.id + "/" + _id, body)
      .then(response => {
        this.props.setLocation({ _id, member, ...body });
        this.setState({ loading: false });
        //this.props.toggleLoading();
        //this.props.getLifeCoach();
      })
      .catch(error => {
        console.log(error);
        this.setState({
          error: error.response.data.error,
          loading: false
        });
      });
  };

  render() {
    const { onClose, open } = this.props;
    const { location, loading, error } = this.state;
    return (
      <Modal open={open} onClose={onClose} size="small" className="create-slot">
        <Header content="Set Slot Location" textAlign="center" />
        <Modal.Content>
          <h3>Choose a convenient location for your slot</h3>
          <Input
            placeholder="Location"
            value={location}
            onChange={this.handleLocationChange}
          />
          <Button positive onClick={this.handleSubmit} loading={loading}>
            Submit
          </Button>
          <span>{error}</span>
        </Modal.Content>
      </Modal>
    );
  }
}

export default LocationModal;
