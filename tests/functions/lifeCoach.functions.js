const axios = require("axios");

const functions = {
  getLifeCoaches: async () => {
    const lifeCoaches = await axios.get(
      "https://lirten-hub-overflow.herokuapp.com/api/users/lifeCoaches"
    );
    return lifeCoaches;
  },
  createLifeCoach: async body => {
    const lifeCoach = await axios({
      method: "post",
      url:
        "https://lirten-hub-overflow.herokuapp.com/api/users/lifeCoaches/create",
      data: body,
      headers: { "Content-Type": "application/json" }
    });
    return lifeCoach;
  },
  updateLifeCoach: async (id, body) => {
    await axios({
      method: "put",
      url:
        "https://lirten-hub-overflow.herokuapp.com/api/users/lifeCoaches/update/" +
        id,
      data: body,
      headers: { "Content-Type": "application/json" }
    });
  }
};
module.exports = functions;
