const User = require("../models/userSchema");
const bcryptJS = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserActivity = require("../models/userActivitySchema");

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
      const date = new Date();

      // Create a new user activity entry
      const userActivity = new UserActivity({
        loginTime: date.toLocaleString("en-US", {
          timeZone: "Asia/Dubai",
        }),
        user: user.id,
      });
      const loggindetails = await userActivity.save();
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
  const { loggindetails } = req.user;
  try {
    const userEntry = await UserActivity.findById(loggindetails._id);

    if (Object.keys(userEntry).length === 0) {
      return res
        .status(404)
        .json({ message: "User not found or no entries by the id" });
    }

    // Assuming loginTime is stored in userEntry
    const loginTime = new Date(userEntry.loginTime);

    // Set logoutTime to the current time in "Asia/Dubai" timezone
    const logoutTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Dubai",
    });

    // Calculate time difference
    const timeDifference = new Date(logoutTime) - loginTime;

    // Convert time difference to hours and minutes
    const totalHours = Math.floor(timeDifference / (1000 * 60 * 60));
    const totalMinutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );

    // Update userEntry with total hours and minutes
    userEntry.totalHours = { hours: totalHours, minutes: totalMinutes };

    // Update logoutTime
    userEntry.logoutTime = logoutTime;

    // Save the updated userEntry
    await userEntry.save();

    res.json({
      totalWorking: { hours: totalHours, minutes: totalMinutes },
      message: "Logout successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
