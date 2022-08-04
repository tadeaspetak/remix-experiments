import { action, ChallengeForm } from "./CreateOrUpdateChallenge";

// reuse the same component for creating & updating
export { action };
export default function NewChallenge() {
  return <ChallengeForm />;
}
