import { useParams } from "react-router-dom";
import { useItem } from "./hooks";
import { ViewItem } from "../../components/ViewItem";

export const PageItem = () => {
  const { fileName } = useParams();
  const { item, setItem, isEditMode, getEditMode } = useItem(fileName ?? "");

  if (!item) return <h1>File does not exist.</h1>;

  const props = { item: item, getEditMode: getEditMode };
  if (isEditMode) {
    return <div>Edit Mode</div>;
  } else {
    return <ViewItem {...props} />;
  }
};
