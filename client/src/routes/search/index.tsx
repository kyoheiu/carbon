import { useSearchParams } from "react-router-dom";
import { useSearch } from "./hooks";
import ItemList from "../../components/ItemList";

export const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const { items, hideItem } = useSearch(query);
  if (!items) return null;

  const props = { items: items, hideItem: hideItem };
  return (
    <div className="flex flex-col items-center">
      <div>Query: {query}</div>
      <ItemList {...props} />
    </div>
  );
};
