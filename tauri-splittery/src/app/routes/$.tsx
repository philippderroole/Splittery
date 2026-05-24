import { data } from "react-router";

export async function loader() {
  return data({}, 404);
}

export default function NotFoundPage() {
  return (
    <main className="container">
      <h1>Page not found</h1>
      <p>The route you requested does not exist.</p>
    </main>
  );
}