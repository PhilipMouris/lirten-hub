const functions = require("../functions/feedback.functions");
const userFunctions = require("../functions/user.functions");
const partnerFunctions = require("../functions/partner.functions");
const memberFunctions = require("../functions/member.functions");

test(
  "Get all feedbacks of a partner",
  async () => {
    expect.assertions(1);
    const partners = await partnerFunctions.getPartners();
    if (partners.data.data.length > 0) {
      const partnerFeedbacks = await functions.getPartnerFeedbacks(
        partners.data.data[0]._id
      );
      expect(partnerFeedbacks.data.data).toEqual(
        partners.data.data[0].userData.feedback
      );
    } else expect(partners.data.data).toEqual([]);
  },
  50000
);

test(
  "Get all feedbacks of a non existent partner",
  async () => {
    expect.assertions(1);
    const feedbacks = await functions
      .getPartnerFeedbacks("1234")
      .catch(error => {
        expect(error.response.status).toEqual(400);
      });
  },
  50000
);

test(
  "Get a single feedback",
  async () => {
    expect.assertions(1);
    const partners = await partnerFunctions.getPartners();
    const partnersWithFeedbacks = await partners.data.data.filter(
      partner =>
        typeof partner.userData.feedback !== "undefined" &&
        partner.userData.feedback.length > 0
    );
    if (partnersWithFeedbacks.length > 0) {
      const feedback = await functions.getFeedback(
        partnersWithFeedbacks[0].userData.feedback[0]._id
      );
      expect(feedback.data.data).toEqual(
        partnersWithFeedbacks[0].userData.feedback[0]
      );
    } else expect(partnersWithFeedbacks).toEqual([]);
  },
  50000
);

test(
  "Get a non existent feedback",
  async () => {
    expect.assertions(1);
    const feedback = await functions.getFeedback("1234").catch(error => {
      expect(error.response.status).toEqual(400);
    });
  },
  50000
);

test(
  "Delete a feedback",
  async () => {
    expect.assertions(1);
    const partners = await partnerFunctions.getPartners();
    const partnersWithFeedbacks = await partners.data.data.filter(
      partner =>
        typeof partner.userData.feedback !== "undefined" &&
        partner.userData.feedback.length > 0
    );
    if (partnersWithFeedbacks.length > 0) {
      await functions.deleteFeedback(
        partnersWithFeedbacks[0].userData.feedback[0]._id,
        partnersWithFeedbacks[0]._id
      );
      const feedbacksDeleted = await functions.getPartnerFeedbacks(
        partnersWithFeedbacks[0]._id
      );
      expect(feedbacksDeleted.data.data).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining(partnersWithFeedbacks[0].userData.feedback[0])
        ])
      );
    } else expect(partnersWithFeedbacks).toEqual([]);
  },
  50000
);

test(
  "Delete a non existent feedback",
  async () => {
    expect.assertions(1);
    await functions.deleteFeedback("1234", "1234").catch(error => {
      expect(error.response.status).toEqual(400);
    });
  },
  50000
);

test(
  "Create a feedback",
  async () => {
    expect.assertions(1);
    const partners = await partnerFunctions.getPartners();
    const members = await memberFunctions.getMembers();
    if (partners.data.data.length > 0 && members.data.data.length > 0) {
      const feedback = await functions.createFeedback({
        memberId: members.data.data[0]._id,
        partnerId: partners.data.data[0]._id,
        feedbackText: "feedbackTest"
      });
      const updatedFeedbacks = await functions.getPartnerFeedbacks(
        partners.data.data[0]._id
      );
      expect(updatedFeedbacks.data.data).toEqual(
        expect.arrayContaining([expect.objectContaining(feedback.data.data)])
      );
    } else {
      if (partners.data.data.length === 0)
        expect(partners.data.data).toEqual([]);
      else expect(members.data.data).toEqual([]);
    }
  },
  50000
);

test(
  "Create a feedback with incomplete or incorrect data",
  async () => {
    expect.assertions(1);
    const feedback = await functions
      .createFeedback({
        partnerId: "1234",
        memberId: "1234",
        feedbackText: "feedbackTest"
      })
      .catch(error => {
        expect(error.response.status).toEqual(400);
      });
  },
  50000
);

test(
  "Update a feedback",
  async () => {
    expect.assertions(1);
    const partners = await partnerFunctions.getPartners();
    const partnersWithFeedbacks = partners.data.data.filter(
      partner =>
        typeof partner.userData.feedback !== "undefined" &&
        partner.userData.feedback.length > 0
    );
    if (partnersWithFeedbacks.length > 0) {
      const feedback = partnersWithFeedbacks[0].userData.feedback[0];
      const { feedbackText } = feedback;
      const newText = feedbackText + "test";
      await functions.updateFeedback(
        feedback._id,
        partnersWithFeedbacks[0]._id,
        {
          feedbackText: newText
        }
      );
      const updatedFeedback = await functions.getFeedback(feedback._id);
      expect(updatedFeedback.data.data.feedbackText).toEqual(newText);
    } else expect(partnersWithFeedbacks).toEqual([]);
  },
  50000
);

test(
  "Update a feedback with incomplete or incorrect data",
  async () => {
    expect.assertions(1);
    const partners = await partnerFunctions.getPartners();
    const partnersWithFeedbacks = await partners.data.data.filter(
      partner => partner =>
        typeof partner.userData.feedback !== "undefined" &&
        partner.userData.feedback.length > 0
    );
    if (partnersWithFeedbacks.length > 0) {
      const feedback = partnersWithFeedbacks[0].userData.feedback[0];
      await functions
        .updateFeedback(partnersWithFeedbacks[0]._id, feedback._id, {})
        .catch(error => expect(error.response.status).toEqual(400));
    } else expect(partnersWithFeedbacks).toEqual([]);
  },
  50000
);

test(
  "Update a non existing feedback",
  async () => {
    expect.assertions(1);
    const feedback = await functions
      .updateFeedback("1234", "1234", {
        feedbackText: "test"
      })
      .catch(error => {
        expect(error.response.status).toEqual(400);
      });
  },
  50000
);
