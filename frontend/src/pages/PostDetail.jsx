import { Suspense } from "react";
import {
  Await,
  defer,
  json,
  redirect,
  useRouteLoaderData,
} from "react-router-dom";
import PostItem from "../components/PostItem";
import { getAccessToken } from "../util/auth";

const PostDetailPage = () => {
  const { post } = useRouteLoaderData("post-detail");

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Await resolve={post}>{(loaded) => <PostItem post={loaded} />}</Await>
    </Suspense>
  );
};

export default PostDetailPage;

async function loadPost(id) {
  const response = await fetch(`http://localhost:3000/posts/${id}`);

  if (!response.ok) {
    throw json(
      { message: "Could not fetch post." },
      {
        status: 500,
      }
    );
  } else {
    const resData = await response.json();
    return resData.post;
  }
}

export async function loader({ params }) {
  return defer({
    post: await loadPost(params.id),
  });
}

export async function action({ params, request }) {
  const postId = params.id;
  const token = getAccessToken();

  const response = await fetch(`http://localhost:3000/posts/${postId}`, {
    method: request.method,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    throw json(
      { message: "Could not delete post." },
      {
        status: 500,
      }
    );
  }

  return redirect("/");
}
