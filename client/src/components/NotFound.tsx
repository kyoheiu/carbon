import { useNavigate } from "react-router";
import { YouveGotError } from "./Icons";

export const NotFound = ({
  fileName,
  fetchError,
}: {
  fileName: string | undefined;
  fetchError: string | null;
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 items-center mt-8">
      <YouveGotError />
      <div className="break-all">
        {fileName ? `Cannot find item "${fileName}".` : "Cannot find item."}
      </div>
      <div className="italic break-all">{`Error: ${fetchError}`}</div>
      <button
        className="px-2 py-1 mb-4 text-sm text-gray-50 bg-gray-600 rounded"
        onClick={() => navigate("/")}
      >
        Go back to top
      </button>
    </div>
  );
};
