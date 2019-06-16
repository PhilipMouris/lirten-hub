import React, { Component } from "react";
import "../../styling/ProfileContainer.css";
import {
  Grid,
  Segment,
  Icon,
  Header,
  Image,
  Responsive
} from "semantic-ui-react";
export default class StepGrid extends Component {
  render() {
    return (
      <div>
        <Responsive minWidth={768}>
          <Grid.Row>
            <Grid stackable centered columns={7} as={Segment}>
              <Grid.Column width={2} verticalAlign="middle">
                <Header icon>
                  <Icon name="clipboard list" size="huge" color="yellow" />
                  Pick a coach
                </Header>
              </Grid.Column>
              <Grid.Column verticalAlign="middle">
                <Image src="./assets/rightArrowpng.png" fluid />
              </Grid.Column>
              <Grid.Column verticalAlign="middle">
                <Header icon>
                  <Icon name="calendar check" size="huge" color="yellow" />
                  Confirm date and time
                </Header>
              </Grid.Column>

              <Grid.Column verticalAlign="middle">
                <Image src="./assets/rightArrowpng.png" fluid />
              </Grid.Column>

              <Grid.Column verticalAlign="middle">
                <Header icon>
                  <Icon name="payment" size="huge" color="yellow" />
                  Pay
                </Header>
              </Grid.Column>
              <Grid.Column verticalAlign="middle">
                <Image src="./assets/rightArrowpng.png" fluid />
              </Grid.Column>
              <Grid.Column verticalAlign="middle">
                <Header icon>
                  <Icon name="handshake" size="huge" color="yellow" />
                  Meet
                </Header>
              </Grid.Column>
            </Grid>
          </Grid.Row>
        </Responsive>
      </div>
    );
  }
}
