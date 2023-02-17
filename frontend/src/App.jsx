import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import { action as editPostAction } from "./components/PostForm";
import AuthPage, { action as authAction } from "./pages/Auth";
import ErrorPage from "./pages/Error";
import HomePage, { loader as homeLoader } from "./pages/Home";
import LogoutPage, { action as logoutAction } from "./pages/Logout";
import PostAddPage from "./pages/PostAdd";
import PostDetailPage, {
  action as deletePostAction,
  loader as postDetailLoader,
} from "./pages/PostDetail";
import PostEditPage from "./pages/PostEdit";
import RootLayout from "./pages/Root";
import SearchPage from "./pages/Search";
import UserPage, {
  action as deleteUserAction,
  loader as userLoader,
} from "./pages/User";
import UserEditPage, { action as editUserAction } from "./pages/UserEdit";
import { checkAuthLoader, tokenLoader } from "./util/auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    id: "root",
    loader: tokenLoader,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: homeLoader,
      },
      {
        path: "posts/:id",
        id: "post-detail",
        loader: postDetailLoader,
        children: [
          {
            index: true,
            action: deletePostAction,
            element: <PostDetailPage />,
          },
          {
            path: "edit",
            action: editPostAction,
            loader: checkAuthLoader,
            element: <PostEditPage />,
          },
        ],
      },
      {
        path: "posts/new",
        action: editPostAction,
        loader: checkAuthLoader,
        element: <PostAddPage />,
      },
      {
        path: "auth",
        action: authAction,
        element: <AuthPage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "user/:nick",
        id: "user-detail",
        loader: userLoader,
        children: [
          {
            index: true,
            action: deleteUserAction,
            element: <UserPage />,
          },
          {
            path: "edit",
            action: editUserAction,
            loader: checkAuthLoader,
            element: <UserEditPage />,
          },
        ],
      },
      {
        path: "logout",
        action: logoutAction,
        element: <LogoutPage />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
