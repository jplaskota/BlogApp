import classes from "./css/Comments.module.css";

const Comments = ({ comments }) => {
  return (
    <div className={classes.container}>
      <ul className={classes.list}>
        {comments.map((comment) => (
          <li key={comment.id} className={classes.item}>
            <h5>{comment.creator}</h5>
            <h2>{comment.text}</h2>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;
