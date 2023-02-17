import express from "express";
import authRoutes from "./routes/auth.js";
import postsRoutes from "./routes/posts.js";
import userRouter from "./routes/users.js";

const app = express();
app.use(express.json());
const port = 3000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

app.use(authRoutes);

app.use("/posts", postsRoutes);

app.use("/user", userRouter);

app.use((error, res) => {
  const status = error.status || 500;
  const message = error.message || "Something went wrong.";
  res.status(status).json({ message: message });
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
