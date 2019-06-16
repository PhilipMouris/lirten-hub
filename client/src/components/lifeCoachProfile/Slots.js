import React, { Component } from "react";
import { Card, Icon, Header, Button } from "semantic-ui-react";
import decode from "jwt-decode";
import CreateSlotModal from "./CreateSlotModal";
import LocationModal from "./LocationModal";
import { put, del, post } from "../../services/axios";

class Slots extends Component {
  state = {
    createModal: false,
    locationModal: false,
    setLocationSlot: {}
  };
  showAddButton = () => {
    return this.props.myProfile;
  };

  showBookButton = () => {
    return this.props.memberType;
  };

  handleOpenCreateModal = () => {
    this.setState({ createModal: true });
  };

  handleCloseCreateModal = () => {
    this.setState({ createModal: false });
  };

  handleOpenLocationModal = slot => {
    this.setState({
      locationModal: true,
      setLocationSlot: slot
    });
  };

  handleCloseLocationModal = () => {
    this.setState({ locationModal: false });
  };

  handleBook = (date, lifeCoachId, slotId) => {
    const body = {
      date,
      booked: true,
      confirmed: false,
      memberId: decode(localStorage.getItem("jwtToken")).id
    };
    //this.props.toggleLoading();
    const member = decode(localStorage.getItem("jwtToken"));
    this.setState({ bookedLoading: true, bookedId: slotId });
    put("slots/update/" + lifeCoachId + "/" + slotId, body)
      .then(response => {
        //this.props.getLifeCoach();
        this.props.setBooked({
          member: { _id: member.id, name: member.name },
          _id: slotId,
          ...body
        });
        this.setState({ bookedLoading: false, bookedId: "" });
        const notifUrl = `subscribers/send`;
        const req = {
          userIds: [lifeCoachId],
          data: {
            title: "Slot Booking!",
            body: `${member.name} has booked a slot on ${date.slice(0, 10)}`,
            link: `/LifeCoach/${lifeCoachId}`,
            actionTitle: "Visit",
            img: member.image
          }
        };
        post(notifUrl, req).then(resp => console.log(resp));
      })
      .catch(error => {
        console.log(error);
        this.props.toggleError();
        this.props.toggleLoading();
      });
  };

  handleConfirm = (slot, lifeCoachId) => {
    const { booked, date, location, member, _id } = slot;
    this.setState({ confirmLoading: true, confirmId: _id });
    const body = {
      date,
      booked,
      location,
      memberId: member._id,
      confirmed: true
    };
    //this.props.toggleLoading();
    put("slots/update/" + lifeCoachId + "/" + _id, body)
      .then(response => {
        //this.props.getLifeCoach();
        this.props.confirm(_id);
        this.setState({ confirmLoading: false, confirmId: "" });
        const notifUrl = `subscribers/send`;
        const req = {
          userIds: [member._id],
          data: {
            title: "Slot Confirmation!",
            body: `The slot on ${date.slice(0, 10)} has been confirmed`,
            link: `/LifeCoach/${lifeCoachId}`,
            actionTitle: "Visit",
            img:
              "https://cdn.pixabay.com/photo/2016/03/31/14/37/check-mark-1292787__340.png"
          }
        };
        post(notifUrl, req).then(resp => console.log(resp));
      })
      .catch(error => {
        this.props.toggleError();
        this.props.toggleLoading();
      });
  };

  handleDelete = (slotId, lifeCoachId) => {
    //this.props.toggleLoading();
    this.setState({ deleteLoading: true, deletedId: slotId });
    del("slots/delete/" + lifeCoachId + "/" + slotId)
      .then(response => {
        //this.props.getLifeCoach();
        this.props.deleteSlot(slotId);
        this.setState({ deleteLoading: false, deletedId: "" });
      })
      .catch(error => {
        console.log(error);
        this.props.toggleError();
        this.props.toggleLoading();
      });
  };
  addSlot = slot => {
    this.setState({ createModal: false });
    this.props.addSlot(slot);
  };
  setLocation = slot => {
    this.setState({ locationModal: false });
    this.props.setSlotLocation(slot);
  };
  render() {
    const slots = this.props.lifeCoach.userData.monthlySlots;
    const {
      createModal,
      locationModal,
      setLocationSlot,
      deleteLoading,
      deletedId,
      confirmLoading,
      confirmId,
      bookedId,
      bookedLoading
    } = this.state;
    return (
      <div className="slots-container">
        {createModal && (
          <CreateSlotModal
            onClose={this.handleCloseCreateModal}
            open={createModal}
            id={this.props.id}
            addSlot={this.addSlot}
            toggleLoading={this.props.toggleLoading}
            toggleError={this.props.toggleError}
            getLifeCoach={this.props.getLifeCoach}
          />
        )}
        {locationModal && (
          <LocationModal
            setLocation={this.setLocation}
            onClose={this.handleCloseLocationModal}
            open={locationModal}
            id={this.props.id}
            toggleLoading={this.props.toggleLoading}
            toggleError={this.props.toggleError}
            getLifeCoach={this.props.getLifeCoach}
            slot={setLocationSlot}
          />
        )}
        <div className="slots-header-container">
          <Header as="h1">Upcoming Slots</Header>
          {this.showAddButton() && (
            <Button
              onClick={this.handleOpenCreateModal}
              icon="add"
              circular
              positive
            />
          )}
        </div>
        <Card.Group
          className={`slots-cards-container ${!this.showBookButton() &&
            !this.showAddButton() &&
            "no-buttons-cards"}`}
        >
          {slots
            .filter(slot => new Date(slot.date) > Date.now())
            .sort((firstSlot, secondSlot) => {
              if (new Date(firstSlot.date) < new Date(secondSlot.date))
                return -1;
              else return 1;
            })
            .map(slot => (
              <Card>
                <Card.Content>
                  <Card.Header>{slot.date.substring(0, 10)}</Card.Header>
                  <Card.Meta>
                    <span>{slot.date.substring(11, 16)}</span>
                    {slot.location && <span>{`/  ${slot.location}`}</span>}
                  </Card.Meta>
                  <Card.Description>
                    <span>
                      Booked{" "}
                      {slot.booked ? (
                        <Icon name="check" color="green" />
                      ) : (
                        <Icon name="close" color="red" />
                      )}
                    </span>
                    <span>
                      Confirmed{" "}
                      {slot.confirmed ? (
                        <Icon name="check" color="green" />
                      ) : (
                        <Icon name="close" color="red" />
                      )}
                    </span>
                  </Card.Description>
                  {slot.member && (
                    <Card.Description>{`Booked by: ${
                      slot.member.name
                    }`}</Card.Description>
                  )}
                </Card.Content>
                {this.showBookButton() && (
                  <Card.Content extra>
                    <Button
                      positive
                      loading={bookedLoading && bookedId === slot._id}
                      disabled={slot.booked}
                      onClick={() =>
                        this.handleBook(slot.date, this.props.id, slot._id)
                      }
                    >
                      Book
                    </Button>
                  </Card.Content>
                )}
                {this.showAddButton() && (
                  <Card.Content extra>
                    <Button
                      disabled={slot.location || !slot.booked}
                      primary
                      onClick={() => this.handleOpenLocationModal(slot)}
                    >
                      Set Location
                    </Button>
                    <Button
                      disabled={
                        slot.confirmed || !slot.booked || !slot.location
                      }
                      loading={confirmLoading && slot._id === confirmId}
                      color="green"
                      onClick={() => this.handleConfirm(slot, this.props.id)}
                    >
                      Confirm
                    </Button>
                    <Button
                      loading={deleteLoading && slot._id === deletedId}
                      color="red"
                      onClick={() => {
                        this.handleDelete(slot._id, this.props.id);
                      }}
                    >
                      Delete
                    </Button>
                  </Card.Content>
                )}
              </Card>
            ))}
        </Card.Group>
      </div>
    );
  }
}

export default Slots;
