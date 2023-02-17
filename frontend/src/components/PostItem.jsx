import { Link, useRouteLoaderData, useSubmit } from "react-router-dom";
import { getUserId } from "../util/auth";
import CommentForm from "./CommentForm";
import Comments from "./Comments";
import classes from "./css/PostItem.module.css";

function PostItem({ post }) {
  const submit = useSubmit();
  const token = useRouteLoaderData("root");
  const userId = getUserId();

  const date = new Date(post.date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  function deleteHandler() {
    const proceed = window.confirm("Are you sure?");

    if (proceed) {
      submit(null, { method: "DELETE" });
    }
  }

  if (post.comments === undefined) {
    post.comments = [];
  }

  function shareHandler() {
    navigator.clipboard.writeText("http://localhost:5173/posts/" + post.id);
  }

  return (
    <div className={classes.container}>
      <article className={classes.post}>
        <img src={post.image} alt={post.text} />
        <p>{post.text}</p>
        <time>{date}</time>
        <div className={classes.name}>@{post.creatorName}</div>
        <menu className={classes.actions}>
          <button onClick={shareHandler}>Share</button>
          {token && post.creator === userId && (
            <>
              <Link to="edit" className={classes.edit}>
                Edit
              </Link>
              <button onClick={deleteHandler}>Delete</button>
            </>
          )}
        </menu>
      </article>
      {token && <CommentForm postId={post.id} />}
      <Comments comments={post.comments} />
    </div>
  );
}

export default PostItem;
