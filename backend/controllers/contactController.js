import Contact from "../models/Contact.js";

export const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const entry = await Contact.create({ name, email, message });

    return res.json({
      success: true,
      message: "Message submitted successfully",
      data: entry
    });
  } catch (err) {
    console.error("🔥 CONTACT FORM ERROR:", err.message);
    return res.status(500).json({ success: false, message: "Failed to submit message" });
  }
};
