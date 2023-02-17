import { json, redirect } from "react-router-dom";
import AuthForm from "../components/AuthForm";

const AuthPage = () => {
  return <AuthForm />;
};

export default AuthPage;

export async function action({ request }) {
  const mode = new URL(request.url).searchParams.get("mode") || "login";

  if (mode !== "login" && mode !== "signup") {
    throw json({ message: "Invalid mode" }, { status: 422 });
  }

  const data = await request.formData();
  const authData = {
    nick: data.get("nick"),
    email: data.get("email"),
    password: data.get("password"),
  };

  if (authData.email && authData.password) {
    const response = await fetch("http://localhost:3000/" + mode, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

  return redirect("/");
}
