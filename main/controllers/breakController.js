const Break = require("../models/breakSchema");
exports.applybreak = async (req, res, next) => {
  try {
    const { breakType, reason, start, end } = req.body;
    const { id } = req.user;
    const breakData = {
      breakType,
      reason,
      start,
      end,
      user: id,
    };
    const startTime = new Date(`2023-01-01T${start}`);
    const endTime = new Date(`2023-01-01T${end}`);
    if (startTime >= endTime) {
      return res.json({
        success: false,
        message: `${end} end must greater than start time:${start}`,
      });
    }

    const breakInstance = new Break(breakData);
    const savedBreak = await breakInstance.save();

    // const userEmail = "pro2000a1@gmail.com";
    // const emailSubject = "Break Created";
    // const emailTemplateData = { userName: "New User", status: "Approved" };

    // EmailUtils.sendEmail(
    //   userEmail,
    //   emailSubject,
    //   "approvalStatus",
    //   emailTemplateData
    // );

    res.status(201).json({
      success: true,
      message: "Break request created succesfully",
      data: savedBreak,
    });
  } catch (error) {
    next(error);
  }
};

exports.allBreaksbystaus = async (req, res, next) => {
  const { param } = req.params;
  const { role, id } = req.user;
  try {
    let breaks;
    if (!param || param === "all") {
      breaks = await Break.find()
        .populate({
          path: "user approvedBy",
          model: "user",
        })
        .sort({ createdAt: -1 });
    } else if (
      param === "approved" ||
      param === "rejected" ||
      param === "pending"
    ) {
      breaks = await Break.find({ status: param })
        .populate({
          path: "user approvedBy",
          model: "user",
        })
        .sort({ createdAt: -1 });
    }

    if (role === 2) {
      return res.json({
        message: "All request data",
        success: true,
        data: breaks,
      });
    } else if (role === 1) {
      const data = breaks.filter((item) => {
        return item.user._id.toString() === id || item.user.role === 0;
      });
      return res.json({
        message: "your request and emplyee request",
        success: true,
        data,
      });
    } else {
      const data = breaks.filter((item) => {
        return item.user._id.toString() === id;
      });
      return res.json({
        message: "your request data",
        success: true,
        data,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.breakAction = async (req, res, next) => {
  try {
    const { approvedBy } = req.body;
    const { action } = req.query;
    const { role, id } = req.user;
    const data = await Break.findById(req.params.id).populate({
      path: "user approvedBy",
      model: "user",
    });
    if (role === 0) {
      return res.status(201).json({
        success: false,
        message: `Employee dont have permisson for perfoming this action`,
        data,
      });
    } else if (data.user._id.toString() === id) {
      return res.status(201).json({
        success: false,
        message: `you cant perfom this action,same user cant approve/reject`,
        data,
      });
    } else if (data.user.role === 1 && role === 1) {
      return res.status(201).json({
        success: false,
        message: `this file created by admin,so only approved by super admin`,
        data,
      });
    } else if (data.user.role === 2 && role === 1) {
      return res.status(201).json({
        success: false,
        message: `this file created by super admin,so only approved by super admin`,
        data,
      });
    } else {
      data.status = action;
      data.approved = true;
      data.approvedBy = approvedBy;
      await data.save();
      return res.status(201).json({
        success: true,
        message: `Request has been ${action} successfully`,
        data,
      });
    }
  } catch (error) {
    next(error);
  }
};
