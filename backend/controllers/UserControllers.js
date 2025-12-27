const { User, catago, Collectionmodel } = require("../models/User");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashed,
      provider: "local"
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Registered successfully",
      user
    });

  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
};

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, provider: "local" });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: "Wrong password" });
    }

         const token = jwt.sign(
       { userId: user._id },
       process.env.JWT_SECRET,
       { expiresIn: "7d" }
       );

    res.status(200).json({
    success: true,
     message: "Login successful",
    token,
     user
});


  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

/* ================= GOOGLE LOGIN (NO JWT) ================= */
exports.googleLogin = async (req, res) => {
  try {
    const { token: googleToken } = req.body; // ✅ rename

    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const { email, name, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        picture,
        provider: "google"
      });
      await user.save();
    }

    // ✅ create JWT
    const jwtToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Google login successful",
      token: jwtToken, // ✅ send JWT
      user
    });

  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Google authentication failed" });
  }
};

/* ================= CATEGORY ================= */
exports.createcatogory = async (req, res) => {
  try {
    const data = new catago(req.body);
    await data.save();
    res.status(200).json({ message: "Saved", data });
  } catch {
    res.status(500).json({ error: "Failed to save category" });
  }
};

exports.getcattogory = async (req, res) => {
  try {
    const data = await catago.find();
    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch category" });
  }
};

/* ================= COLLECTION ================= */
exports.createCollection = async (req, res) => {
  try {
    const data = new Collectionmodel(req.body);
    await data.save();
    res.status(200).json({ message: "Saved", data });
  } catch {
    res.status(500).json({ error: "Failed to save collection" });
  }
};

exports.getCollections = async (req, res) => {
  const data = await Collectionmodel.find();
  res.json(data);
};

exports.getSingleCollection = async (req, res) => {
  const item = await Collectionmodel.findById(req.params.id);
  res.json(item);
};

exports.getRelatedCollections = async (req, res) => {
  const item = await Collectionmodel.findById(req.params.id);
  const related = await Collectionmodel.find({
    catagory: { $in: item.catagory },
    _id: { $ne: item._id }
  }).limit(6);
  res.json(related);
};

exports.SearchProduct = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);

  const data = await Collectionmodel.find({
    $or: [
      { name: { $regex: q, $options: "i" } },
      { catagory: { $in: [new RegExp(q, "i")] } }
    ]
  });

  res.json(data);
};


