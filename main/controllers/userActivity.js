const UserActivity = require("../models/userActivitySchema");
exports.logoutAllUsers = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    let dateRange = {
      $gte: new Date(new Date().setHours(0, 0, 0, 0)),
    };

    if (startDate && endDate) {
      const adjustedStarDate = new Date(
        new Date(startDate).setHours(0, 0, 0, 0)
      );
      const adjustedEndDate = new Date(
        new Date(endDate).setHours(23, 59, 59, 999)
      );
      dateRange = {
        $gte: adjustedStarDate,
        $lte: adjustedEndDate,
      };
    }

    const allUserEntries = await UserActivity.find({
      date: dateRange,
    }).populate("user");

    if (allUserEntries.length === 0) {
      return res
        .status(404)
        .json({ message: "No entries for the current day" });
    }
    let currentDate = new Date().toISOString().split("T")[0];
    // Use reduce for aggregation
    const workingHoursReport = Object.values(
      allUserEntries.reduce((result, entry) => {
        const userId = entry?.user?._id;
        const totalMilliseconds = entry.logoutTime
          ? entry.logoutTime - entry.loginTime
          : new Date() - entry.loginTime;
        const totalHours = Math.floor(totalMilliseconds / 3600000); // 1 hour = 3600000 milliseconds
        const totalMinutes = Math.floor((totalMilliseconds % 3600000) / 60000); // 1 minute = 60000 milliseconds

        if (!result[userId]) {
          result[userId] = {
            userId,
            userName: entry?.user?.userName,
            email: entry?.user?.email,
            totalLogin: 0,
            totalWorking: { hours: 0, minutes: 0 },
            currentDate,
            entries: [],
          };
        }

        // Update total login time, total working hours, and total working minutes for the user
        result[userId].totalLogin += 1; // Increment the total login count
        result[userId].totalWorking.hours += totalHours;
        result[userId].totalWorking.minutes += totalMinutes;

        // Add the entry to the user's entries array
        result[userId].entries.push({
          date: entry.date,
          workingHours: { hours: totalHours, minutes: totalMinutes },
          entryId: entry._id,
        });

        return result;
      }, {})
    );

    res.json({
      workingHoursReport,
      message: "All users working hours report",
    });
  } catch (error) {
    next(error);
  }
};

exports.logoutSingleUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { startDate, endDate } = req.query;

    let dateRange = {
      $gte: new Date(new Date().setHours(0, 0, 0, 0)),
    };

    if (startDate && endDate) {
      const adjustedStarDate = new Date(
        new Date(startDate).setHours(0, 0, 0, 0)
      );
      const adjustedEndDate = new Date(
        new Date(endDate).setHours(23, 59, 59, 999)
      );
      dateRange = {
        $gte: adjustedStarDate,
        $lte: adjustedEndDate,
      };
    }

    const userEntries = await UserActivity.find({
      user: userId,
      date: dateRange,
    }).populate("user");

    if (userEntries.length === 0) {
      return res
        .status(404)
        .json({ message: `No entries for user with ID ${userId}` });
    }

    let currentDate = new Date().toISOString().split("T")[0];

    const workingHoursReport = Object.values(
      userEntries.reduce((result, entry) => {
        const totalMilliseconds = entry.logoutTime
          ? entry.logoutTime - entry.loginTime
          : new Date() - entry.loginTime;
        const totalHours = Math.floor(totalMilliseconds / 3600000); // 1 hour = 3600000 milliseconds
        const totalMinutes = Math.floor((totalMilliseconds % 3600000) / 60000); // 1 minute = 60000 milliseconds

        if (!result[userId]) {
          result[userId] = {
            userId,
            userName: entry?.user?.userName,
            email: entry?.user?.email,
            totalLogin: 0,
            totalWorking: { hours: 0, minutes: 0 },
            currentDate,
            entries: [],
          };
        }

        // Update total login time, total working hours, and total working minutes for the user
        result[userId].totalLogin += 1; // Increment the total login count
        result[userId].totalWorking.hours += totalHours;
        result[userId].totalWorking.minutes += totalMinutes;

        // Add the entry to the user's entries array
        result[userId].entries.push({
          date: entry.date,
          workingHours: { hours: totalHours, minutes: totalMinutes },
          entryId: entry._id,
        });

        return result;
      }, {})
    );

    res.json({
      workingHoursReport,
      message: `User working hours report for user with ID ${userId}`,
    });
  } catch (error) {
    next(error);
  }
};

exports.allUserActivity = async (req, res, next) => {
  try {
    const { role, id } = req.user;
    const data = await UserActivity.find()
      .populate("user")
      .sort({ createdAt: -1 });
    if (role === 2) {
      return res.json({ message: "All user data", data, success: true });
    } else if (role === 1) {
      const adminData = data?.filter((item) => {
        return item?.user?._id.toString() === id || item.user.role === 0;
      });
      return res.json({
        message: "your request and emplyee request",
        success: true,
        data: adminData,
      });
    } else {
      const empData = data?.filter((item) => {
        return item?.user?._id.toString() === id;
      });
      return res.json({
        message: "your request data",
        success: true,
        data: empData,
      });
    }
  } catch (e) {
    next(e);
  }
};
