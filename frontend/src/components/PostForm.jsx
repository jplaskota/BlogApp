import {
  Form,
  json,
  redirect,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import { getAccessToken, getUserId, getUserName } from "../util/auth";
import classes from "./css/PostForm.module.css";

function PostForm({ method, post }) {
  const data = useActionData();
  const navigate = useNavigate();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  function cancelHandler() {
    navigate("..");
  }

  return (
    <Form method={method} className={classes.form}>
      {data && data.errors && (
        <ul>
          {Object.values(data.errors).map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      )}
      <p>
        <label htmlFor="text">Text</label>
        <textarea
          id="text"
          type="text"
          name="text"
          required
          defaultValue={post ? post.text : ""}
        />
      </p>
      <p>
        <label htmlFor="image">Image URL</label>
        <input
          id="image"
          type="url"
          name="image"
          required
          defaultValue={post ? post.image : ""}
        />
      </p>
      <input type="hidden" id="userId" value={post ? post.userId : ""}></input>
      <div className={classes.actions}>
        <button type="button" onClick={cancelHandler} disabled={isSubmitting}>
          Cancel
        </button>
        <button disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Add"}
        </button>
      </div>
    </Form>
  );
}

export default PostForm;

export async function action({ params, request }) {
  const method = request.method;
  const data = await request.formData();
  const userId = getUserId();

  const postData = {
    text: data.get("text"),
    image: data.get("image"),
    creator: userId,
  };

  let url = "http://localhost:3000/posts";

  if (method === "PATCH") {
    url = "http://localhost:3000/posts/" + params.id;
  }

  const token = getAccessToken();

  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    throw json({ message: "Could't add post." }, { status: 500 });
  }

  return redirect("/");
}
