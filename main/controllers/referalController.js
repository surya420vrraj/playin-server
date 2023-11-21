const Referal = require("../models/referalSchema");

exports.index = async (req, res, next) => {
  try {
    const { role, id } = req.user;
    const customer = await Referal.find()
      .sort({ createdAt: -1 })
      .populate("createdBy");
    if (role === 2) {
      return res.json({
        message: "All customer data",
        success: true,
        data: customer,
      });
    } else if (role === 1) {
      const data = customer?.filter(
        (item) =>
          item?.createdBy?._id?.toString() === id || item.createdBy.role === 0
      );
      return res.json({
        message: "All admin and employee list data",
        success: true,
        data,
      });
    } else {
      const data = customer?.filter(
        (item) => item?.createdBy?._id?.toString() === id
      );
      return res.json({
        message: "My data customer",
        success: true,
        data,
      });
    }
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
    const referal = Referal.findById(req.params.id);
    await referal.deleteOne();
    res.json({ message: "Referal deleted succesfully", success: true });
  } catch (e) {
    next(e);
  }
};
