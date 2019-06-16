const functions = require("../functions/vacancy.functions");
const userFunctions = require("../functions/user.functions");
const partnerFunctions = require("../functions/partner.functions");

test("Get all vacancies", async () => {
  expect.assertions(1);
  const vacancies = await functions.getVacancies();
  if (vacancies.data.data.length > 0)
    expect(vacancies.data.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          //You should only put properties that are required in your schema
          _id: expect.any(String),
          description: expect.any(String),
          partner: expect.any(Object)
        })
      ])
    );
  else expect(vacancies.data.data).toEqual([]);
}, 50000);

test("Get all vacancies of a partner", async () => {
  expect.assertions(1);
  const partners = await partnerFunctions.getPartners();
  const vacancies = await functions.getVacancies();
  if (partners.data.data.length > 0) {
    const partnerVacancies = await functions.getPartnerVacancies(
      partners.data.data[0]._id
    );
    if (partnerVacancies.data.data.length > 0) {
      expect(partnerVacancies.data.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            //You should only put properties that are required in your schema
            _id: expect.any(String),
            description: expect.any(String),
            partner: expect.any(Object)
          })
        ])
      );
    } else expect(partnerVacancies.data.data).toEqual([]);
  } else expect(vacancies.data.data).toEqual([]);
}, 50000);

test("Get all vacancies of a non existent partner", async () => {
  expect.assertions(1);
  const vacancies = await functions.getPartnerVacancies("1234").catch(error => {
    expect(error.response.status).toEqual(400);
  });
}, 50000);

test("Get a single vacancy", async () => {
  expect.assertions(1);
  const vacancies = await functions.getVacancies();
  if (vacancies.data.data.length > 0) {
    const vacancy = await functions.getVacancy(vacancies.data.data[0]._id);
    expect(vacancy.data.data).toEqual(vacancies.data.data[0]);
  } else expect(vacancies.data.data).toEqual([]);
}, 50000);

test("Get a non existent vacancy", async () => {
  expect.assertions(1);
  const vacancy = await functions.getVacancy("1234").catch(error => {
    expect(error.response.status).toEqual(400);
  });
}, 50000);

test("Delete a vacancy", async () => {
  expect.assertions(1);
  const vacancies = await functions.getVacancies();
  if (vacancies.data.data.length > 0) {
    await functions.deleteVacancy(vacancies.data.data[0]._id);
    const vacanciesDeleted = await functions.getVacancies();
    expect(vacanciesDeleted.data.data).not.toEqual(
      expect.arrayContaining([expect.objectContaining(vacancies.data.data[0])])
    );
  } else expect(vacancies.data.data).toEqual([]);
}, 50000);

test("Delete a non existent vacancy", async () => {
  expect.assertions(1);
  await functions.deleteVacancy("1234").catch(error => {
    expect(error.response.status).toEqual(400);
  });
}, 50000);

test("Create a vacancy", async () => {
  expect.assertions(1);
  const partners = await partnerFunctions.getPartners();
  const vacancies = await functions.getVacancies();
  if (partners.data.data.length > 0) {
    const vacancy = await functions.createVacancy({
      partnerId: partners.data.data[0]._id,
      description: "test description"
    });
    const updatedVacancies = await functions.getVacancies();
    expect(updatedVacancies.data.data).toEqual(
      expect.arrayContaining([expect.objectContaining(vacancy.data.data)])
    );
  } else expect(vacancies.data.data).toEqual([]);
}, 50000);

test("Create a vacancy with incomplete or incorrect data", async () => {
  expect.assertions(1);
  const vacancy = await functions
    .createVacancy({
      partnerId: "1234",
      description: "test description"
    })
    .catch(error => {
      expect(error.response.status).toEqual(400);
    });
}, 50000);

test("Update a vacancy", async () => {
  expect.assertions(1);
  const vacancies = await functions.getVacancies();
  if (vacancies.data.data.length > 0) {
    const vacancy = vacancies.data.data[0];
    const { partner, description } = vacancy;
    const newDescription = description + "test";
    await functions.updateVacancy(vacancy._id, {
      partnerId: partner._id,
      description: newDescription
    });
    const updatedVacancy = await functions.getVacancy(vacancy._id);
    expect(updatedVacancy.data.data.description).toEqual(newDescription);
  } else expect(vacancies.data.data).toEqual([]);
}, 50000);

test("Update a vacancy with incomplete or incorrect data", async () => {
  expect.assertions(1);
  const vacancies = await functions.getVacancies();
  if (vacancies.data.data.length > 0) {
    const vacancy = vacancies.data.data[0];
    await functions
      .updateVacancy(vacancy._id, {
        partnerId: "1234",
        description: "test"
      })
      .catch(error => {
        expect(error.response.status).toEqual(400);
      });
  } else expect(vacancies.data.data).toEqual([]);
}, 50000);

test("Update a non existing vacancy", async () => {
  expect.assertions(1);
  const vacancy = await functions
    .updateVacancy("1234", {
      partnerId: "1234",
      description: "test"
    })
    .catch(error => {
      expect(error.response.status).toEqual(400);
    });
}, 50000);
