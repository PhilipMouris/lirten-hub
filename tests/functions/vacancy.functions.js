const axios = require("axios");

const functions = {
  getVacancies: async () => {
    const vacancies = await axios.get(
      "https://lirten-hub-overflow.herokuapp.com/api/vacancies"
    );
    return vacancies;
  },
  getPartnerVacancies: async partnerId => {
    const vacancies = await axios.get(
      "https://lirten-hub-overflow.herokuapp.com/api/vacancies/partnerVacancies/" +
        partnerId
    );
    return vacancies;
  },
  getVacancy: async id => {
    const vacancy = await axios.get(
      "https://lirten-hub-overflow.herokuapp.com/api/vacancies/" + id
    );
    return vacancy;
  },
  deleteVacancy: async id => {
    await axios.delete(
      "https://lirten-hub-overflow.herokuapp.com/api/vacancies/delete/" + id
    );
  },
  createVacancy: async body => {
    const vacancy = await axios({
      method: "post",
      url: "https://lirten-hub-overflow.herokuapp.com/api/vacancies/create",
      data: body,
      headers: { "Content-Type": "application/json" }
    });
    return vacancy;
  },
  updateVacancy: async (id, body) => {
    await axios({
      method: "put",
      url:
        "https://lirten-hub-overflow.herokuapp.com/api/vacancies/update/" + id,
      data: body,
      headers: { "Content-Type": "application/json" }
    });
  }
};
module.exports = functions;
