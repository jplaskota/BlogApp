import { v4 as generateId } from "uuid";

import { NotFoundError } from "../util/errors.js";
import { readData, writeData } from "./util.js";
import { getById } from "./user.js";

async function getCreator(id) {
  const storedData = await readData();
  if (!storedData.users || storedData.users.length === 0) {
    throw new NotFoundError("Could not find any users.");
  }

  const user = storedData.users.find((ev) => ev.id === id);
  if (!user) {
    throw new NotFoundError("Could not find user for id " + id);
  }

  return user.nick;
}

export async function getAll() {
  const storedData = await readData();
  if (!storedData.posts) {
    throw new NotFoundError("Could not find any posts.");
  }

  storedData.posts.forEach(async (post) => {
    let creator = await getCreator(post.creator);
    if (!creator) creator = "Unknown User (Deleted)";
    post = { ...post, creatorName: creator };
  });

  return storedData.posts;
}

export async function get(id) {
  const storedData = await readData();
  if (!storedData.posts || storedData.posts.length === 0) {
    throw new NotFoundError("Could not find any posts.");
  }

  const post = storedData.posts.find((ev) => ev.id === id);
  if (!post) {
    throw new NotFoundError("Could not find post for id " + id);
  }

  const creator = await getCreator(post.creator);

  if (!creator) {
    post.creatorName = "Unknown User (Deleted)";
  } else {
    post.creatorName = creator;
  }

  return post;
}

export async function add(data) {
  const storedData = await readData();
  storedData.posts.unshift({
    ...data,
    id: generateId(),
    date: new Date(),
    comments: [],
  });
  await writeData(storedData);
}

export async function addComment(data, id) {
  const storedData = await readData();
  const index = storedData.posts.findIndex((ev) => ev.id === id);

  if (!storedData.posts[index].comments) storedData.posts[index].comments = [];

  storedData.posts[index].comments.unshift({
    text: data.text,
    creator: data.id,
    id: generateId(),
    date: new Date(),
  });
  await writeData(storedData);
}

export async function replace(id, data) {
  const storedData = await readData();
  if (!storedData.posts || storedData.posts.length === 0) {
    throw new NotFoundError("Could not find any posts.");
  }

  const index = storedData.posts.findIndex((ev) => ev.id === id);
  if (index < 0) {
    throw new NotFoundError("Could not find post for id " + id);
  }

  const oldPost = storedData.posts[index];

  storedData.posts[index] = {
    ...data,
    id,
    date: oldPost.date,
  };

  await writeData(storedData);
}

export async function remove(id) {
  const storedData = await readData();
  const updatedData = storedData.posts.filter((ev) => ev.id !== id);
  await writeData({ ...storedData, posts: updatedData });
}

export async function removeComment(id) {
  const storedData = await readData();
  const updatedData = storedData.posts.map((post) => {
    if (post.comments) {
      post.comments = post.comments.filter((comment) => comment.id !== id);
    }
    return post;
  });
  await writeData({ ...storedData, posts: updatedData });
}
