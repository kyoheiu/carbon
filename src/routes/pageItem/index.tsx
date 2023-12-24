import { useParams } from "react-router-dom";
import { useItem } from "./hooks";

export const PageItem = () => {
  const { fileName } = useParams();
  const { item, setItem } = useItem(fileName ?? "");

  if (!item) return <h1>File does not exist.</h1>;
  return (
    <>
      <div>{item.title}</div>
      <div>{item.content}</div>
    </>
  );
};
