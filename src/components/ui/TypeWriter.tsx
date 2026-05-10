import { useEffect, useState } from "react";

interface TypeWriterProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
  showCursor?: boolean;
}

export function TypeWriter({
  text,
  speed = 60,
  delay = 0,
  className = "",
  onComplete,
  showCursor = true,
}: TypeWriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setStarted(true);
    }, delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayed((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      onComplete?.();
    }
  }, [currentIndex, started, speed, text, onComplete]);

  const parts = displayed.split("\n");

  return (
    <span className={className}>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && <br />}
        </span>
      ))}
      {showCursor && currentIndex < text.length && (
        <span className="inline-block animate-pulse text-primary/70">|</span>
      )}
    </span>
  );
}
