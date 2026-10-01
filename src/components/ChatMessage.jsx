export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`message-row ${isUser ? "user-row" : "ai-row"}`}>
      <div className={`message ${isUser ? "user-message" : "ai-message"}`}>
        {message.text}
      </div>
    </div>
  );
}