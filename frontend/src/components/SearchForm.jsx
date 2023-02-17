import { useState } from "react";
import { json } from "react-router-dom";
import { getAccessToken } from "../util/auth";
import PostsGallery from "./PostsGallery";
import classes from "./css/SearchForm.module.css";

const SearchForm = () => {
  const [value, setValue] = useState("");
  const [posts, setPosts] = useState([]);

  const changeHandler = (event) => {
    setValue(event.target.value);
  };

  const searchHandler = async (value) => {
    const token = await getAccessToken();

    const response = await fetch(
      "http://localhost:3000/posts/search/" + value,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    if (!response.ok) {
      throw json(
        { message: "Could not fetch posts." },
        {
          status: 500,
        }
      );
    } else {
      const resData = await response.json();
      setPosts(resData.posts);
    }
  };

  return (
    <div className={classes.container}>
      <input
        type="text"
        placeholder="Search"
        value={value}
        onChange={changeHandler}
        className={classes.search}
      />
      <button onClick={() => searchHandler(value)} className={classes.btn}>
        Search
      </button>
      <PostsGallery posts={posts} />
    </div>
  );
};

export default SearchForm;
