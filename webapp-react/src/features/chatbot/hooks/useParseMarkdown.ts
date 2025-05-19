const useParseMarkdown = () => {
  const escapeHTML = (str: string): string =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const parseMarkdown = (text: string): string => {
    let escaped = escapeHTML(text);

    // Заголовки
    escaped = escaped.replace(
      /^### (.+)$/gm,
      '<h3 class="text-base font-semibold text-white mb-1">$1</h3>'
    );
    escaped = escaped.replace(
      /^## (.+)$/gm,
      '<h2 class="text-lg font-bold text-white mb-2">$1</h2>'
    );
    escaped = escaped.replace(
      /^# (.+)$/gm,
      '<h1 class="text-xl font-bold text-white mb-3">$1</h1>'
    );

    // Inline code
    escaped = escaped.replace(
      /`([^`]+)`/g,
      '<code class="bg-secondary px-1 py-0.5 rounded text-sm">$1</code>'
    );

    // Bold italic
    escaped = escaped.replace(
      /\*\*\*(.+?)\*\*\*/g,
      '<span class="font-bold italic">$1</span>'
    );

    // Bold
    escaped = escaped.replace(
      /\*\*(.+?)\*\*/g,
      '<span class="font-bold">$1</span>'
    );

    // Italic
    escaped = escaped.replace(/\*(.+?)\*/g, '<span class="italic">$1</span>');

    // Ссылки [text](url)
    escaped = escaped.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" class="text-blue-400 underline underline-offset-2 hover:text-blue-300">$1</a>'
    );

    // Переносы строк
    return escaped.replace(/\n/g, "<br>");
  };

  return { parseMarkdown };
};

export default useParseMarkdown;
