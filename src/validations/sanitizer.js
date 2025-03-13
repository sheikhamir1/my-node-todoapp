// Custom XSS Sanitizer Function
export function sanitizeXSS(input) {
  // Escape HTML special characters to prevent injection
  const escapeHtml = (str) => {
    return str.replace(/[&<>'"]/g, function (match) {
      switch (match) {
        case "&":
          return "&amp;";
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case "'":
          return "&#39;";
        case '"':
          return "&quot;";
      }
    });
  };

  // Remove dangerous HTML tags and attributes using regex
  const removeDangerousTagsAndAttributes = (str) => {
    // Remove dangerous tags like <script>, <iframe>, <object>, etc.
    str = str.replace(
      /<(script|iframe|object|embed|form|input|button|textarea)[^>]*>/gi,
      "&lt;$1&gt;"
    );

    // Remove JavaScript event handlers (e.g., onload, onclick, onmouseover, etc.)
    str = str.replace(/\s*(on\w+\s*=\s*["'][^"']*["'])/gi, ""); // Remove event handlers

    // Remove style attributes that can be used for attacks
    str = str.replace(/\s*(style\s*=\s*["'][^"']*["'])/gi, "");

    // Remove any remaining potentially dangerous attributes
    str = str.replace(
      /<([^>]+)(?=\s+(?:on\w+|style|href|src))[^>]*>/gi,
      "&lt;$1&gt;"
    );

    return str;
  };

  // First, escape HTML special characters
  let sanitized = escapeHtml(input);

  // Then, remove dangerous tags and attributes
  sanitized = removeDangerousTagsAndAttributes(sanitized);

  return sanitized;
}
