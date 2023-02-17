import { redirect } from "react-router-dom";

export function getAccessToken() {
  const tokenDuration = getTokenDuration();

  if (tokenDuration && tokenDuration <= 0) {
    return "expired";
  }

  return localStorage.getItem("token");
}

export function getUserId() {
  return localStorage.getItem("userId");
}

export function getUserName() {
  return localStorage.getItem("userName");
}

export function tokenLoader() {
  return getAccessToken();
}

export function checkAuthLoader() {
  const token = getAccessToken();

  if (!token) {
    return redirect("/auth");
  }

  return null;
}

export function getTokenDuration() {
  const storedExpirationDate = localStorage.getItem("expiration");

  if (!storedExpirationDate) {
    return null;
  }

  const expirationDate = new Date(storedExpirationDate);
  const now = new Date();
  const duration = expirationDate.getTime() - now.getTime();

  return duration;
}
