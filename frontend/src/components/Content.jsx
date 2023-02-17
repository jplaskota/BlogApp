import classes from "./css/Content.module.css";

const Content = ({ title, children }) => {
  return (
    <div className={classes.content}>
      <h1>{title}</h1>
      {children}
    </div>
  );
};

export default Content;
