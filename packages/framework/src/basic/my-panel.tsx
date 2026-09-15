import { cn } from "../utils/cn";

interface MyPanelProps {
  data?: Record<string, unknown>;
  text?: string;
  onSayHello?: (text?: string) => void;
  children?: React.ReactNode;
}

function MyPanel({ data, text, onSayHello, children }: MyPanelProps) {
  const handleClick = () => {
    onSayHello?.(text);
  };

  const content = (
    <>
      {children}
      {data && <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>}
      {text}
    </>
  );

  if (onSayHello) {
    return (
      <button
        type="button"
        data-slot="my-panel"
        className={cn(
          "border border-border rounded p-4",
          "bg-card text-left text-card-foreground",
        )}
        onClick={handleClick}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      data-slot="my-panel"
      className={cn("border border-border rounded p-4", "bg-card")}
    >
      {content}
    </div>
  );
}

export { MyPanel };
