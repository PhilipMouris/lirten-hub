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
  Divider,
  Loader
} from "semantic-ui-react";
import "../../styling/Login.css";
import * as Axios from "../../services/axios.js";
import decode from "jwt-decode";

export default class LoginModal extends Component {
  state = {
    email: "",
    password: "",
    hidden: true,
    loading: false,
    recovery: "",
    confirmPassword: "",
    loadingForgot: false
  };
  changePassword = e => {
    this.setState({ password: e.target.value, hidden: true });
  };
  changeMail = e => {
    this.setState({ email: e.target.value, hidden: true });
  };
  changeRecovery = e => {
    this.setState({ recovery: e.target.value, hidden: true });
  };
  changeConfirm = e => {
    this.setState({ confirmPassword: e.target.value });
  };

  resetModal = () => {
    this.setState({
      email: "",
      password: "",
      hidden: true,
      error: "",
      loading: false,
      loadingForgot: false
    });
    this.props.close();
  };
  login = async () => {
    if (this.state.sent) {
      this.sendRecovery();
      return;
    }
    this.setState({ loading: true });
    const { email, password, confirmPassword, recoverCorrect } = this.state;
    if (recoverCorrect) {
      if (confirmPassword !== password) {
        this.setState({
          loading: false,
          hidden: false,
          error: "Passwords do not match"
        });
        return;
      } else {
        const url = `users/forgotPassword`;
        await Axios.post(url, { password, email });
      }
    }
    const body = { email, password };
    Axios.post("users/login", body)
      .then(data => {
        this.props.askPerm(decode(data.data.data).id);
        localStorage.setItem("jwtToken", data.data.data);
        const userInfo = decode(data.data.data);
        this.props.setToken();
        this.setState({
          recoverCorrect: false,
          recovery: "",
          confirmPassword: ""
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
  recover = () => {
    const { email, sent, loadingForgot } = this.state;
    if (loadingForgot) return;
    if (email.length === 0) {
      this.setState({
        hidden: false,
        error: "Please enter an email",
        recoverError: false
      });
      return;
    }
    this.setState({ loadingForgot: true });
    const message = sent
      ? "A new email has been sent"
      : "An email has been sent";
    const url = `users/sendEmail`;
    const data = { email };
    Axios.post(url, data)
      .then(() => {
        this.setState({
          sent: true,
          error: message,
          recoverError: false,
          loadingForgot: false
        });
      })
      .catch(err => {
        this.setState({
          error: "Email not found",
          hidden: false,
          loadingForgot: false
        });
      });
  };
  sendRecovery = () => {
    const { recovery, email } = this.state;
    this.setState({ loading: true });
    const url = `users/Recovery`;
    const data = { recovery, email };
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
      email,
      password,
      hidden,
      error,
      loading,
      sent,
      recovery,
      recoverError,
      recoverCorrect,
      confirmPassword,
      loadingForgot
    } = this.state;
    return (
      <Modal basic onClose={this.resetModal} open={open}>
        <Grid columns={2} centered>
          <Grid.Column computer={6} mobile={11}>
            <Grid.Row id="header-cont">
              <Header inverted id="header">
                Lirten Hub Login
              </Header>
            </Grid.Row>
            <Form id="login-form" error onSubmit={this.login}>
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
                      ? "Please check your spam folder"
                      : "Please try again"}
                  </Message.Content>
                </Message>
              )}

              {sent ? (
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
                    key="password"
                    className="login-field first-field"
                    required
                  >
                    <label>New Password</label>
                    <Input
                      icon="lock"
                      iconPosition="left"
                      type="password"
                      name="email"
                      value={password}
                      onChange={this.changePassword}
                    />
                  </Form.Field>,
                  <Form.Field key="Confirm" className="login-field" required>
                    <label>Confirm Password</label>
                    <Input
                      icon="lock"
                      iconPosition="left"
                      type="password"
                      name="email"
                      value={confirmPassword}
                      onChange={this.changeConfirm}
                    />
                  </Form.Field>
                ]
              ) : (
                [
                  <Form.Field
                    key="email"
                    className="login-field first-field"
                    required
                  >
                    <label>Email</label>
                    <Input
                      type="email"
                      iconPosition="left"
                      icon="mail"
                      name="Email"
                      value={email}
                      onChange={this.changeMail}
                      placeholder="ex@gmail.com"
                    />
                  </Form.Field>,
                  <Form.Field key="password" className="login-field" required>
                    <label>Password</label>
                    <Input
                      icon="lock"
                      iconPosition="left"
                      type="password"
                      name="email"
                      value={password}
                      onChange={this.changePassword}
                    />
                  </Form.Field>
                ]
              )}
              <Form.Field>
                <span onClick={this.recover} id="forgot">
                  {sent ? "Resend Email" : "Forgot password?"}
                  {loadingForgot && <Loader id="workaround" />}
                </span>
              </Form.Field>
              <Button fluid loading={loading} type="submit" color="yellow">
                {sent ? "Recover" : "Log In"}
              </Button>
            </Form>
          </Grid.Column>
        </Grid>
      </Modal>
    );
  }
}
