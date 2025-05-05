import { addToast } from "@heroui/toast";

export default async function copy(content: string) {
  if (navigator?.clipboard) {
    try {
      await navigator.clipboard.writeText(content);
      addToast({
        title: "کپی شد",
        color: "success",
      });
      return;
    } catch (err) {
      console.error("Clipboard API failed", err);
    }
  }

  // Fallback method
  const textArea = document.createElement("textarea");
  textArea.value = content;
  textArea.style.position = "fixed"; // prevent scrolling to bottom of page
  document.body.appendChild(textArea);
  textArea.focus({ preventScroll: true });
  textArea.select();

  try {
    document.execCommand("copy");
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

  document.body.removeChild(textArea);
}
