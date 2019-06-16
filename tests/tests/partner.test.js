const functions = require("../functions/partner.functions");
const userFunctions = require("../functions/user.functions");

test(
  "Get all partners",
  async () => {
    expect.assertions(1);
    const partners = await functions.getPartners();
    if (partners.data.data.length > 0)
      expect(partners.data.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            //You should only put properties that are required in your schema
            _id: expect.any(String),
            type: "partner",
            name: expect.any(String),
            email: expect.any(String),
            password: expect.any(String),
            userData: expect.any(Object)
          })
        ])
      );
    else expect(partners.data.data).toEqual([]);
  },
  50000
);

test(
  "Create a partner",
  async () => {
    expect.assertions(1);
    const partner = await functions.createPartner({
      name: "jest",
      email: "test" + Math.random() + "@hotmail.com",
      password: "test",
      approved: "false"
    });
    const partners = await functions.getPartners();
    expect(partners.data.data).toEqual(
      expect.arrayContaining([expect.objectContaining(partner.data.data)])
    );
  },
  50000
);

test(
  "Create a partner with incomplete or incorrect data",
  async () => {
    expect.assertions(1);
    const partner = await functions
      .createPartner({
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
  "Update a partner",
  async () => {
    expect.assertions(1);
    const partners = await functions.getPartners();
    if (partners.data.data.length > 0) {
      const partner = partners.data.data[0];
      const {
        name,
        email,
        userData: { approved }
      } = partner;
      const newName = name + "test";
      await functions.updatePartner(partner._id, {
        name: newName,
        email,
        approved: Boolean(approved)
      });
      const updatedPartner = await userFunctions.getUser(partner._id);
      expect(updatedPartner.data.data.name).toEqual(newName);
    } else expect(partners.data.data).toEqual([]);
  },
  50000
);

test(
  "Update a partner with incomplete or incorrect data",
  async () => {
    expect.assertions(1);
    const partners = await functions.getPartners();
    if (partners.data.data.length > 0) {
      const partner = partners.data.data[0];
      await functions
        .updatePartner(partner._id, {
          name: "jest"
        })
        .catch(error => {
          expect(error.response.status).toEqual(400);
        });
    } else expect(partners.data.data).toEqual([]);
  },
  50000
);

test(
  "Update a non existing partner",
  async () => {
    expect.assertions(1);
    const partner = await functions
      .updatePartner("1234", {
        name: "jest",
        email: "test" + Math.random() + "@hotmail.com",
        approved: "false"
      })
      .catch(error => {
        expect(error.response.status).toEqual(400);
      });
  },
  50000
);
