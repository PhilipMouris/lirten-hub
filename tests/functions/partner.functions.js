const axios = require("axios");

const functions = {
  getPartners: async () => {
    const partners = await axios.get(
      "https://lirten-hub-overflow.herokuapp.com/api/users/partners"
    );
    return partners;
  },
  createPartner: async body => {
    const partner = await axios({
      method: "post",
      url:
        "https://lirten-hub-overflow.herokuapp.com/api/users/partners/create",
      data: body,
      headers: { "Content-Type": "application/json" }
    });
    return partner;
  },
  updatePartner: async (id, body) => {
    await axios({
      method: "put",
      url:
        "https://lirten-hub-overflow.herokuapp.com/api/users/partners/update/" +
        id,
      data: body,
      headers: { "Content-Type": "application/json" }
    });
  }
};
module.exports = functions;
