import { useItem } from "../ItremContext";

export const EditItem = () => {
  const { item, currentValue, setCurrentValue, handleSave, toggleEditMode } =
    useItem();

  if (!item) return null;
  return (
    <>
      <div className="my-3 text-xl leading-6 break-words">{item.title}</div>
      <div className="flex justify-between mb-4">
        <button className="rounded border" onClick={() => toggleEditMode()}>
          <img src="/arrow-left.svg" className="inline" />
          View
        </button>
        <button className="rounded border" onClick={() => handleSave()}>
          Save
        </button>
      </div>
      <textarea
        className="p-2"
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
      />
    </>
  );
};
