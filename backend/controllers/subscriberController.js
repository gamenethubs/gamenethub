// backend/controllers/subscriberController.js
import Subscriber from "../models/Subscriber.js";

export const subscribeUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email is required" });

    // Check existing email
    const exist = await Subscriber.findOne({ email });
    if (exist) {
      return res.status(200).json({ message: "Already subscribed" });
    }

    // Save new email
    const newSub = await Subscriber.create({ email });

    return res.status(201).json({
      message: "Subscribed successfully",
      subscriber: newSub,
    });
  } catch (error) {
    console.error("Subscribe error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
