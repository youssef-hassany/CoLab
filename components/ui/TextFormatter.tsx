import React from "react";

interface TextFormatterProps {
  description: string;
  className?: string;
  linkClassName?: string; // Optional custom styling for links
}

const TextFormatter: React.FC<TextFormatterProps> = ({
  description,
  className = "",
  linkClassName = "text-blue-500 hover:text-blue-700 underline",
}) => {
  // Function to format the description
  const formatDescription = (text: string): string[] => {
    return text
      .replace(/\r\n/g, "\n") // Convert Windows line breaks to Unix
      .replace(/\t/g, "    ") // Convert tabs to spaces
      .split("\n")
      .filter((line) => line.trim()) // Remove empty lines
      .map((line) => line.trim()); // Trim whitespace
  };

  // Function to detect and convert links to clickable elements
  const processLineWithLinks = (line: string): React.ReactNode[] => {
    // Regex to match URLs (http, https, ftp, and www patterns)
    const urlRegex =
      /(https?:\/\/[^\s]+|ftp:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/g;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = urlRegex.exec(line)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index));
      }

      // Process the matched URL
      let url = match[0];
      const displayUrl = url;

      // Add protocol if missing
      if (
        !url.startsWith("http://") &&
        !url.startsWith("https://") &&
        !url.startsWith("ftp://")
      ) {
        url = "https://" + url;
      }

      // Create clickable link
      parts.push(
        <a
          key={`${match.index}-${url}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
        >
          {displayUrl}
        </a>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after the last link
    if (lastIndex < line.length) {
      parts.push(line.slice(lastIndex));
    }

    return parts.length > 0 ? parts : [line];
  };

  const formattedLines = formatDescription(description);

  return (
    <div className={className}>
      {formattedLines.map((line, index) => (
        <div key={index}>
          {line.startsWith("•") ? (
            <div>• {processLineWithLinks(line.substring(1).trim())}</div>
          ) : (
            <div dir="auto">{processLineWithLinks(line)}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TextFormatter;

// Usage examples:

// Basic usage
// <TextFormatter description="Visit https://example.com for more info" />

// With custom styling
// <TextFormatter
//   description="Check out www.google.com and https://github.com"
//   className="text-zinc-300"
//   linkClassName="text-blue-400 hover:text-blue-300 underline"
// />

// Example with bullet points and links
// <TextFormatter
//   description={`
//     • Visit our website at https://example.com
//     • Follow us on social media
//     • Contact support at support.example.com
//     Check out www.documentation.site for guides
//   `}
// />
