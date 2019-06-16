const axios = require("axios");
const slotsUrl = "https://lirten-hub-overflow.herokuapp.com/api/slots/";
const functions = {
  getLifeCoachSlots: async lifeCoachId => {
    const slots = await axios.get(slotsUrl + "lifeCoachSlots/" + lifeCoachId);
    return slots;
  },
  getSlot: async slotId => {
    const slot = await axios.get(slotsUrl + "readSlot/" + slotId);
    return slot;
  },
  createSlot: async body => {
    const slot = await axios({
      method: "post",
      url: slotsUrl + "create",
      data: body,
      headers: { "Content-Type": "application/json" }
    });
    return slot;
  },
  updateSlot: async (lifeCoachId, slotId, body) => {
    await axios({
      method: "put",
      url: slotsUrl + "update/" + lifeCoachId + "/" + slotId,
      data: body,
      headers: { "Content-Type": "application/json" }
    });
  },
  deleteSlot: async (lifeCoachId, slotId) => {
    await axios.delete(slotsUrl + "delete/" + lifeCoachId + "/" + slotId);
  }
};
module.exports = functions;
