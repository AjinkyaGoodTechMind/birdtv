const SubscriptionSchema = require("../schemas/subscriptionSchema");

const subscriptionCheck = async () => {
  const subscriptions = await SubscriptionSchema.find();

  let today = new Date();

  for (i = 0; i < subscriptions.length; i++) {
    if (subscriptions[i].expireDate < today) {
      await SubscriptionSchema.findOneAndUpdate({ _id: subscriptions[i]._id }, { $set: { status: "Expired" } });
    }
  }
};

module.exports = { subscriptionCheck };
