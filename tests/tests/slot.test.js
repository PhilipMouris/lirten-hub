const functions = require("../functions/slot.functions");
const lifeCoachFunctions = require("../functions/lifeCoach.functions");
const memberFunctions = require("../functions/member.functions");
const {
  getLifeCoachSlots,
  getSlot,
  createSlot,
  updateSlot,
  deleteSlot
} = functions;
const { getLifeCoaches } = lifeCoachFunctions;
const { getMembers } = memberFunctions;

test(
  "Get lifeCoach slots",
  async () => {
    expect.assertions(1);
    const lifeCoaches = await getLifeCoaches();
    if (lifeCoaches.data.data.length > 0) {
      const lifeCoachSlots = await getLifeCoachSlots(
        lifeCoaches.data.data[0]._id
      );
      expect(lifeCoaches.data.data[0].userData.monthlySlots).toEqual(
        lifeCoachSlots.data.data
      );
    } else expect(lifeCoaches.data.data).toEqual([]);
  },
  50000
);

test(
  "Get slots of a non existent partner",
  async () => {
    expect.assertions(1);
    const slots = await getLifeCoachSlots("1234").catch(error => {
      expect(error.response.status).toEqual(400);
    });
  },
  50000
);

test(
  "Get a single slot",
  async () => {
    const lifeCoachRequest = await getLifeCoaches();
    const { data } = lifeCoachRequest.data;
    const lifeCoach = data.find(
      lifeCoach => lifeCoach.userData.monthlySlots.length > 0
    );
    if (lifeCoach) {
      expect.assertions(1);
      const firstSlot = lifeCoach.userData.monthlySlots[0];
      const slot = await getSlot(firstSlot._id);
      expect(firstSlot).toEqual(slot.data.data);
    }
  },
  50000
);

test(
  "Get a non existent slot",
  async () => {
    expect.assertions(1);
    const slots = await getSlot("1234").catch(error => {
      expect(error.response.status).toEqual(400);
    });
  },
  50000
);

test(
  "Create a new slot with no member",
  async () => {
    const lifeCoaches = await getLifeCoaches();
    const { data } = lifeCoaches.data;
    if (data.length > 0) {
      expect.assertions(1);
      const req = {
        lifeCoachId: data[0]._id,
        booked: "false",
        date: "3/4/2019",
        confirmed: "false"
      };
      const slot = await createSlot(req);
      const lifeCoachSlots = await getLifeCoachSlots(data[0]._id);
      expect(lifeCoachSlots.data.data).toEqual(
        expect.arrayContaining([expect.objectContaining(slot.data.data)])
      );
    }
  },
  50000
);

test(
  "Create a new slot with a member",
  async () => {
    const lifeCoaches = await getLifeCoaches();
    const members = await getMembers();
    if (members.data.data.length > 0 && lifeCoaches.data.data.length > 0) {
      expect.assertions(1);
      const member = members.data.data[0];
      const lifeCoach = lifeCoaches.data.data[0];
      const req = {
        lifeCoachId: lifeCoach._id,
        memberId: member._id,
        booked: "false",
        date: "3/4/2019",
        confirmed: "true"
      };
      const slot = await createSlot(req);
      const lifeCoachSlots = await getLifeCoachSlots(lifeCoach._id);
      expect(lifeCoachSlots.data.data).toEqual(
        expect.arrayContaining([expect.objectContaining(slot.data.data)])
      );
    }
  },
  50000
);
test(
  "Creating a slot with a non existent member",
  async () => {
    const lifeCoaches = await getLifeCoaches();
    if (lifeCoaches.data.data.length > 0) {
      expect.assertions(1);
      const lifeCoach = lifeCoaches.data.data[0];
      const req = {
        lifeCoachId: lifeCoach._id,
        memberId: "1234",
        booked: "false",
        date: "3/4/2019",
        confirmed: "true"
      };
      const slot = await createSlot(req).catch(error => {
        expect(error.response.status).toEqual(400);
      });
    }
  },
  50000
);

test(
  "Create a slot with incomplete or incorrect data",
  async () => {
    expect.assertions(1);
    const slot = await createSlot({
      lifeCoachId: "1234",
      invalidData: true
    }).catch(error => {
      expect(error.response.status).toEqual(400);
    });
  },
  50000
);

test(
  "Update a slot",
  async () => {
    const lifeCoachRequest = await getLifeCoaches();
    const { data } = lifeCoachRequest.data;
    const lifeCoach = data.find(
      lifeCoach => lifeCoach.userData.monthlySlots.length > 0
    );
    if (lifeCoach) {
      expect.assertions(1);
      const req = {
        booked: true,
        confirmed: false,
        date: "3/4/2025"
      };
      const updatedSlot = await updateSlot(
        lifeCoach._id,
        lifeCoach.userData.monthlySlots[0]._id,
        req
      );
      const slotCheck = await getSlot(lifeCoach.userData.monthlySlots[0]._id);
      expect(slotCheck.data.data.confirmed).toEqual(false);
    }
  },
  50000
);

test(
  "Update a slot with incomplete or incorrect data",
  async () => {
    expect.assertions(1);
    const lifeCoachRequest = await getLifeCoaches();
    const { data } = lifeCoachRequest.data;
    const lifeCoach = data.find(
      lifeCoach => lifeCoach.userData.monthlySlots.length > 0
    );
    if (lifeCoach) {
      expect.assertions(1);
      const req = {
        invalidData: "invalid",
        confirmed: false,
        date: "3/4/2025"
      };
      const updatedSlot = await updateSlot(
        lifeCoach._id,
        lifeCoach.userData.monthlySlots[0]._id,
        req
      ).catch(error => {
        expect(error.response.status).toEqual(400);
      });
    }
  },
  50000
);
test(
  "Update a non existent slot in a non existent lifeCoach",
  async () => {
    expect.assertions(1);
    const req = {
      booked: true,
      confirmed: false,
      date: "3/4/2025"
    };
    const slot = await updateSlot("1234", "1234", req).catch(error =>
      expect(error.response.status).toEqual(400)
    );
  },
  50000
);

test(
  "Update a non existent slot in a lifeCoach",
  async () => {
    expect.assertions(1);
    const lifeCoaches = await getLifeCoaches();
    const { data } = lifeCoaches.data;
    if (data.length > 0) {
      expect.assertions(1);
      const req = {
        booked: true,
        confirmed: false,
        date: "3/4/2025"
      };
      const slot = await updateSlot(data[0]._id, "1234", req).catch(error =>
        expect(error.response.status).toEqual(400)
      );
    }
  },
  50000
);

test(
  "Delete a slot",
  async () => {
    const lifeCoachRequest = await getLifeCoaches();
    const { data } = lifeCoachRequest.data;
    const lifeCoach = data.find(
      lifeCoach => lifeCoach.userData.monthlySlots.length > 0
    );
    if (lifeCoach) {
      expect.assertions(1);
      const oldSlotCount = lifeCoach.userData.monthlySlots.length;
      const deletedSlot = await deleteSlot(
        lifeCoach._id,
        lifeCoach.userData.monthlySlots[0]._id
      );
      const lifeCoachSlots = await getLifeCoachSlots(lifeCoach._id);
      expect(lifeCoachSlots.data.data.length).toEqual(oldSlotCount - 1);
    }
  },
  50000
);

test(
  "Delete a slot in a non existent lifeCoach ",
  async () => {
    expect.assertions(1);
    const req = {
      booked: true,
      confirmed: false,
      date: "3/4/2025"
    };
    const slot = await deleteSlot("1234", "1234", req).catch(error =>
      expect(error.response.status).toEqual(400)
    );
  },
  50000
);

test(
  "Delete a non existent slot in a lifeCoach",
  async () => {
    expect.assertions(1);
    const lifeCoaches = await getLifeCoaches();
    const { data } = lifeCoaches.data;
    if (data.length > 0) {
      expect.assertions(1);
      const req = {
        booked: true,
        confirmed: false,
        date: "3/4/2025"
      };
      const slot = await updateSlot(data[0]._id, "1234", req).catch(error =>
        expect(error.response.status).toEqual(400)
      );
    }
  },
  50000
);
