import { useEffect, useState } from 'react';

function AIChat({ messages: initialMessages = [], onSend }) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!draft.trim()) return;

    const userMessage = {
      sender: 'You',
      text: draft,
      type: 'user'
    };

    setMessages((prev) => [...prev, userMessage]);

    const question = draft;
    setDraft('');
    setLoading(true);

    try {
      if (!onSend) {
        throw new Error("Assistant function not provided");
      }

      const reply = await onSend(question);

      setMessages((prev) => [
        ...prev,
        {
          sender: 'Aether AI',
          text: reply.text,
          refs: reply.refs || [],
          type: 'assistant'
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'Aether AI',
          text: err.message,
          refs: [],
          type: 'assistant'
        }
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="dash-card">
      <div className="dash-card-title">
        AI Assistant
      </div>

      <div className="dash-chat-box">
        <div className="dash-chat-messages">

          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-msg ${message.type || 'assistant'}`}
            >
              <span className="chat-msg-sender">
                {message.sender}
              </span>

              <div className="chat-msg-bubble">
                {message.text}
              </div>

              {message.refs?.length > 0 && (
                <div className="chat-msg-references">
                  {message.refs.map((ref) => (
                    <span
                      key={ref}
                      className="chat-ref-tag"
                    >
                      {ref}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="chat-msg assistant">
              <span className="chat-msg-sender">
                Aether AI
              </span>

              <div className="chat-msg-bubble">
                Thinking...
              </div>
            </div>
          )}

        </div>

        <form
          className="dash-chat-input-wrapper"
          onSubmit={handleSubmit}
        >
          <input
            className="dash-chat-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask anything about the repository..."
          />

          <button
            className="btn btn-primary"
            type="submit"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default AIChat;