import { Link } from "@remix-run/react";

export default function ChallengeIndexPage() {
  return (
    <p>
      No challenge selected. Select a chllenge on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new challenge.
      </Link>
    </p>
  );
}
