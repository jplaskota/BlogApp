import express from "express";

import { add, addComment, get, getAll, remove, replace } from "../data/post.js";
import { getByNick } from "../data/user.js";
import { checkAuth } from "../util/auth.js";
import {
  isValidDate,
  isValidEmail,
  isValidImageUrl,
  isValidText,
} from "../util/validation.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const posts = await getAll();
    res.json({ posts: posts });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const post = await get(req.params.id);
    res.json({ post: post });
  } catch (error) {
    next(error);
  }
});

router.get("/search/:text", async (req, res, next) => {
  try {
    const posts = await getAll();
    const filteredPosts = posts.filter((post) =>
      post.text.includes(req.params.text)
    );
    res.json({ posts: filteredPosts });
  } catch (error) {
    next(error);
  }
});

router.get("/user/:nick", async (req, res, next) => {
  try {
    const user = await getByNick(req.params.nick);
    const posts = await getAll();
    const filteredPosts = posts.filter((post) => post.creator === user.id);
    res.json({ posts: filteredPosts });
  } catch (error) {
    next(error);
  }
});

router.use(checkAuth);

router.post("/", async (req, res, next) => {
  const data = req.body;

  let errors = {};

  if (!isValidText(data.text)) {
    errors.title = "Invalid title.";
  }

  if (!isValidImageUrl(data.image)) {
    errors.image = "Invalid image.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "Adding the post failed due to validation errors.",
      errors,
    });
  }

  try {
    await add(data);
    res.status(201).json({ message: "Post saved.", post: data });
  } catch (error) {
    next(error);
  }
});

router.post("/:id", async (req, res, next) => {
  const data = await req.body;

  let errors = {};

  if (!isValidText(data.text)) {
    errors.title = "Invalid title.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "Adding the post failed due to validation errors.",
      errors,
    });
  }

  try {
    await addComment(data, req.params.id);
    res.status(201).json({ message: "Comment saved.", Comment: data });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  const data = req.body;

  let errors = {};

  if (!isValidText(data.text)) {
    errors.text = "Invalid text.";
  }

  if (!isValidImageUrl(data.image)) {
    errors.image = "Invalid image.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "Updating the post failed due to validation errors.",
      errors,
    });
  }

  try {
    await replace(req.params.id, data);
    res.json({ message: "Post updated.", post: data });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await remove(req.params.id);
    res.json({ message: "Post deleted." });
  } catch (error) {
    next(error);
  }
});

router.delete("/comment/:id", async (req, res, next) => {
  try {
    await remove(req.params.id);
    res.json({ message: "Comment deleted." });
  } catch (error) {
    next(error);
  }
});

export default router;
