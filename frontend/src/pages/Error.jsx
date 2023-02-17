import { useRouteError } from "react-router-dom";
import Content from "../components/Content";
import Navigation from "../components/Navigation";

const ErrorPage = () => {
  const error = useRouteError();

  const title = "Error " + error.status;
  let message = error.statusText;

  if (error.data && error.data.message) {
    message = error.data.message;
  }

  return (
    <>
      <Navigation />
      <main>
        <Content title={title}>
          <p>{message}</p>
        </Content>
      </main>
    </>
  );
};

export default ErrorPage;
