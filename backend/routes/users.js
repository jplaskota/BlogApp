import express from "express";

import { get, getById, getByNick, remove, replace } from "../data/user.js";
import { checkAuth, createJSONToken } from "../util/auth.js";
import {
  isValidDate,
  isValidEmail,
  isValidImageUrl,
  isValidText,
} from "../util/validation.js";

const router = express.Router();

router.get("/:nick", async (req, res, next) => {
  try {
    const user = await getByNick(req.params.nick);
    res.json({ nick: user.nick, email: user.email, id: user.id });
  } catch (error) {
    next(error);
  }
});

router.use(checkAuth);

router.patch("/:id", async (req, res, next) => {
  const data = req.body;

  let errors = {};

  if (!isValidText(data.nick)) {
    errors.nick = "Invalid nick.";
  } else {
    try {
      const existingUser = await getByNick(data.nick);
      if (existingUser && existingUser.id !== req.params.id) {
        errors.nick = "Nick exists already.";
      }
    } catch (error) {}
  }

  if (!isValidEmail(data.email)) {
    errors.email = "Invalid email.";
  } else {
    try {
      const existingUser = await get(data.email);
      if (existingUser && existingUser.id !== req.params.id) {
        errors.email = "Email exists already.";
      }
    } catch (error) {}
  }

  if (!isValidText(data.password, 6)) {
    errors.password = "Invalid password. Must be at least 6 characters long.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "User signup failed due to validation errors.",
      errors,
    });
  }

  try {
    await replace(req.params.id, data);
    const newData = await getById(req.params.id);
    const token = createJSONToken(data.email);
    res.json({ message: "User updated.", user: newData, token });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await remove(req.params.id);
    res.json({ message: "User deleted." });
  } catch (error) {
    next(error);
  }
});

export default router;
