import { useParams } from "react-router-dom";
import { useItem } from "../../contexts/ItremContext";
import { ViewItem } from "../../components/ViewItem";
import { EditItem } from "../../components/EditItem";
import { useEffect } from "react";
import { Skeleton } from "primereact/skeleton";

export const PageItem = () => {
  const { fileName } = useParams();
  const isMarkdown = fileName?.split(".").at(-1) === "md" ? true : false;

  const { isLoading, useFetchItem, item, isEditMode } = useItem();

  useEffect(() => {
    useFetchItem(fileName as string);
  }, []);

  if (!item || isLoading)
    return (
      <>
        <Skeleton className="mb-2"></Skeleton>
        <Skeleton width="10rem" className="mb-2"></Skeleton>
        <Skeleton width="5rem" className="mb-2"></Skeleton>
        <Skeleton height="2rem" className="mb-2"></Skeleton>
        <Skeleton width="10rem" height="4rem"></Skeleton>
      </>
    );
  return (
    <div className="flex flex-col justify-center w-screen px-2 rounded sm:w-120 md:w-144">
      {isEditMode ? <EditItem /> : <ViewItem isMarkdown={isMarkdown} />}
    </div>
  );
};
