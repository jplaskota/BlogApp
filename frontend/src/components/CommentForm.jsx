import { useState } from "react";
import { getAccessToken, getUserId } from "../util/auth";
import classes from "./css/CommentForm.module.css";

const CommentForm = ({ postId }) => {
  const [text, setText] = useState("");

  const clickHandler = async (e) => {
    e.preventDefault();
    const token = getAccessToken();
    const userId = getUserId();

    const data = {
      text: text,
      id: userId,
    };

    const res = await fetch("http://localhost:3000/posts/" + postId, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Something went wrong");
    }

    setText("");
  };

  return (
    <div className={classes.container}>
      <div className="bg-primary p">
        <h3>Leave a Comment</h3>
      </div>
      <form method="POST" className={classes.form}>
        <textarea
          name="text"
          cols="30"
          rows="5"
          placeholder="Comment on this post"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={classes.textarea}
          required
        ></textarea>
        <button onClick={clickHandler} className={classes.btn}>Send</button>
      </form>
    </div>
  );
};

export default CommentForm;
