import { Form, NavLink, useRouteLoaderData } from "react-router-dom";
import { getUserName } from "../util/auth";
import classes from "./css/Navigation.module.css";

const Navigation = () => {
  const token = useRouteLoaderData("root");
  const userName = getUserName();

  return (
    <header className={classes.header}>
      <nav>
        <ul className={classes.list}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/search"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              Search
            </NavLink>
          </li>
          {token && (
            <li>
              <NavLink
                to="/posts/new"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                Add Posts
              </NavLink>
            </li>
          )}
        </ul>
        <ul className={classes.list}>
          {token && (
            <li>
              <NavLink
                to={"/user/" + userName}
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                @{userName}
              </NavLink>
            </li>
          )}
          {!token && (
            <li>
              <NavLink
                to="/auth?mode=login"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                Log in / Sign up
              </NavLink>
            </li>
          )}
          {token && (
            <li>
              <Form action="/logout" method="post">
                <button>Logout</button>
              </Form>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navigation;
