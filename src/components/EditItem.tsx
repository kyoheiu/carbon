import { useItem } from "../ItremContext";
import { ArrowLeft, UploadCloud } from "./Icons";

export const EditItem = () => {
  const { item, currentValue, setCurrentValue, handleSave, toggleEditMode } =
    useItem();

  if (!item) return null;
  return (
    <>
      <div className="my-3 text-xl leading-6 break-words">{item.title}</div>
      <div className="flex justify-between mb-4">
        <button
          className="px-2 py-1 text-sm rounded bg-stone-600 text-stone-50"
          onClick={() => toggleEditMode()}
        >
          <ArrowLeft />
          View
        </button>
        <button
          className="px-2 py-1 text-sm rounded bg-stone-600 text-stone-50 disabled:bg-stone-300"
          onClick={() => handleSave()}
          disabled={currentValue === item.content}
        >
          <UploadCloud />
          Save
        </button>
      </div>
      <textarea
        id="content"
        className="p-2"
        value={currentValue}
        placeholder="Text here."
        onChange={(e) => setCurrentValue(e.target.value)}
      />
    </>
  );
};
