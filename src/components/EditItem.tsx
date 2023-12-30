import { useItem } from "../ItremContext";
import { ArrowLeft, UploadCloud } from "./Icons";

export const EditItem = () => {
  const {
    item,
    currentValue,
    setCurrentValue,
    handleSave,
    toggleEditMode,
    handleKeyDown,
  } = useItem();
  if (!item) return null;

  return (
    <>
      <div className="mt-3 mb-4 text-xl leading-6 break-words">
        {item.title}
      </div>
      <div className="flex justify-between mb-4">
        <button
          className="px-2 py-1 text-sm bg-gray-600 rounded text-gray-50"
          onClick={() => toggleEditMode()}
        >
          <ArrowLeft />
          View
        </button>
        <button
          className="px-2 py-1 text-sm bg-gray-600 rounded text-gray-50 disabled:bg-gray-300"
          onClick={handleSave}
          disabled={currentValue === item.content}
        >
          <UploadCloud />
          Save
        </button>
      </div>
      <textarea
        id="textarea"
        className="p-2 border border-orange-300 rounded"
        value={currentValue}
        placeholder="Text here."
        onChange={(e) => setCurrentValue(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e)}
      />
    </>
  );
};
