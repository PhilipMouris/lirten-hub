const functions = require("../functions/member.functions");
const userFunctions = require("../functions/user.functions");

test(
  "Get all members",
  async () => {
    expect.assertions(1);
    const members = await functions.getMembers();
    if (members.data.data.length > 0)
      expect(members.data.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            //You should only put properties that are required in your schema
            _id: expect.any(String),
            type: "member",
            name: expect.any(String),
            email: expect.any(String),
            password: expect.any(String),
            userData: expect.any(Object)
          })
        ])
      );
    else expect(members.data.data).toEqual([]);
  },
  50000
);

test(
  "Create a member",
  async () => {
    expect.assertions(1);
    const member = await functions.createMember({
      name: "jest",
      email: "test" + Math.random() + "@hotmail.com",
      dateOfBirth: "3/3/1980",
      gender: "female",
      password: "test"
    });
    const members = await functions.getMembers();
    expect(members.data.data).toEqual(
      expect.arrayContaining([expect.objectContaining(member.data.data)])
    );
  },
  50000
);

test(
  "Create a member with incomplete or incorrect data",
  async () => {
    expect.assertions(1);
    const member = await functions
      .createMember({
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
  "Update a member",
  async () => {
    expect.assertions(1);
    const members = await functions.getMembers();
    if (members.data.data.length > 0) {
      const member = members.data.data[0];
      const {
        name,
        email,
        userData: { gender, dateOfBirth }
      } = member;
      const newName = name + "test3";
      await functions.updateMember(member._id, {
        name: newName,
        email,
        gender,
        dateOfBirth
      });
      const updatedMember = await userFunctions.getUser(member._id);
      expect(updatedMember.data.data.name).toEqual(newName);
    } else expect(members.data.data).toEqual([]);
  },
  50000
);

test(
  "Update a member with incomplete or incorrect data",
  async () => {
    expect.assertions(1);
    const members = await functions.getMembers();
    if (members.data.data.length > 0) {
      const member = members.data.data[0];
      await functions
        .updateMember(member._id, {
          name: "jest",
          email: "test" + Math.random() + "@hotmail.com"
        })
        .catch(error => {
          expect(error.response.status).toEqual(400);
        });
    } else expect(members.data.data).toEqual([]);
  },
  50000
);

test(
  "Update a non existing member",
  async () => {
    expect.assertions(1);
    const member = await functions
      .updateMember("1234", {
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
