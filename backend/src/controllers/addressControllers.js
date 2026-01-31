const Address= require("../models/UserAddress")
exports.addAddress = async (req, res) => {
  try {
    const { userId, name, email, phone, city, pincode, address, reference } = req.body;
    let existing = await Address.findOne({ userId });
    if (existing) {
      return res.status(200).json(existing); // 👈 return address directly
    }
    const add = new Address({
      userId,
      name,
      email,
      phone,
      city,
      pincode,
      address,
      reference
    });
    await add.save();
    return res.status(201).json(add); // 👈 return address directly
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Request failed" });
  }
};
exports.getAdddress = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await Address.findOne({ userId });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch address" });
  }
};





exports.updateAddress = async (req, res) => {
  try {
    const { userId } = req.params;

    const updated = await Address.findOneAndUpdate(
      { userId },
      req.body,
      { new: true }
    );

    res.status(200).json(updated);

  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};



exports.deleteAddress = async (req, res) => {
  try {
    const { userId } = req.params;

    const deleted = await Address.findOneAndDelete({ userId });

    if (!deleted) {
      return res.status(404).json({ error: "Address not found" });
    }

    res.status(200).json({ success: true });

  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};


 
