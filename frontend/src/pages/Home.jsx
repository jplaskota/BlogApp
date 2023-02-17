import { Suspense } from "react";
import { Await, defer, json, useLoaderData } from "react-router-dom";
import PostsGallery from "../components/PostsGallery";

const HomePage = () => {
  const { posts } = useLoaderData();

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Await resolve={posts}>
        {(loadedPosts) => <PostsGallery posts={loadedPosts} />}
      </Await>
    </Suspense>
  );
};

export default HomePage;

async function loadPosts() {
  const response = await fetch("http://localhost:3000/posts");

  if (!response.ok) {
    throw json(
      { message: "Could not fetch posts." },
      {
        status: 500,
      }
    );
  } else {
    const resData = await response.json();
    return resData.posts;
  }
}

export function loader() {
  return defer({
    posts: loadPosts(),
  });
}
