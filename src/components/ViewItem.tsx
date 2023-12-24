import { Item } from "../types";

export const ViewItem = ({
  item,
  currentValue,
  toggleEditMode,
}: {
  item: Item;
  currentValue: string;
  toggleEditMode: () => void;
}) => {
  return (
    <>
      <div>{item.title}</div>
      <button onClick={() => toggleEditMode()}>Edit</button>
      <div>{currentValue}</div>
    </>
  );
};
