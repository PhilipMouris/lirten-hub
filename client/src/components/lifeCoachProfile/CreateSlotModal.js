import React, { Component } from "react";
import { Modal, Button, Header } from "semantic-ui-react";
import Datetime from "react-datetime";
import "../../styling/DatetimePicker.css";
import { post } from "../../services/axios";

class CreateSlotModal extends Component {
  state = {
    date: "",
    loading: false,
    error: ""
  };
  handleDateCheck = currentDate => {
    return currentDate > Date.now();
  };
  handleDateChange = date => {
    this.setState({ date: date });
  };
  handleSubmit = () => {
    const body = {
      date: this.state.date.add(2, "hour"),
      booked: false,
      confirmed: false,
      lifeCoachId: this.props.id
    };
    this.setState({ loading: true });
    post("slots/create", body)
      .then(response => {
        this.props.addSlot(response.data.data);
        this.setState({ loading: false });
        //this.props.toggleLoading();
        //this.props.getLifeCoach();
      })
      .catch(error => {
        this.setState({
          error: error.response.data.error,
          loading: false
        });
      });
  };
  render() {
    const { onClose, open } = this.props;
    const { date, loading, error } = this.state;
    return (
      <Modal open={open} onClose={onClose} size="small" className="create-slot">
        <Header content="Create a Slot" textAlign="center" />
        <Modal.Content>
          <h3>Choose a convenient time for your slot</h3>
          <Datetime
            isValidDate={this.handleDateCheck}
            value={date}
            onChange={this.handleDateChange}
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

export default CreateSlotModal;
