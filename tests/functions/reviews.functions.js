const axios = require("axios");

const functions = {
  createReview: async body => {
    const review = await axios({
      method: "post",
      url: "https://lirten-hub-overflow.herokuapp.com/api/reviews/create",
      data: body,
      headers: { "Content-Type": "application/json" }
    });
    return review;
  },
  readMemberReviews: async memberId => {
    const reviews = await axios.get(
      "https://lirten-hub-overflow.herokuapp.com/api/reviews/readMemberReviews/" +
        memberId
    );
    return reviews;
  },
  readReview: async reviewId => {
    const review = await axios.get(
      "https://lirten-hub-overflow.herokuapp.com/api/reviews/readReview/" +
        reviewId
    );
    return review;
  },
  updateReview: async (memberId, reviewId, body) => {
    await axios({
      method: "put",
      url:
        "https://lirten-hub-overflow.herokuapp.com/api/reviews/update/" +
        memberId +
        "/" +
        reviewId +
        "/",
      data: body,
      headers: { "Content-Type": "application/json" }
    });
  },
  deleteReview: async (memberId, reviewId) => {
    const review = await axios.delete(
      "https://lirten-hub-overflow.herokuapp.com/api/reviews/delete/" +
        memberId +
        "/" +
        reviewId +
        "/"
    );
  }
};
module.exports = functions;
