import { useItem } from "../ItremContext";

export const EditItem = () => {
  const { item, currentValue, setCurrentValue, handleSave, toggleEditMode } =
    useItem();

  if (!item) return null;
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
