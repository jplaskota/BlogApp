import { Outlet, redirect } from "react-router-dom";

const LogoutPage = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default LogoutPage;

export function action() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("expiration");
  localStorage.removeItem("userName");
  return redirect("/");
}
