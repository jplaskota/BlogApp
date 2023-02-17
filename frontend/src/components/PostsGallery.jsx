import { Link } from "react-router-dom";
import classes from "./css/PostsGallery.module.css";

const PostsGallery = ({ posts }) => {
  return (
    <div className={classes.container}>
      {posts.map((post) => (
        <Link to={`/posts/${post.id}`} className={classes.link} key={post.id}>
          <div className={classes.post}>
            <p>{post.text}</p>
            <img src={post.image} alt={post.text} />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PostsGallery;
