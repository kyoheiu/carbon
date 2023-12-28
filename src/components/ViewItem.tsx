import { useItem } from "../ItremContext";

export const ViewItem = () => {
  const { item, currentValue, toggleEditMode } = useItem();

  if (!item) return null;
  return (
    <>
      <div>{item.title}</div>
      <button onClick={() => toggleEditMode()}>Edit</button>
      <div>{currentValue}</div>
    </>
  );
};
