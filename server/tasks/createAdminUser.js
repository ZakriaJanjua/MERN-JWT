require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.ti7ms.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => {
    console.log("connection to db established");
  }
);
const User = require("../models/Users");
const bcrypt = require("bcryptjs");

const createAdminUser = async () => {
  try {
    const user = await User.findOne({ role: "admin" });
    if (!user) {
      User.create({
        username: "god",
        password: await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD, 12),
        role: "admin",
        active: true,
      });
      console.log("admin created");
    } else {
      console.log("admin already exists");
    }
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection
      .close()
      .then(() => console.log("connection to db closed"));
  }
};

createAdminUser();
