import bcryptjs from "bcryptjs";
import { v4 as generateId } from "uuid";
import { NotFoundError } from "../util/errors.js";
import { readData, writeData } from "./util.js";

const saltRounds = 12;

export async function add(data) {
  const storedData = await readData();
  const userId = generateId();

  const hashedPw = await bcryptjs.hash(data.password, saltRounds);

  if (!storedData.users) {
    storedData.users = [];
  }

  storedData.users.push({ ...data, password: hashedPw, id: userId });
  await writeData(storedData);
  return { id: userId, email: data.email, nick: data.nick };
}

export async function get(email) {
  const storedData = await readData();
  if (!storedData.users || storedData.users.length === 0) {
    throw new NotFoundError("Could not find any users.");
  }

  const user = storedData.users.find((ev) => ev.email === email);
  if (!user) {
    throw new NotFoundError("Could not find user for email " + email);
  }

  return user;
}

export async function getByNick(nick) {
  const storedData = await readData();
  if (!storedData.users || storedData.users.length === 0) {
    throw new NotFoundError("Could not find any users.");
  }

  const user = storedData.users.find((ev) => ev.nick === nick);
  if (!user) {
    throw new NotFoundError("Could not find user for nick " + nick);
  }

  return user;
}

export async function getById(id) {
  const storedData = await readData();
  if (!storedData.users || storedData.users.length === 0) {
    throw new NotFoundError("Could not find any users.");
  }

  const user = storedData.users.find((ev) => ev.id === id);
  if (!user) {
    throw new NotFoundError("Could not find user for id " + id);
  }

  return user;
}

export async function replace(id, data) {
  const storedData = await readData();
  if (!storedData.users || storedData.users.length === 0) {
    throw new NotFoundError("Could not find any users.");
  }

  const index = storedData.users.findIndex((ev) => ev.id === id);
  if (index < 0) {
    throw new NotFoundError("Could not find user for id " + id);
  }

  const userId = storedData.users[index].id;
  const hashedPw = await bcryptjs.hash(data.password, saltRounds);

  const newData = {
    nick: data.nick,
    email: data.email,
    password: hashedPw,
    id: userId,
  };

  storedData.users[index] = { ...newData };

  await writeData(storedData);
}

export async function remove(id) {
  const storedData = await readData();
  const updatedData = storedData.users.filter((ev) => ev.id !== id);
  await writeData({ ...storedData, users: updatedData });
}
