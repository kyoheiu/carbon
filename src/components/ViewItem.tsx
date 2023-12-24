import { Item } from "../types";

export const ViewItem = ({
  item,
  getEditMode,
}: {
  item: Item;
  getEditMode: () => void;
}) => {
  return (
    <>
      <div>{item.title}</div>
      <button onClick={() => getEditMode()}>Edit</button>
      <div>{item.content}</div>
    </>
  );
};
