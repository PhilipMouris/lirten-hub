import React, { Component } from "react";
import {
  Form,
  Modal,
  Message,
  Grid,
  Header,
  Icon,
  Input,
  Button,
  Divider
} from "semantic-ui-react";
import "../../styling/Login.css";
import * as Axios from "../../services/axios.js";
import decode from "jwt-decode";

export default class UpdatePassModal extends Component {
  state = {
    oldPassword: "",
    newPassword: "",
    hidden: true,
    loading: false,
    recovery: "",
    confirmPassword: ""
  };
  changePassword = e => {
    this.setState({ newPassword: e.target.value, hidden: true });
  };
  changeMail = e => {
    this.setState({ oldPassword: e.target.value, hidden: true });
  };
  changeRecovery = e => {
    this.setState({ recovery: e.target.value, hidden: true });
  };
  changeConfirm = e => {
    this.setState({ confirmPassword: e.target.value });
  };

  resetModal = () => {
    this.setState({
      oldPassword: "",
      newPassword: "",
      hidden: true,
      error: "",
      loading: false
    });
    this.props.closeUpdateModal();
  };
  login = async () => {
    if (this.state.sent) {
      this.sendRecovery();
      return;
    }
    const { loading } = this.state;
    if (loading) return;
    this.setState({ loading: true });
    const {
      oldPassword,
      newPassword,
      confirmPassword,
      recoverCorrect
    } = this.state;
    if (recoverCorrect) {
      if (confirmPassword !== newPassword) {
        this.setState({
          loading: false,
          hidden: false,
          error: "Passwords do not match"
        });
        return;
      } else {
        const url = `users/forgotPassword`;
        await Axios.post(url, { newPassword, oldPassword });
      }
    }
    const body = { oldPassword, newPassword };
    Axios.post("users/login", body)
      .then(data => {
        this.props.askPerm(decode(data.data.data).id);
        localStorage.setItem("jwtToken", data.data.data);
        const userInfo = decode(data.data.data);
        this.props.setToken();
        this.setState({
          recoverCorrect: false,
          recovery: "",
          confirmPassword: "",
          loading: false
        });
        this.resetModal();
      })
      .catch(error => {
        this.setState({
          error: error.response.data.error,
          hidden: false,
          loading: false
        });
      });
  };
  updatePassword = () => {
    let { newPassword, oldPassword, loading } = this.state;
    if (loading) return;
    this.setState({ loading: true });
    const url = `users/updatePassword/${this.props.id}`;
    let body = {
      newPassword,
      oldPassword
    };
    Axios.put(url, body)
      .then(response => {
        console.log(response);
        this.setState({ open: false, loading: false });
        this.props.closeUpdateModal();
      })
      .catch(error => {
        this.setState({
          error: error.response.data.error,
          hidden: false,
          loading: false
        });
      });
  };
  recover = () => {
    const { oldPassword, sent } = this.state;
    if (oldPassword.length === 0) {
      this.setState({
        hidden: false,
        error: "Please enter a newPassword",
        recoverError: false
      });
      return;
    }
    const message = sent
      ? "A new  oldPassword has been sent"
      : "An oldPassword has been sent";
    this.setState({ sent: true, error: message, recoverError: false });
    const url = `users/sendEmail`;
    const data = { oldPassword };
    Axios.post(url, data);
  };
  sendRecovery = () => {
    const { recovery, oldPassword } = this.state;
    this.setState({ loading: true });
    const url = `users/Recovery`;
    const data = { recovery, oldPassword };
    Axios.post(url, data)
      .then(resp => {
        if (resp.data.data > 0)
          this.setState({
            recoverCorrect: true,
            loading: false,
            recoverError: false,
            sent: false,
            hidden: true
          });
        else
          this.setState({
            hidden: false,
            error: "Incorrect Code",
            loading: false,
            recoverError: true
          });
      })
      .catch(error => {
        this.setState({
          loading: false,
          hidden: false,
          error: "Something went wrong!"
        });
      });
  };
  render() {
    const { open } = this.props;
    const {
      oldPassword,
      newPassword,
      hidden,
      error,
      loading,
      sent,
      recovery,
      recoverError,
      recoverCorrect,
      confirmPassword
    } = this.state;
    return (
      <Modal basic onClose={this.resetModal} open={open}>
        <Grid columns={2} centered>
          <Grid.Column computer={6} mobile={11}>
            <Grid.Row id="header-cont">
              <Header inverted id="header">
                Update Password
              </Header>
            </Grid.Row>
            <Form id="login-form" error onSubmit={this.updatePassword}>
              {hidden && !sent ? null : (
                <Message
                  error={!sent || recoverError}
                  positive={sent && !recoverError}
                  icon
                  size="small"
                >
                  <Icon
                    name={sent && !recoverError ? "send" : "times circle"}
                  />
                  <Message.Content>
                    <Message.Header>{error}</Message.Header>
                    {sent && !recoverError
                      ? "Please Re-check Your input"
                      : null}
                  </Message.Content>
                </Message>
              )}
              {/* {sent ? (
                <Form.Field
                  key="recovery"
                  className="login-field first-field"
                  required
                >
                  <label>Recovery code</label>
                  <Input
                    type=""
                    iconPosition="left"
                    icon="key"
                    name="recovery"
                    value={recovery}
                    onChange={this.changeRecovery}
                    placeholder="Recovery code"
                  />
                </Form.Field>
              ) : recoverCorrect ? (
                [
                  <Form.Field
                    key="newPassword"
                    className="login-field first-field"
                    required
                  >
                    <label>New Password</label>
                    <Input
                      icon="lock"
                      iconPosition="left"
                      type="newPassword"
                      name="oldPassword"
                      value={newPassword}
                      onChange={this.changePassword}
                    />
                  </Form.Field>,
                  <Form.Field key="Confirm" className="login-field" required>
                    <label>Confirm Password</label>
                    <Input
                      icon="lock"
                      iconPosition="left"
                      type="newPassword"
                      name="oldPassword"
                      value={confirmPassword}
                      onChange={this.changeConfirm}
                    />
                  </Form.Field>
                ]
              ) : ( */}
              <Form.Field
                key="oldPassword"
                className="login-field first-field"
                required
              >
                <label>Old Password</label>
                <Input
                  type="password"
                  iconPosition="left"
                  icon="lock"
                  name="password"
                  value={oldPassword}
                  onChange={this.changeMail}
                />
              </Form.Field>

              <Form.Field key="newPassword" className="login-field" required>
                <label>New Password</label>
                <Input
                  icon="lock"
                  iconPosition="left"
                  type="password"
                  name="password"
                  value={newPassword}
                  onChange={this.changePassword}
                />
              </Form.Field>
              {/* <Form.Field>
                <span onClick={this.recover} id="forgot">
                  {sent ? "Resend   oldPassword" : "Forgot newPassword?"}
                </span>
              </Form.Field> */}
              <Button fluid loading={loading} type="submit" color="green">
                {sent ? "Recover" : "Update Password"}
              </Button>
              <Divider />
              <Button fluid onClick={this.resetModal} color="red">
                {sent ? "Recover" : "Cancel"}
              </Button>
            </Form>
          </Grid.Column>
        </Grid>
      </Modal>
    );
  }
}
