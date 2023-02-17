import { Suspense } from "react";
import {
  Await,
  defer,
  json,
  redirect,
  useRouteLoaderData,
  useSubmit,
} from "react-router-dom";
import UserItem from "../components/UserItem";
import { getAccessToken, getUserId, getUserName } from "../util/auth";

const UserPage = () => {
  const { user } = useRouteLoaderData("user-detail");
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Await resolve={user}>
        {(loaded) => <UserItem user={loaded}></UserItem>}
      </Await>
    </Suspense>
  );
};

export default UserPage;

async function loadUser(nick) {
  const userNick = getUserName();
  let searchedUser = nick;

  if (nick === "me" || nick === "Me" || nick === "ME" || nick === "") {
    searchedUser = userNick;
  }

  const response = await fetch("http://localhost:3000/user/" + searchedUser);

  if (!response.ok) {
    throw json(
      { message: "Could not fetch user." },
      {
        status: 500,
      }
    );
  } else {
    const resData = await response.json();
    return resData;
  }
}

async function loadUserPosts(userId) {
  const token = await getAccessToken();
  const response = await fetch("http://localhost:3000/posts/user/" + userId, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

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

export async function loader({ params }) {
  return defer({
    user: await loadUser(params.nick),
    posts: await loadUserPosts(params.nick),
  });
}

export async function action({ request }) {
  const userId = await getUserId();
  const token = await getAccessToken();

  const response = await fetch("http://localhost:3000/user/" + userId, {
    method: request.method,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    throw json(
      { message: "Could not delete user." },
      {
        status: 500,
      }
    );
  }

  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("expiration");
  localStorage.removeItem("userName");

  return redirect("/");
}
