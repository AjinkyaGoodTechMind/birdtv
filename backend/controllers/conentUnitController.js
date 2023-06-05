const UserSchema = require("../schemas/userSchema");
const VideoSchema = require("../schemas/videoSchema");
const PlaylistSchema = require("../schemas/playlistSchema");
const ContentUnitSchema = require("../schemas/contentUnitSchema");
const createError = require("http-errors");
const bcrypt = require("bcryptjs");

const conentUnitController = {
  getConentUnitById: async (req, res, next) => {
    try {
      const contentUnit = await ContentUnitSchema.find({ _id: req.body.contentUnitId }).populate("playlist").populate("player");

      res.status(200).json(contentUnit);
    } catch (error) {
      return next(createError.InternalServerError(error));
    }
  },

  getConentUnit: async (req, res, next) => {
    try {
      const { domain } = req.query;

      if (domain) {
        const contentUnit = await ContentUnitSchema.find({ domain: domain }).populate("playlist").populate("player");
        res.status(200).json(contentUnit);
      } else {
        const contentUnit = await ContentUnitSchema.find({ userId: req.user._id }).populate("playlist").populate("player");
        res.status(200).json(contentUnit);
      }
    } catch (error) {
      return next(createError.InternalServerError(error));
    }
  },

  postConentUnit: async (req, res, next) => {
    try {
      const contentUnit = await ContentUnitSchema.create({ userId: req.user._id, ...req.body });

      res.status(200).json(contentUnit);
    } catch (error) {
      return next(createError.InternalServerError(error));
    }
  },

  updateConentUnit: async (req, res, next) => {
    try {
      const contentUnit = await ContentUnitSchema.findOneAndUpdate({ _id: req.body.unitId }, { $set: { ...req.body } });

      res.status(200).json(contentUnit);
    } catch (error) {
      return next(createError.InternalServerError(error));
    }
  },

  deleteConentUnit: async (req, res, next) => {
    try {
      const contentUnit = await ContentUnitSchema.findOneAndDelete({ _id: req.body.id });

      res.status(200).json(contentUnit);
    } catch (error) {
      return next(createError.InternalServerError(error));
    }
  },
};

module.exports = conentUnitController;
