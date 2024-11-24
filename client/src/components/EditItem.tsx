import { useItem } from "../contexts/ItremContext";
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
      <div className="my-3 text-xl leading-6 break-words">{item.title}</div>
      <div className="flex justify-between mb-4">
        <button
          className="px-2 py-1 text-sm text-gray-50 bg-gray-600 rounded disabled:bg-gray-300"
          onClick={() => toggleEditMode()}
          disabled={!currentValue}
        >
          <ArrowLeft />
          View
        </button>
        <button
          className="px-2 py-1 text-sm text-gray-50 bg-gray-600 rounded disabled:bg-gray-300"
          onClick={handleSave}
          disabled={currentValue === item.content}
        >
          <UploadCloud />
          Save
        </button>
      </div>
      <textarea
        id="textarea"
        autoFocus
        className="p-2 rounded border border-orange-300"
        style={{
          tabSize: "2",
        }}
        value={currentValue}
        placeholder={`Enter text here to enable "View" and "Save" button.`}
        onChange={(e) => setCurrentValue(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e)}
      />
    </>
  );
};
