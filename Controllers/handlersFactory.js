const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiErrors");
const ApiFeatures = require("../utils/ApiFeature");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findOneAndDelete({ _id: id });
    if (!document)
      return next(new ApiError(`No ${Model} for this id ${id}`, 404));
    res.status(204).send();
  });
exports.getOne = (Model, populationOpts) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const query = Model.findById(id);
    if (populationOpts) {
      query.populate(populationOpts);
    }
    const document = await query;
    if (!document)
      return next(new ApiError(`No ${Model} for this id ${id}`, 404));
    res.status(200).json({ data: document });
  });
exports.getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res, next) => {
    let filter = {};
    if (req.filterObject) {
      filter = req.filterObject;
    }

    const documentCount = await Model.countDocuments();
    const { query, paginationResults } = new ApiFeatures(
      Model.find(filter),
      req.query
    )
      .paginate(documentCount)
      .sort()
      .limitFields()
      .search(`${modelName}`);
    const document = await query;
    res.status(200).json({
      results: document.length,
      data: document,
      paginationResults,
    });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    if (!document)
      return next(new ApiError(`No ${Model} for this id ${id}`, 404));
    document.save();
    res.status(200).json({ data: document });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });
