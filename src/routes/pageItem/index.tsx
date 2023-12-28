import { useParams } from "react-router-dom";
import { useItem } from "../../ItremContext";
import { ViewItem } from "../../components/ViewItem";
import { EditItem } from "../../components/EditItem";
import { useEffect } from "react";

export const PageItem = () => {
  const { fileName } = useParams();
  const { isLoading, useFetchItem, item, isEditMode } = useItem();

  useEffect(() => {
    useFetchItem(fileName as string);
  }, []);

  if (!item || isLoading) return <h1>NOW LOADING...</h1>;
  return <>{isEditMode ? <EditItem /> : <ViewItem />}</>;
};
