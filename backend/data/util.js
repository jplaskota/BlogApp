import fs from "node:fs/promises";

export async function readData() {
  const data = await fs.readFile("posts.json", "utf8");
  return JSON.parse(data);
}

export async function writeData(data) {
  await fs.writeFile("posts.json", JSON.stringify(data));
}
