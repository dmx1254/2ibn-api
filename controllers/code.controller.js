const CodeModel = require("../modals/code.models");

//Model who stock all my codes sending users for checking ater
module.exports.getAllCodes = async (req, res) => {
  try {
    const codes = await CodeModel.find();
    res.status(200).send(codes);
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports.findSingleCode = async (req, res) => {
  const { code } = req.params;

  try {
    const codeFind = await CodeModel.findOne({ code: code });
    if (!codeFind)
      return res
        .status(500)
        .json({ codeError: "The code you entered is invalid" });
    res.status(200).json(codeFind);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.createCode = async (req, res) => {
  const { code } = req.body;

  try {
    const codeCreated = await CodeModel.create({ code });
    res.status(200).json(codeCreated);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

module.exports.deleteAllCodes = async (req, res) => {
  const { code } = req.body;

  try {
    await CodeModel.deleteMany();
    res.status(200).json({ message: "All codes were deleted" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
