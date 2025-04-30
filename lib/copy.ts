import { addToast } from "@heroui/toast";

export default async function copy(content: string) {
  if (!navigator || !navigator.clipboard) return;
  try {
    await navigator.clipboard.writeText(content);
    addToast({
      title: "کپی شد",
      color: "success",
    });
  } catch (err) {
    addToast({
      title: "کپی نشد",
      color: "danger",
    });
  }
}
