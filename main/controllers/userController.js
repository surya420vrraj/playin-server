const User = require("../models/userSchema");
const bcryptJS = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserActivity = require("../models/userActivitySchema");
const { DateTime } = require("luxon");

exports.index = async (req, res, next) => {
  try {
    const user = await User.find().sort({
      createdAt: -1,
    });
    res.json({
      message: "All users data",
      success: true,
      data: user,
    });
  } catch (e) {
    next(e);
  }
};

exports.addUser = async (req, res, next) => {
  try {
    let { userName, email, pass, cpass, role } = req.body;
    if (pass !== cpass) {
      return res.json({ message: "Password must be same", success: false });
    }
    const salt = await bcryptJS.genSalt(10);
    password = await bcryptJS.hash(pass, salt);
    let user = await User.findOne({ email });
    if (user) {
      return res.json({ message: "Email id is already taken" });
    }
    user = await new User({ userName, email, password, role }).save();
    res.json({ message: "User added succesfully", success: true, user });
  } catch (e) {
    next(e);
  }
};

exports.signIn = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Email does not exist" });
    }
    const Match = await bcryptJS.compare(password, user.password);
    if (Match) {
      // Create a new user activity entry
      let loggindetails;
      if (user.role !== 2) {
        const userActivity = new UserActivity({
          loginTime: DateTime.now().setZone("Asia/Dubai"),
          user: user.id,
          date: DateTime.now().setZone("Asia/Dubai"),
        });
        loggindetails = await userActivity.save();
      }
      const token = jwt.sign(
        {
          id: user._id,
          userName: user.userName,
          email: user.email,
          role: user.role,
          loggindetails,
        },
        process.env.JWT_SECRET
      );

      return res.json({
        message: "Logged succesfully succesfully",
        success: true,
        user,
        token,
      });
    } else {
      return res.json({ message: "Password is incorrect", success: false });
    }
  } catch (e) {
    next(e);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    let { userName, email, password } = req.body;
    let user = await User.findById(req.params.id);
    user.userName = userName;
    user.email = email;
    user.password = password;
    user = await user.save();
    res.json({
      message: "User updated succesfully",
      success: true,
      data: user,
    });
  } catch (e) {
    next(e);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = User.findById(req.params.id);
    await user.deleteOne();
    res.json({ message: "User deleted succesfully", success: true });
  } catch (e) {
    next(e);
  }
};

exports.logout = async (req, res, next) => {
  const { loggindetails, role } = req.user;
  try {
    if (role === 2) {
      return res.json({ success: true, message: "logout succesful" });
    } else {
      const userEntry = await UserActivity.findById(loggindetails._id);

      if (Object.keys(userEntry).length === 0) {
        return res
          .status(404)
          .json({ message: "User not found or no entries by the id" });
      }

      userEntry.logout = true;

      // Save the updated userEntry
      await userEntry.save();

      res.json({
        message: "Logout successfully",
        success: true,
      });
    }
  } catch (error) {
    next(error);
  }
};
