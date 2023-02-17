import { useEffect } from "react";
import { Outlet, useLoaderData, useSubmit } from "react-router-dom";
import Navigation from "../components/Navigation";
import { getTokenDuration } from "../util/auth";

const RootLayout = () => {
  const token = useLoaderData();
  const submit = useSubmit();

  useEffect(() => {
    if (!token) {
      return;
    }

    if (token === "expired") {
      submit(null, { action: "/logout", method: "POST" });
    }

    const duration = getTokenDuration();

    setTimeout(() => {
      submit(null, { action: "/logout", method: "POST" });
    }, duration);
  }, [token]);

  return (
    <>
      <Navigation />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
