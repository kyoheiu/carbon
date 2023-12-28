import { useRef } from "react";
import { useApp } from "../hooks";
import ItemList from "../components/ItemList";

const Index = () => {
  const { items, hideItem } = useApp();
  if (!items) return null;
  const props = { items: items, hideItem: hideItem };
  return <ItemList {...props} />;
};

export default Index;
