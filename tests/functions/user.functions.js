const axios = require("axios");

const functions = {
  getUsers: async () => {
    const users = await axios.get(
      "https://lirten-hub-overflow.herokuapp.com/api/users/"
    );
    return users;
  },
  getUser: async id => {
    const user = await axios.get(
      "https://lirten-hub-overflow.herokuapp.com/api/users/" + id
    );
    return user;
  },
  deleteUser: async id => {
    await axios.delete(
      "https://lirten-hub-overflow.herokuapp.com/api/users/delete/" + id
    );
  },
  updatePassword: async (id, oldPassword, newPassword) => {
    await axios.put(
      "https://lirten-hub-overflow.herokuapp.com/api/users/updatePassword/" +
        id,
      {
        oldPassword,
        newPassword
      }
    );
  }
};
module.exports = functions;
