const functions = require("../functions/user.functions");
const memberFunctions = require("../functions/member.functions");

test(
  "Get all users",
  async () => {
    expect.assertions(1);
    const users = await functions.getUsers();
    if (users.data.data.length > 0)
      expect(users.data.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            //You should only put properties that are required in your schema
            _id: expect.any(String),
            type: expect.any(String),
            name: expect.any(String),
            email: expect.any(String),
            password: expect.any(String),
            userData: expect.any(Object)
          })
        ])
      );
    else expect(users.data.data).toEqual([]);
  },
  50000
);

test(
  "Get a single user",
  async () => {
    expect.assertions(1);
    const users = await functions.getUsers();
    if (users.data.data.length > 0) {
      const user = await functions.getUser(users.data.data[0]._id);
      expect(user.data.data).toEqual(users.data.data[0]);
    } else expect(users.data.data).toEqual([]);
  },
  50000
);

test(
  "Get a non existent user",
  async () => {
    expect.assertions(1);
    const user = await functions.getUser("1234").catch(error => {
      expect(error.response.status).toEqual(400);
    });
  },
  50000
);

test(
  "Delete a user",
  async () => {
    expect.assertions(1);
    const users = await functions.getUsers();
    if (users.data.data.length > 0) {
      await functions.deleteUser(users.data.data[0]._id);
      const usersDeleted = await functions.getUsers();
      expect(usersDeleted.data.data).not.toEqual(
        expect.arrayContaining([expect.objectContaining(users.data.data[0])])
      );
    } else expect(users.data.data).toEqual([]);
  },
  50000
);

test(
  "Delete a non existent user",
  async () => {
    expect.assertions(1);
    await functions.deleteUser("1234").catch(error => {
      expect(error.response.status).toEqual(400);
    });
  },
  50000
);

test(
  "Update password",
  async () => {
    expect.assertions(1);
    const member = await memberFunctions.createMember({
      name: "jest",
      email: "test" + Math.random() + "@hotmail.com",
      dateOfBirth: "3/3/1980",
      gender: "female",
      password: "test"
    });
    const oldHashedPassword = member.data.data.password;
    await functions.updatePassword(member.data.data._id, "test", "newTest");
    const updatedMember = await functions.getUser(member.data.data._id);
    const newHashedPassword = updatedMember.data.data.password;
    expect(oldHashedPassword).not.toEqual(newHashedPassword);
  },
  50000
);
