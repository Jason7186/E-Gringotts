import React from 'react';
import {useState, useRef, useEffect} from 'react';
import './login-help.css';

interface Message {
  text: string;
  isSent: boolean;
}
interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (message.trim() !== '') {
      onSendMessage(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = '40px'; 
        textareaRef.current.rows = 1; 
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    const textarea = e.target;
    textarea.style.height = 'auto'; 
    textarea.style.height = `${textarea.scrollHeight}px`; 
    if (textarea.scrollHeight > 150) {
      textarea.style.overflow = 'auto'; 
    } else {
      textarea.style.overflow = 'hidden'; 
    }
  };

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-window">
      <div className="message-list" ref={messageListRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.isSent ? 'sent' : 'received'}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="message-input">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          placeholder="Type your message..."
          rows={1}
          style={{ height: 'auto' }}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

const Loginhelp: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);

  const sendMessage = (message: string) => {
    setMessages([...messages, { text: message, isSent: true }]);
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `Received: ${message}`, isSent: false },
      ]);
    }, 1000);
  };

  return (
  <div className='help-background'>
    <h1>Owl Post Help</h1>
    <div className='help-container'>
      <ChatWindow messages={messages} onSendMessage={sendMessage}/>
    </div>
  </div>
  );
};

export default Loginhelp;