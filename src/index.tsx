import { useApp } from "./hooks";

const Index = () => {
  const { items, setItems } = useApp();
  return (
    <>
      {items?.map((item, index) => (
        <>
          <li>
            <a href={`/items/${item.title}`}>{item.title}</a>
          </li>
          <li>{item.modified}</li>
        </>
      ))}
    </>
  );
};

export default Index;
