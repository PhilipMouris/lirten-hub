const axios = require("axios");

const functions = {
  getMembers: async () => {
    const members = await axios.get(
      "https://lirten-hub-overflow.herokuapp.com/api/users/members"
    );
    return members;
  },
  createMember: async body => {
    const member = await axios({
      method: "post",
      url: "https://lirten-hub-overflow.herokuapp.com/api/users/members/create",
      data: body,
      headers: { "Content-Type": "application/json" }
    });
    return member;
  },
  updateMember: async (id, body) => {
    await axios({
      method: "put",
      url:
        "https://lirten-hub-overflow.herokuapp.com/api/users/members/update/" +
        id,
      data: body,
      headers: { "Content-Type": "application/json" }
    });
  }
};
module.exports = functions;
