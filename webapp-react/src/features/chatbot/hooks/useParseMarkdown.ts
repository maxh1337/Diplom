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

    // Заголовки ### Третий уровень
    escaped = escaped.replace(
      /^### (.+)$/gm,
      '<h3 class="text-base font-semibold text-white mb-1">$1</h3>'
    );

    // Заголовки ## Второй уровень
    escaped = escaped.replace(
      /^## (.+)$/gm,
      '<h2 class="text-lg font-bold text-white mb-2">$1</h2>'
    );

    // Заголовки # Первый уровень
    escaped = escaped.replace(
      /^# (.+)$/gm,
      '<h1 class="text-xl font-bold text-white mb-3">$1</h1>'
    );

    // Inline code `код`
    escaped = escaped.replace(
      /`([^`]+)`/g,
      '<code class="bg-secondary px-1 py-0.5 rounded text-sm">$1</code>'
    );

    // Жирный курсив (***text***)
    escaped = escaped.replace(
      /\*\*\*(.+?)\*\*\*/g,
      '<span class="font-bold italic">$1</span>'
    );

    // Жирный (**text**)
    escaped = escaped.replace(
      /\*\*(.+?)\*\*/g,
      '<span class="font-bold">$1</span>'
    );

    // Курсив (*text*)
    escaped = escaped.replace(/\*(.+?)\*/g, '<span class="italic">$1</span>');

    // Переносы строк
    return escaped.replace(/\n/g, "<br>");
  };

  return { parseMarkdown };
};

export default useParseMarkdown;
