import { useParams } from "react-router-dom";
import { useItem } from "./hooks";
import { ViewItem } from "../../components/ViewItem";
import { EditItem } from "../../components/EditItem";

export const PageItem = () => {
  const { fileName } = useParams();
  const {
    isLoading,
    item,
    currentValue,
    setCurrentValue,
    handleSave,
    isEditMode,
    toggleEditMode,
  } = useItem(fileName ?? "");

  if (!item || isLoading) return <h1>NOW LOADING...</h1>;

  const viewProps = {
    item: item,
    currentValue: currentValue,
    toggleEditMode: toggleEditMode,
  };
  const editProps = {
    item: item,
    currentValue: currentValue,
    setCurrentValue: setCurrentValue,
    handleSave: handleSave,
    toggleEditMode: toggleEditMode,
  };
  return isEditMode ? <EditItem {...editProps} /> : <ViewItem {...viewProps} />;
};
