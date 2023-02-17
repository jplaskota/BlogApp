import { useState } from "react";
import { Link, useRouteLoaderData, useSubmit } from "react-router-dom";
import { getAccessToken } from "../util/auth";
import PostsGallery from "./PostsGallery";
import classes from "./css/UserItem.module.css";

const UserItem = ({ user }) => {
  const submit = useSubmit();
  const { posts } = useRouteLoaderData("user-detail");

  const submitHandler = () => {
    const proceed = window.confirm("Are you sure?");

    if (proceed) {
      submit(null, { method: "DELETE" });
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.user}>
        <div>
          <h1>{user.nick}</h1>
          <h2>{user.email}</h2>
          <h4>{user.id}</h4>
        </div>
        <nav>
          <Link to="edit" className={classes.btn}>
            Edit
          </Link>
          <button onClick={submitHandler}>Delete</button>
        </nav>
      </div>
      <PostsGallery posts={posts} />
    </div>
  );
};

export default UserItem;
