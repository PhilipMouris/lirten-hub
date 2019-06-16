const functions = require("../functions/reviews.functions");
const memberFunctions = require("../functions/member.functions");
const partnerFunctions = require("../functions/partner.functions");
const userFunctions = require("../functions/user.functions");
test(
  "Get all reviews of a member",
  async () => {
    expect.assertions(1);
    const members = await memberFunctions.getMembers();
    if (members.data.data.length > 0) {
      const member = members.data.data[0];

      const memberId = member._id;
      const reviews = await functions.readMemberReviews(memberId);
      if (reviews.data.data.length > 0) {
        expect(reviews.data.data).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              _id: expect.any(String),
              partner: expect.any(Object),
              reviewText: expect.any(String)
              // rating:expect.any(Number),
              // datePosted:expect.any(Date), //Not Required
            })
          ])
        );
      } else {
        expect(reviews.data.data).toEqual([]);
      }
    } else expect(members.data.data).toEqual([]);
  },
  50000
);

test(
  "Get all reviews of non-existing member",
  async () => {
    expect.assertions(1);
    const review = await functions.readMemberReviews("1234").catch(error => {
      expect(error.response.status).toEqual(400);
    });
  },
  50000
);
test(
  "Get a non-existing review",
  async () => {
    expect.assertions(1);
    const review = await functions.readReview("1234").catch(error => {
      expect(error.response.status).toEqual(400);
    });
  },
  50000
);

test(
  "Get a single review",
  async () => {
    expect.assertions(1);
    const members = await memberFunctions.getMembers();

    if (members.data.data.length > 0) {
      const member = members.data.data[0];
      const memberId = member._id;
      const reviews = await functions.readMemberReviews(memberId);

      if (reviews.data.data.length > 0) {
        const tempReview = reviews.data.data[0];
        const reviewId = tempReview._id;
        const review = await functions.readReview(reviewId);
        expect(review.data.data).toEqual(tempReview);
      } else {
        expect(reviews.data.data).toEqual([]);
      }
    } else {
      expect(members.data.data).toEqual([]);
    }
  },
  50000
);

test(
  "Create a review",
  async () => {
    expect.assertions(1);
    const members = await memberFunctions.getMembers();
    const partners = await partnerFunctions.getPartners();
    if (members.data.data.length > 0) {
      const member = members.data.data[0];
      const memberId = member._id;
      if (partners.data.data.length > 0) {
        const partner = partners.data.data[0];
        const partnerId = partner._id;
        const body = {
          partnerID: partnerId,
          memberID: memberId,
          reviewText: "TESTT",
          rating: "20"
        };

        const review = await functions.createReview(body);
        const allReviews = await functions.readMemberReviews(memberId);
        expect(allReviews.data.data).toEqual(
          expect.arrayContaining([expect.objectContaining(review.data.data)])
        );
      } else {
        expect(partners.data.data).toEqual([]);
      }
    } else expect(members.data.data).toEqual([]);
  },
  50000
);
test(
  "Create a review with a non-existing member",
  async () => {
    expect.assertions(1);
    const partners = await partnerFunctions.getPartners();
    if (partners.data.data.length > 0) {
      const partner = partners.data.data[0];
      const partnerId = partner._id;
      const body = {
        partnerID: partnerId,
        memberID: "1234",
        reviewText: "TESTT",
        rating: "20"
      };

      const review = await functions.createReview(body).catch(error => {
        expect(error.response.status).toEqual(400);
      });
    } else {
      expect(partners.data.data).toEqual([]);
    }
  },
  50000
);
test(
  "Create a review with a non-existing partner",
  async () => {
    expect.assertions(1);
    const members = await memberFunctions.getMembers();
    if (members.data.data.length > 0) {
      const member = members.data.data[0];
      const memberId = member._id;
      const body = {
        partnerID: "1244",
        memberID: memberId,
        reviewText: "TESTT",
        rating: "20"
      };

      const review = await functions.createReview(body).catch(error => {
        expect(error.response.status).toEqual(400);
      });
    } else {
      expect(members.data.data).toEqual([]);
    }
  },
  50000
);
test(
  "Create a review with incorrect or incomplete data",
  async () => {
    expect.assertions(1);
    const members = await memberFunctions.getMembers();
    if (members.data.data.length > 0) {
      const member = members.data.data[0];
      const memberId = member._id;
      const body = {
        memberID: memberId,
        partnerID: "1234",
        rating: "20"
      };

      const review = await functions.createReview(body).catch(error => {
        expect(error.response.status).toEqual(400);
      });
    } else {
      expect(members.data.data).toEqual([]);
    }
  },
  50000
);
test(
  "Update a review",
  async () => {
    expect.assertions(1);
    const members = await memberFunctions.getMembers();
    if (members.data.data.length > 0) {
      const member = members.data.data[0];
      const memberId = member._id;
      const reviews = await functions.readMemberReviews(memberId);
      const reviewId = reviews.data.data[0]._id;
      const body = {
        reviewText: "TESTUPDATE",
        rating: "344"
      };
      await functions.updateReview(memberId, reviewId, body);
      const tempReview = await functions.readReview(reviewId);
      expect(tempReview.data.data).toEqual(
        expect.objectContaining({ ...body })
      );
    } else expect(members.data.data).toEqual([]);
  },
  50000
);

test(
  "Update a non-existing review",
  async () => {
    expect.assertions(1);
    const members = await memberFunctions.getMembers();
    if (members.data.data.length > 0) {
      const member = members.data.data[0];
      const memberId = member._id;
      const reviewId = "1234";
      const body = {
        reviewText: "TESTUPDATE",
        rating: "344"
      };
      await functions.updateReview(memberId, reviewId, body).catch(error => {
        expect(error.response.status).toEqual(400);
      });
    } else expect(members.data.data).toEqual([]);
  },
  50000
);
test(
  "Update a review in non-existing member",
  async () => {
    expect.assertions(1);
    const memberId = "1234";
    const reviewId = "1234";
    const body = {
      reviewText: "TESTUPDATE",
      rating: "344"
    };
    await functions.updateReview(memberId, reviewId, body).catch(error => {
      expect(error.response.status).toEqual(400);
    });
  },
  50000
);
test(
  "Update a review with missing or incorrect info",
  async () => {
    expect.assertions(1);
    const members = await memberFunctions.getMembers();
    if (members.data.data.length > 0) {
      const member = members.data.data[0];
      const memberId = member._id;
      const reviews = await functions.readMemberReviews(memberId);
      const reviewId = reviews.data.data[0]._id;
      const body = {
        rating: "344"
      };
      await functions.updateReview(memberId, reviewId, body).catch(error => {
        expect(error.response.status).toEqual(400);
      });
    } else {
      expect(members.data.data).toEqual([]);
    }
  },
  50000
);
test(
  "Delete a review",
  async () => {
    expect.assertions(1);
    const members = await memberFunctions.getMembers();
    if (members.data.data.length > 0) {
      const memberId = members.data.data[0]._id;
      const reviews = await functions.readMemberReviews(memberId);
      if (reviews.data.data.length > 0) {
        const review = reviews.data.data[0];
        const reviewId = review._id;

        await functions.deleteReview(memberId, reviewId);
        const tempReviews = await functions.readMemberReviews(memberId);
        expect(tempReviews.data.data).not.toEqual(
          expect.arrayContaining([expect.objectContaining({ ...review })])
        );
      } else {
        expect(reviews.data.data).toEqual([]);
      }
    } else {
      expect(members.data.data).toEqual([]);
    }
  },
  50000
);
test(
  "Delete a non-existing review for existing member",
  async () => {
    expect.assertions(1);
    const members = await memberFunctions.getMembers();
    if (members.data.data.length > 0) {
      const memberId = members.data.data[0]._id;

      const reviewId = "1234";

      await functions.deleteReview(memberId, reviewId).catch(error => {
        expect(error.response.status).toEqual(400);
      });
    } else {
      expect(members.data.data).toEqual([]);
    }
  },
  50000
);
test(
  "Delete an  existing review for non-existing member",
  async () => {
    expect.assertions(1);
    const members = await memberFunctions.getMembers();
    if (members.data.data.length > 0) {
      let memberId = members.data.data[0]._id;
      const reviews = await functions.readMemberReviews(memberId);
      if (reviews.data.data.length > 0) {
        const review = reviews.data.data[0];
        const reviewId = review._id;
        memberId = "1234";
        await functions.deleteReview(memberId, reviewId).catch(error => {
          expect(error.response.status).toEqual(400);
        });
      } else {
        expect(reviews.data.data).toEqual([]);
      }
    } else {
      expect(members.data.data).toEqual([]);
    }
  },
  50000
);
