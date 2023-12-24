import { Item } from "../types";

export const EditItem = ({
  item,
  currentValue,
  setCurrentValue,
  handleSave,
  toggleEditMode,
}: {
  item: Item;
  currentValue: string;
  setCurrentValue: React.Dispatch<React.SetStateAction<string>>;
  handleSave: () => void;
  toggleEditMode: () => void;
}) => {
  return (
    <>
      <div>{item.title}</div>
      <button onClick={() => toggleEditMode()}>View</button>
      <button onClick={() => handleSave()}>Save</button>
      <textarea
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
      />
    </>
  );
};
