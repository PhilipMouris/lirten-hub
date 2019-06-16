const functions = require("../functions/jobApplication.functions");
const userFunctions = require("../functions/user.functions");
const memberFunctions = require("../functions/member.functions");
const partnerFunctions = require("../functions/partner.functions");
const vacancyFunctions = require("../functions/vacancy.functions");

test(
  "Get all job applications",
  async () => {
    expect.assertions(1);
    const jobApplications = await functions.getJobApplications();
    if (jobApplications.data.data.length > 0)
      expect(jobApplications.data.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            //You should only put properties that are required in your schema
            vacancy: expect.any(Object),
            member: expect.any(Object)
          })
        ])
      );
    else expect(jobApplications.data.data).toEqual([]);
  },
  50000
);

test(
  "Get all job applications of a vacancy",
  async () => {
    expect.assertions(1);
    const vacancies = await vacancyFunctions.getVacancies();
    const jobApplications = await functions.getJobApplications();
    if (vacancies.data.data.length > 0) {
      const vacancyApplications = await functions.getVacancyApplications(
        vacancies.data.data[0]._id
      );
      if (vacancyApplications.data.data.length > 0) {
        expect(vacancyApplications.data.data).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              //You should only put properties that are required in your schema
              vacancy: expect.any(Object),
              member: expect.any(Object)
            })
          ])
        );
      } else expect(vacancyApplications.data.data).toEqual([]);
    } else expect(jobApplications.data.data).toEqual([]);
  },
  50000
);

test(
  "Get all job applications of a non existent vacancy",
  async () => {
    expect.assertions(1);
    const jobApplications = await functions
      .getVacancyApplications("1234")
      .catch(error => {
        expect(error.response.status).toEqual(400);
      });
  },
  50000
);

test(
  "Get all job applications of a member",
  async () => {
    expect.assertions(1);
    const members = await memberFunctions.getMembers();
    const jobApplications = await functions.getJobApplications();
    if (members.data.data.length > 0) {
      const memberApplications = await functions.getMemberApplications(
        members.data.data[0]._id
      );
      if (memberApplications.data.data.length > 0) {
        expect(memberApplications.data.data).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              //You should only put properties that are required in your schema
              vacancy: expect.any(Object),
              member: expect.any(Object)
            })
          ])
        );
      } else expect(memberApplications.data.data).toEqual([]);
    } else expect(jobApplications.data.data).toEqual([]);
  },
  50000
);

test(
  "Get all job applications of a non existent member",
  async () => {
    expect.assertions(1);
    const jobApplications = await functions
      .getMemberApplications("1234")
      .catch(error => {
        expect(error.response.status).toEqual(400);
      });
  },
  50000
);

test(
  "Get a single job application",
  async () => {
    expect.assertions(1);
    const jobApplications = await functions.getJobApplications();
    if (jobApplications.data.data.length > 0) {
      const jobApplication = await functions.getJobApplication(
        jobApplications.data.data[0]._id
      );
      expect(jobApplication.data.data).toEqual(jobApplications.data.data[0]);
    } else expect(jobApplications.data.data).toEqual([]);
  },
  50000
);

test(
  "Get a non existent job application",
  async () => {
    expect.assertions(1);
    const jobApplication = await functions
      .getJobApplication("1234")
      .catch(error => {
        expect(error.response.status).toEqual(400);
      });
  },
  50000
);

test(
  "Delete a job application",
  async () => {
    expect.assertions(1);
    const jobApplications = await functions.getJobApplications();
    if (jobApplications.data.data.length > 0) {
      await functions.deleteJobApplication(jobApplications.data.data[0]._id);
      const jobApplicationsDeleted = await functions.getJobApplications();
      expect(jobApplicationsDeleted.data.data).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining(jobApplications.data.data[0])
        ])
      );
    } else expect(jobApplications.data.data).toEqual([]);
  },
  50000
);

test(
  "Delete a non existent job application",
  async () => {
    expect.assertions(1);
    await functions.deleteJobApplication("1234").catch(error => {
      expect(error.response.status).toEqual(400);
    });
  },
  50000
);

test(
  "Create a job application",
  async () => {
    expect.assertions(1);
    const members = await memberFunctions.getMembers();
    const vacancies = await vacancyFunctions.getVacancies();
    const jobApplications = await functions.getJobApplications();
    if (members.data.data.length > 0 && vacancies.data.data.length > 0) {
      const jobApplication = await functions.createJobApplication({
        vacancyId: vacancies.data.data[0]._id,
        memberId: members.data.data[0]._id
      });
      const updatedJobApplications = await functions.getJobApplications();
      expect(updatedJobApplications.data.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining(jobApplication.data.data)
        ])
      );
    } else expect(jobApplications.data.data).toEqual([]);
  },
  50000
);

test(
  "Create a job application with incomplete or incorrect data",
  async () => {
    expect.assertions(1);
    const jobApplication = await functions
      .createJobApplication({
        memberId: "1234",
        vacancyId: "1234"
      })
      .catch(error => {
        expect(error.response.status).toEqual(400);
      });
  },
  50000
);

test(
  "Update a job application",
  async () => {
    expect.assertions(1);
    const jobApplications = await functions.getJobApplications();
    if (jobApplications.data.data.length > 0) {
      const jobApplication = jobApplications.data.data[0];
      const { applicationText } = jobApplication;
      const newText = applicationText + "test";
      await functions.updateJobApplication(jobApplication._id, {
        applicationText: newText
      });
      const updatedJobApplication = await functions.getJobApplication(
        jobApplication._id
      );
      expect(updatedJobApplication.data.data.applicationText).toEqual(newText);
    } else expect(jobApplications.data.data).toEqual([]);
  },
  50000
);

test(
  "Update a job application with incomplete or incorrect data",
  async () => {
    expect.assertions(1);
    const jobApplications = await functions.getJobApplications();
    if (jobApplications.data.data.length > 0) {
      const jobApplication = jobApplications.data.data[0];
      await functions
        .updateJobApplication(jobApplication._id, {
          applicationText: 1
        })
        .catch(error => {
          expect(error.response.status).toEqual(400);
        });
    } else expect(jobApplications.data.data).toEqual([]);
  },
  50000
);

test(
  "Update a non existing job application",
  async () => {
    expect.assertions(1);
    const jobApplication = await functions
      .updateJobApplication("1234", {
        applicationText: "test"
      })
      .catch(error => {
        expect(error.response.status).toEqual(400);
      });
  },
  50000
);
