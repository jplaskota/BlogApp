import { useRouteLoaderData } from "react-router-dom";
import PostForm from "../components/PostForm";

const PostEditPage = () => {
  const data = useRouteLoaderData("post-detail");

  return <PostForm method="PATCH" post={data.post} />;
};

export default PostEditPage;
