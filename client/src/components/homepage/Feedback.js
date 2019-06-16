import React, { Component } from "react";
import Slider from "react-slick";
import { Icon } from "semantic-ui-react";

export default class Feedback extends Component {
  render() {
    const settings = {
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      prevArrow: (
        <button type="button" className="slick-prev">
          ❮
        </button>
      ),
      nextArrow: (
        <button type="button" className="slick-next">
          ❯
        </button>
      )
    };
    return (
      <div className="homepage-slider">
        <Slider {...settings}>
          <div className="homepage-feedback">
            <div>
              <Icon name="quote left" size="large" />
              <p>
                Joining Lirten Hub was the best decision I made in my
                professional career.
              </p>
              <Icon name="quote right" size="large" />
            </div>
            <div>
              <img
                src="https://api.adorable.io/avatars/285/hii@adorable.io.png"
                alt=""
              />
              <div>
                <p>Youssef Sherif</p>
                <p>Full Stack Developer</p>
              </div>
            </div>
          </div>
          <div className="homepage-feedback">
            <div>
              <Icon name="quote left" size="large" />
              <p>
                Hiring top talent has become much more easier since we joined
                Lirten Hub
              </p>
              <Icon name="quote right" size="large" />
            </div>
            <div>
              <img
                src="https://api.adorable.io/avatars/285/hiagain@adorable.io.png"
                alt=""
              />
              <div>
                <p>Webops</p>
                <p>Software House</p>
              </div>
            </div>
          </div>
        </Slider>
      </div>
    );
  }
}
