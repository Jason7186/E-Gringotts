import React from 'react';
import {useState, useRef, useEffect} from 'react';
import './login-help.css';

interface Message {
  text: string;
  isSent: boolean;
}
interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (message: string, isSent: boolean) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e?: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e) e.preventDefault();
    if (message.trim() !== '') {
      onSendMessage(message, true);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = '40px'; 
        textareaRef.current.rows = 1; 
      }
    }
    
    const token = localStorage.getItem('token');
    const url = new URL("http://localhost:8080/login/help-chat");
    const params = { prompt: message };
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    setIsLoading(true);

    try {
      console.log('Sending request to:', url);

      const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Server responded with an error');
      }

      const responseData = await response.text();
      console.log('Response string:', responseData);
      onSendMessage(responseData, false);
    } catch (error) {
      console.error('Error occurred:', error);
    } finally {
      setIsLoading(false);
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSend(e);
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
        {isLoading && (
          <div className="messageTyping">
            <span className="typing-indicator">
              <span></span><span></span><span></span>
            </span>
          </div>
        )}
      </div>
      <form className="message-input" onSubmit={handleSend}>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={1}
          style={{ height: 'auto' }}
        />
        <button type='submit' disabled={isLoading}>Send</button>
      </form>
    </div>
  );
};

const Loginhelp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = (message: string, isSent: boolean) => {
    setMessages(prevMessages => [...prevMessages, { text: message, isSent }]);
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