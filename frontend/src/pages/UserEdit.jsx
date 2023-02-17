import { redirect, useRouteLoaderData } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { getAccessToken, getUserId } from "../util/auth";

const UserEditPage = () => {
  const { user } = useRouteLoaderData("user-detail");

  return <AuthForm user={user} />;
};

export default UserEditPage;

export async function action({ request }) {
  const data = await request.formData();

  const authData = {
    nick: data.get("nick"),
    email: data.get("email"),
    password: data.get("password"),
  };

  if (authData.email && authData.password) {
    const userId = getUserId();
    const accessToken = getAccessToken();

    const response = await fetch("http://localhost:3000/user/" + userId, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify(authData),
    });

    if (response.status === 422 || response.status === 401) {
      return response;
    }

    if (!response.ok) {
      throw json({ message: "Something went wrong" }, { status: 500 });
    }

    const { token, user } = await response.json();
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 1);

    localStorage.setItem("token", token);
    localStorage.setItem("userId", user.id);
    localStorage.setItem("userName", user.nick);
    localStorage.setItem("expiration", expiration.toISOString());
  }

  return redirect("/user/me");
}
