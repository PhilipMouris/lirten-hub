const functions = require("../functions/lifeCoach.functions");
const userFunctions = require("../functions/user.functions");

test(
  "Get all lifeCoaches",
  async () => {
    expect.assertions(1);
    const lifeCoaches = await functions.getLifeCoaches();
    if (lifeCoaches.data.data.length > 0)
      expect(lifeCoaches.data.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            //You should only put properties that are required in your schema
            _id: expect.any(String),
            type: "lifeCoach",
            name: expect.any(String),
            email: expect.any(String),
            password: expect.any(String),
            userData: expect.any(Object)
          })
        ])
      );
    else expect(lifeCoaches.data.data).toEqual([]);
  },
  50000
);

test(
  "Create a lifeCoach",
  async () => {
    expect.assertions(1);
    const lifeCoach = await functions.createLifeCoach({
      name: "jest",
      email: "test" + Math.random() + "@hotmail.com",
      dateOfBirth: "3/3/1980",
      gender: "female",
      password: "test"
    });
    const lifeCoaches = await functions.getLifeCoaches();
    expect(lifeCoaches.data.data).toEqual(
      expect.arrayContaining([expect.objectContaining(lifeCoach.data.data)])
    );
  },
  50000
);

test(
  "Create a lifeCoach with incomplete or incorrect data",
  async () => {
    expect.assertions(1);
    const lifeCoach = await functions
      .createLifeCoach({
        name: "jest",
        email: "test" + Math.random() + "@hotmail.com"
      })
      .catch(error => {
        expect(error.response.status).toEqual(400);
      });
  },
  50000
);

test(
  "Update a lifeCoach",
  async () => {
    expect.assertions(1);
    const lifeCoaches = await functions.getLifeCoaches();
    if (lifeCoaches.data.data.length > 0) {
      const lifeCoach = lifeCoaches.data.data[0];
      const {
        name,
        email,
        userData: { gender, dateOfBirth }
      } = lifeCoach;
      const newName = name + "test3";
      await functions.updateLifeCoach(lifeCoach._id, {
        name: newName,
        email,
        gender,
        dateOfBirth
      });
      const updatedlifeCoach = await userFunctions.getUser(lifeCoach._id);
      expect(updatedlifeCoach.data.data.name).toEqual(newName);
    } else expect(lifeCoaches.data.data).toEqual([]);
  },
  50000
);

test(
  "Update a lifeCoach with incomplete or incorrect data",
  async () => {
    expect.assertions(1);
    const lifeCoaches = await functions.getLifeCoaches();
    if (lifeCoaches.data.data.length > 0) {
      const lifeCoach = lifeCoaches.data.data[0];
      await functions
        .updateLifeCoach(lifeCoach._id, {
          name: "jest",
          email: "test" + Math.random() + "@hotmail.com"
        })
        .catch(error => {
          expect(error.response.status).toEqual(400);
        });
    } else expect(lifeCoaches.data.data).toEqual([]);
  },
  50000
);

test(
  "Update a non existing lifeCoach",
  async () => {
    expect.assertions(1);
    const lifeCoach = await functions
      .updateLifeCoach("1234", {
        name: "jest",
        email: "test" + Math.random() + "@hotmail.com",
        dateOfBirth: "3/3/1980",
        gender: "female"
      })
      .catch(error => {
        expect(error.response.status).toEqual(400);
      });
  },
  50000
);
