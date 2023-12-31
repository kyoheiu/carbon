import { useItem } from "../contexts/ItremContext";
import { marked } from "marked";
import { ArrowRight } from "./Icons";

export const ViewItem = ({ isMarkdown }: { isMarkdown: boolean }) => {
  const { item, currentValue, toggleEditMode } = useItem();
  if (!item) return null;

  return (
    <div className="flex flex-col jusitfy-center">
      <div className="my-3 text-xl leading-6 break-words">{item.title}</div>
      <button
        className="flex self-end px-2 py-1 mb-4 text-sm text-gray-50 bg-gray-600 rounded"
        onClick={() => toggleEditMode()}
      >
        <ArrowRight />
        Edit
      </button>
      {isMarkdown ? (
        <div
          className="break-words prose prose-gray prose-pre:overflow-x-auto prose-h1:border-b prose-h1:border-surface-500 prose-h2:border-b prose-h2:border-surface-500 prose-a:text-tertiary-700 prose-ol:ml-3 prose-ol:pl-2 prose-ul:ml-3 prose-ul:pl-2 prose-table:table-fixed"
          dangerouslySetInnerHTML={{ __html: marked.parse(currentValue) }}
        />
      ) : (
        <div className="break-words">{currentValue}</div>
      )}
    </div>
  );
};
