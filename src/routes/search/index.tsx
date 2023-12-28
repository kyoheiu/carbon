import { useSearchParams } from "react-router-dom";
import { useSearch } from "./hooks";
import ItemList from "../../components/ItemList";

export const Search = () => {
  const [searchParams, _] = useSearchParams();
  const query = searchParams.get("q");
  if (!query) return null;

  const { items, hideItem } = useSearch(query);
  if (!items) return null;

  const props = { items: items, hideItem: hideItem };
  return (
    <>
      <div>Query: {query}</div>
      <ItemList {...props} />
    </>
  );
};
