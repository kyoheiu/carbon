import { useParams } from "react-router-dom";
import { ItemProvider } from "../../contexts/ItremContext";
import { PageItem } from "../pageItem";

export const PageWrapper = () => {
  const { fileName } = useParams();
  if (!fileName) return null;

  return (
    <ItemProvider fileName={fileName}>
      <PageItem />
    </ItemProvider>
  );
};
