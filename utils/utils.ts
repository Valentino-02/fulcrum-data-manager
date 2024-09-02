import { redirect } from "next/navigation";

type MessageType = "error" | "success";

interface IEncodedRedirect {
  type: MessageType;
  path: string;
  message: string;
}

export function encodedRedirect({
  type,
  path,
  message,
}: IEncodedRedirect): never {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}
