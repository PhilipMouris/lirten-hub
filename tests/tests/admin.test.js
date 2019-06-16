const functions = require("../functions/admin.functions");
const userFunctions = require("../functions/user.functions");

test(
  "Get all admins",
  async () => {
    expect.assertions(1);
    const admins = await functions.getAdmins();
    if (admins.data.data.length > 0)
      expect(admins.data.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            //You should only put properties that are required in your schema
            _id: expect.any(String),
            type: "admin",
            name: expect.any(String),
            email: expect.any(String),
            password: expect.any(String),
            userData: expect.any(Object)
          })
        ])
      );
    else expect(admins.data.data).toEqual([]);
  },
  50000
);

test(
  "Create an admin",
  async () => {
    expect.assertions(1);
    const admin = await functions.createAdmin({
      name: "jest",
      email: "test" + Math.random() + "@hotmail.com",
      dateOfBirth: "3/3/1980",
      gender: "female",
      password: "test"
    });
    const admins = await functions.getAdmins();
    expect(admins.data.data).toEqual(
      expect.arrayContaining([expect.objectContaining(admin.data.data)])
    );
  },
  50000
);

test(
  "Create an admin with incomplete or incorrect data",
  async () => {
    expect.assertions(1);
    const admin = await functions
      .createAdmin({
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
  "Update an admin",
  async () => {
    expect.assertions(1);
    const admins = await functions.getAdmins();
    if (admins.data.data.length > 0) {
      const admin = admins.data.data[0];
      const {
        name,
        email,
        userData: { gender, dateOfBirth }
      } = admin;
      const newName = name + "test3";
      await functions.updateAdmin(admin._id, {
        name: newName,
        email,
        gender,
        dateOfBirth
      });
      const updatedAdmin = await userFunctions.getUser(admin._id);
      expect(updatedAdmin.data.data.name).toEqual(newName);
    } else expect(admins.data.data).toEqual([]);
  },
  50000
);

test(
  "Update an admin with incomplete or incorrect data",
  async () => {
    expect.assertions(1);
    const admins = await functions.getAdmins();
    if (admins.data.data.length > 0) {
      const admin = admins.data.data[0];
      await functions
        .updateAdmin(admin._id, {
          name: "jest",
          email: "test" + Math.random() + "@hotmail.com"
        })
        .catch(error => {
          expect(error.response.status).toEqual(400);
        });
    } else expect(admins.data.data).toEqual([]);
  },
  50000
);

test(
  "Update a non existing admin",
  async () => {
    expect.assertions(1);
    const admin = await functions
      .updateAdmin("1234", {
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
