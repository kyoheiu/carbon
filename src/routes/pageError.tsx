import { useRouteError } from "react-router-dom";
import { toastError } from "../utils";

export default function PageError() {
  const error = useRouteError() as any;
  toastError(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
