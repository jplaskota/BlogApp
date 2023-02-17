import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useSearchParams,
} from "react-router-dom";

import classes from "./css/AuthForm.module.css";

const AuthForm = ({ user }) => {
  const data = useActionData();
  const nav = useNavigation();

  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") === "login";
  const isSubmitting = nav.state === "submitting";

  return (
    <>
      <Form method="post" className={classes.form}>
        <h1>{isLogin ? "Log in" : "Create a new user"}</h1>
        {data && data.message && (
          <ul>
            {Object.values(data.errors).map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        )}
        {!isLogin && (
          <p>
            <label htmlFor="nick">Nickname</label>
            <input
              id="nick"
              type="text"
              name="nick"
              required
              defaultValue={user && user.nick}
            />
          </p>
        )}
        <p>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            required
            defaultValue={user && user.email}
          />
        </p>
        <p>
          <label htmlFor="image">Password</label>
          <input id="password" type="password" name="password" required />
        </p>
        <div className={classes.actions}>
          {!user && (
            <Link
              className={classes.btn}
              to={`?mode=${isLogin ? "signup" : "login"}`}
            >
              {isLogin ? "Create new user" : "Login"}
            </Link>
          )}
          <button disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Save"}
          </button>
        </div>
      </Form>
    </>
  );
};

export default AuthForm;
