import { redirect } from "next/navigation";

type MessageType = "error" | "success";

export function encodedRedirect(
  type: MessageType,
  path: string,
  message: string
): never {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}
