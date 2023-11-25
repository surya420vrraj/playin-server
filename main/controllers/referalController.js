const Referal = require("../models/referalSchema");

exports.index = async (req, res, next) => {
  try {
    const customer = await Referal.find()
      .sort({ createdAt: -1 })
      .populate("createdBy");
    return res.json({
      message: "All customer data",
      success: true,
      data: customer,
    });
  } catch (e) {
    next(e);
  }
};

exports.addUser = async (req, res, next) => {
  try {
    let {
      userName,
      referal,
      comments,
      executeName,
      Inboundphone,
      Internalwhatsapp,
      externalwhatsapp,
      date,
      queryDate,
      query,
    } = req.body;

    let referalRecords = new Referal();
    referalRecords.userName = userName;
    referalRecords.referal = referal;
    referalRecords.comments = comments;
    referalRecords.executeName = executeName;
    referalRecords.Inboundphone = Inboundphone;
    referalRecords.Internalwhatsapp = Internalwhatsapp;
    referalRecords.externalwhatsapp = externalwhatsapp;
    referalRecords.date = date;
    referalRecords.query = query;
    referalRecords.queryDate = queryDate;
    referalRecords.createdBy = req.user.id;
    referalRecords = await referalRecords.save();
    res.json({
      message: "Referal added succesfully",
      success: true,
      data: referalRecords,
    });
  } catch (e) {
    next(e);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    let {
      userName,
      referal,
      comments,
      executeName,
      Inboundphone,
      Internalwhatsapp,
      externalwhatsapp,
      date,
      createdBy,
    } = req.body;
    let referalRecords = await Referal.findById(req.params.id);
    referalRecords.userName = userName;
    referalRecords.referal = referal;
    referalRecords.comments = comments;
    referalRecords.executeName = executeName;
    referalRecords.Inboundphone = Inboundphone;
    referalRecords.Internalwhatsapp = Internalwhatsapp;
    referalRecords.externalwhatsapp = externalwhatsapp;
    referalRecords.date = date;
    referalRecords.createdBy = createdBy;
    referalRecords = await referalRecords.save();

    res.json({
      message: "User updated succesfully",
      success: true,
      data: referalRecords,
    });
  } catch (e) {
    next(e);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { role } = req.user;
    if (role === 2) {
      const referal = Referal.findById(req.params.id);
      await referal.deleteOne();
      return res.json({
        message: "Customer record deleted succesfully",
        success: true,
      });
    } else {
      return res.json({
        message: "Only Super admin can delete this records",
        success: false,
      });
    }
  } catch (e) {
    next(e);
  }
};
