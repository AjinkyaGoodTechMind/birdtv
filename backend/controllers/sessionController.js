const UserSchema = require("../schemas/userSchema");
const DomainSchema = require("../schemas/domainSchema");
const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const sessionController = {
  getSession: async (req, res, next) => {
    try {
      const user = req.user;
      let domains = await DomainSchema.find({ userId: user._id });
      res.json({ user, domains });
    } catch (error) {
      return next(createError.InternalServerError(error));
    }
  },

  register: async (req, res, next) => {
    try {
      const { username, email, password, domain, gaCode } = req.body;

      if (!email || !password) {
        res.status(400).send("Please Add ALL Fields");
      }

      const userExists = await UserSchema.findOne({ email }).lean();

      if (userExists) {
        res.status(400).send("User Already Exists");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      let userCount = await UserSchema.count();

      userCount = userCount + 1;

      const userCreated = await UserSchema.create({ email, password: hashedPassword, username });

      if (userCreated) {
        const domain1 = await DomainSchema.create({ userId: userCreated._id, domain, gaCode });
        const domains = [domain1];
        const accessToken = jwt.sign({ id: userCreated._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: process.env.SESSION_EXPIRE * 60 * 60 * 1000 });
        const user = userCreated;
        res.status(201).json({ user, domains });
      } else {
        res.status(400).send("Invalid User Data");
      }
    } catch (error) {
      return next(createError.InternalServerError(error));
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email) {
        res.status(400).send("Please Enter Email");
      }

      if (!password) {
        res.status(400).send("Please Password");
      }

      const user = await UserSchema.findOne({ email: email });

      if (user && (await bcrypt.compare(password, user.password))) {
        let domains = await DomainSchema.find({ userId: user._id });

        //Create JWT

        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.cookie("jwt", accessToken, { httpOnly: true });
        res.status(200).json({ user, domains });
      } else {
        res.status(400).json("Password Incorrect !!!");
      }
    } catch (error) {
      return next(createError.InternalServerError(error));
    }
  },

  logout: async (req, res, next) => {
    try {
      const cookies = req.cookies;
      if (!cookies?.jwt) {
        return res.sendStatus(204); //No Content
      }

      res.clearCookie("jwt", { httpOnly: true });
      res.sendStatus(204);
    } catch (error) {
      return next(createError.InternalServerError(error));
    }
  },

  addDomain: async (req, res, next) => {
    try {
      const domain = await DomainSchema.create({ userId: req.user._id, ...req.body });

      res.status(200).json(domain);
    } catch (error) {
      return next(createError.InternalServerError(error));
    }
  },
};

module.exports = sessionController;
