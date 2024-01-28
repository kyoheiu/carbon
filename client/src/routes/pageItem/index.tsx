import { useParams } from "react-router-dom";
import { useItem } from "../../contexts/ItremContext";
import { ViewItem } from "../../components/ViewItem";
import { EditItem } from "../../components/EditItem";
import { NotFound } from "../../components/NotFound";

export const PageItem = () => {
  const { fileName } = useParams();
  const isMarkdown = fileName?.split(".").at(-1) === "md" ? true : false;
  const { item, isEditMode } = useItem();

  if (!item) return <NotFound fileName={fileName} />;

  return (
    <div className="flex flex-col justify-center px-2 w-screen rounded sm:w-120 md:w-160">
      {isEditMode ? <EditItem /> : <ViewItem isMarkdown={isMarkdown} />}
    </div>
  );
};
