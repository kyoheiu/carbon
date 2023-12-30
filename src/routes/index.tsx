import { useApp } from "../hooks";
import ItemList from "../components/ItemList";

const Index = () => {
  const { items, hideItem, more, setMore, readAll } = useApp();
  if (!items) return null;
  const props = { items: items, hideItem: hideItem };
  return (
    <div className="flex flex-col items-center">
      <ItemList {...props} />
      {more && (
        <button
          className="w-20 px-2 py-1 mt-4 mb-4 text-sm bg-gray-600 rounded text-gray-50"
          onClick={() => {
            setMore(false);
            readAll();
          }}
        >
          Read all
        </button>
      )}
    </div>
  );
};

export default Index;
