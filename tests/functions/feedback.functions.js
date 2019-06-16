const axios = require("axios");

const functions = {
  getPartnerFeedbacks: async partnerId => {
    const feedbacks = await axios.get(
      "https://lirten-hub-overflow.herokuapp.com/api/feedback/readPartnerFeedbacks/" +
        partnerId
    );
    return feedbacks;
  },
  getFeedback: async id => {
    const feedback = await axios.get(
      "https://lirten-hub-overflow.herokuapp.com/api/feedback/readFeedback/" +
        id
    );
    return feedback;
  },
  deleteFeedback: async (feedbackId, partnerId) => {
    await axios.delete(
      "https://lirten-hub-overflow.herokuapp.com/api/feedback/delete/" +
        partnerId +
        "/" +
        feedbackId
    );
  },
  createFeedback: async body => {
    const feedback = await axios({
      method: "post",
      url: "https://lirten-hub-overflow.herokuapp.com/api/feedback/create",
      data: body,
      headers: { "Content-Type": "application/json" }
    });
    return feedback;
  },
  updateFeedback: async (feedbackId, partnerId, body) => {
    await axios({
      method: "put",
      url:
        "https://lirten-hub-overflow.herokuapp.com/api/feedback/update/" +
        partnerId +
        "/" +
        feedbackId,
      data: body,
      headers: { "Content-Type": "application/json" }
    });
  }
};
module.exports = functions;
