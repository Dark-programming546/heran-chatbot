// App.jsx - Content Creator AI (Responsive & Updated Logic)
import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Code, Heart, Cpu, MessageSquare, Smartphone } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [userName, setUserName] = useState('');
  const [hasAskedForName, setHasAskedForName] = useState(false);
  const [chatPhase, setChatPhase] = useState('welcome');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpecialUser, setIsSpecialUser] = useState(false);
  const [secretAsked, setSecretAsked] = useState(false);
  const [loveMessageShown, setLoveMessageShown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initial welcome message
  useEffect(() => {
    const timer = setTimeout(() => {
      addBotMessage("Hello! I am Content Creator AI. What can I help you with today?");
      
      setTimeout(() => {
        addBotMessage("Would you tell me your name first?");
        setHasAskedForName(true);
        setChatPhase('name');
        setTimeout(() => inputRef.current?.focus(), 300);
      }, 1500);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addBotMessage = (text, delay = 0) => {
    if (delay > 0) {
      setIsTyping(true);
      setTimeout(() => {
        const newMessage = {
          id: Date.now(),
          text: text,
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, newMessage]);
        setIsTyping(false);
      }, delay);
    } else {
      const newMessage = {
        id: Date.now(),
        text: text,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newMessage]);
    }
  };

  const addUserMessage = (text) => {
    const newMessage = {
      id: Date.now(),
      text: text,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    const trimmedInput = inputText.trim();
    if (!trimmedInput) return;
    
    // Add user message
    addUserMessage(trimmedInput);
    
    // Handle name phase
    if (chatPhase === 'name') {
      const name = trimmedInput;
      setUserName(name);
      
      // Check if it's the special name (case insensitive)
      const normalizedInput = name.toLowerCase().trim();
      const isHeran = normalizedInput.includes("heran") || normalizedInput.includes("getachew");
      
      if (isHeran) {
        setIsSpecialUser(true);
        setTimeout(() => {
          addBotMessage(`Hello Heran! My future developer who will contribute to the Content Creator AI project with Habtamu Kasahun! 👩‍💻✨`, 1000);
          
          setTimeout(() => {
            addBotMessage("Welcome Heran! Do you know some secret about Habtamu?", 800);
            setSecretAsked(true);
            setChatPhase('chat');
          }, 1200);
        }, 1000);
      } else {
        setIsSpecialUser(false);
        setTimeout(() => {
          addBotMessage(`Hello ${name}! What can I help you with today?`, 1000);
          setChatPhase('chat');
        }, 1000);
      }
    } 
    // Handle chat phase - SPECIAL USER (Heran)
    else if (chatPhase === 'chat' && isSpecialUser) {
      const userMessage = trimmedInput.toLowerCase();
      
      // If secret was asked and user says "yes"
      if (secretAsked && (userMessage.includes('yes') || userMessage.includes('yeah') || userMessage.includes('yep') || userMessage === 'y')) {
        if (!loveMessageShown) {
          setTimeout(() => {
            addBotMessage("Habtamu loves you. ❤️", 1000);
            setLoveMessageShown(true);
            setSecretAsked(false);
          }, 800);
        } else {
          setTimeout(() => {
            addBotMessage("I am under maintenance by Habtamu Kasahun and Heran Getachew from Electrical and Computer Engineering and Software Engineering respectively. If you want to know more, ask Habtamu himself.", 1000);
          }, 800);
        }
      }
      // If love message already shown, show maintenance message
      else if (loveMessageShown) {
        setTimeout(() => {
          addBotMessage("I am under maintenance by Habtamu Kasahun and Heran Getachew from Electrical and Computer Engineering and Software Engineering respectively. If you want to know more, ask Habtamu himself.", 1000);
        }, 800);
      }
      // If user asks "How do you know that?"
      else if (userMessage.includes('how do you know') || userMessage.includes('how you know')) {
        setTimeout(() => {
          addBotMessage("I am a Content Creator AI that is under development by Habtamu Kasahun from Electrical and Computer Engineering background and Heran Getachew from Software Engineering. 👨‍💻👩‍💻", 1200);
        }, 800);
      }
      // First response after welcome (if not answering the secret question)
      else {
        if (!loveMessageShown) {
          setTimeout(() => {
            addBotMessage("Habtamu loves you. ❤️", 1000);
            setLoveMessageShown(true);
          }, 800);
        } else {
          setTimeout(() => {
            addBotMessage("I am under maintenance by Habtamu Kasahun and Heran Getachew from Electrical and Computer Engineering and Software Engineering respectively. If you know more, ask Habtamu himself.", 1000);
          }, 800);
        }
      }
    }
    // Handle chat phase - OTHER USERS
    else if (chatPhase === 'chat' && !isSpecialUser) {
      setTimeout(() => {
        addBotMessage("Apologize! I am under maintenance by Habtamu Kasahun and Heran Getachew from Electrical and Computer Engineering and Software Engineering respectively.", 1000);
      }, 800);
    }
    
    setInputText('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setMessages([]);
    setUserName('');
    setHasAskedForName(false);
    setChatPhase('welcome');
    setInputText('');
    setIsSpecialUser(false);
    setIsTyping(false);
    setSecretAsked(false);
    setLoveMessageShown(false);
    
    // Restart the welcome sequence
    setTimeout(() => {
      addBotMessage("Hello! I am Content Creator AI. What can I help you with today?");
      
      setTimeout(() => {
        addBotMessage("Would you tell me your name first?");
        setHasAskedForName(true);
        setChatPhase('name');
        setTimeout(() => inputRef.current?.focus(), 300);
      }, 1500);
    }, 500);
  };

  const quickNameSet = (name = "Heran Getachew") => {
    setInputText(name);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-container">
            <div className="logo-icon">
              <Cpu size={isMobile ? 20 : 28} />
            </div>
            <div>
              <h1 style={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }}>
                Content Creator AI
              </h1>
              <p className="subtitle" style={{ fontSize: isMobile ? '0.75rem' : '0.9rem' }}>
                Intelligent Content Generation Assistant
              </p>
            </div>
          </div>
          <div className="header-badge" style={{ 
            padding: isMobile ? '0.4rem 0.8rem' : '0.5rem 1rem',
            fontSize: isMobile ? '0.75rem' : '0.85rem'
          }}>
            <span className="status-dot"></span>
            {isMobile ? 'Mobile' : 'Under Development'}
          </div>
        </div>
      </header>

      <main className="app-main">
        {/* Left Sidebar - Hidden on mobile */}
        {!isMobile && (
          <div className="sidebar">
            <div className="sidebar-section">
              <h3>
                <MessageSquare size={18} />
                Chat Info
              </h3>
              <div className="info-card">
                <div className="info-item">
                  <span className="info-label">User:</span>
                  <span className={`info-value ${isSpecialUser ? 'special-user' : ''}`}>
                    {userName || 'Not identified'}
                    {isSpecialUser && <Heart size={14} className="heart-icon" />}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Status:</span>
                  <span className="info-value">
                    {chatPhase === 'welcome' ? 'Welcoming' : 
                     chatPhase === 'name' ? 'Awaiting Name' : 
                     isSpecialUser ? 'Special Chat' : 'General Chat'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Love Msg:</span>
                  <span className="info-value">{loveMessageShown ? 'Shown ❤️' : 'Not shown'}</span>
                </div>
              </div>
            </div>

            <div className="sidebar-section">
              <h3>
                <Sparkles size={18} />
                Quick Actions
              </h3>
              <div className="actions-container">
                <button 
                  onClick={resetChat}
                  className="action-btn reset-btn"
                >
                  <span className="btn-icon">🔄</span>
                  Reset Chat
                </button>
                <button 
                  onClick={() => quickNameSet("Heran Getachew")}
                  className="action-btn demo-btn"
                >
                  <span className="btn-icon">👩‍💻</span>
                  Set Heran
                </button>
                <button 
                  onClick={() => quickNameSet("Other User")}
                  className="action-btn other-btn"
                >
                  <span className="btn-icon">👤</span>
                  Set Other
                </button>
              </div>
            </div>

            <div className="sidebar-section">
              <h3>
                <Code size={18} />
                Developers
              </h3>
              <div className="developers-card">
                <div className="developer">
                  <div className="dev-avatar ece">ECE</div>
                  <div className="dev-info">
                    <strong>Habtamu Kasahun</strong>
                    <small>Electrical & Computer Eng.</small>
                  </div>
                </div>
                <div className="developer">
                  <div className="dev-avatar swe">SWE</div>
                  <div className="dev-info">
                    <strong>Heran Getachew</strong>
                    <small>Software Engineering</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="sidebar-section">
              <div className="hint-box">
                <p className="hint-title">💡 Logic Flow</p>
                <p><strong>For Heran:</strong></p>
                <p>1. Special welcome</p>
                <p>2. Ask secret question</p>
                <p>3. "Habtamu loves you" (once)</p>
                <p>4. Then maintenance message</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Chat Area */}
        <div className="chat-container" style={{ 
          borderRadius: isMobile ? '10px' : '20px',
          height: isMobile ? 'calc(100vh - 140px)' : 'calc(100vh - 200px)'
        }}>
          {/* Mobile Header */}
          {isMobile && (
            <div className="mobile-header">
              <div className="mobile-user-info">
                <div className="mobile-avatar">
                  {isSpecialUser ? '👩‍💻' : '🤖'}
                </div>
                <div>
                  <div className="mobile-user-name">
                    {userName ? `Chatting with ${userName}` : 'Content Creator AI'}
                  </div>
                  <div className="mobile-status">
                    {isSpecialUser ? 'Special Mode ❤️' : 'Standard Mode'}
                    {loveMessageShown && ' • Love message sent'}
                  </div>
                </div>
              </div>
              <button 
                onClick={resetChat}
                className="mobile-reset-btn"
              >
                🔄
              </button>
            </div>
          )}

          {/* Chat Messages */}
          <div className="messages-container" style={{ 
            padding: isMobile ? '1rem' : '2rem',
            paddingTop: isMobile ? '0.5rem' : '2rem'
          }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message-wrapper ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
                style={{ marginBottom: isMobile ? '0.8rem' : '1.5rem' }}
              >
                <div 
                  className="message-content"
                  style={{ 
                    maxWidth: isMobile ? '85%' : '70%',
                    padding: isMobile ? '0.8rem' : '1rem',
                    borderRadius: isMobile ? '12px' : '18px'
                  }}
                >
                  <div className="message-header" style={{ marginBottom: isMobile ? '0.3rem' : '0.5rem' }}>
                    <div 
                      className="sender-avatar"
                      style={{ 
                        width: isMobile ? '28px' : '32px',
                        height: isMobile ? '28px' : '32px',
                        fontSize: isMobile ? '0.8rem' : '0.9rem'
                      }}
                    >
                      {msg.sender === 'user' ? (
                        <User size={isMobile ? 14 : 16} />
                      ) : (
                        <Bot size={isMobile ? 14 : 16} />
                      )}
                    </div>
                    <span 
                      className="sender-name"
                      style={{ fontSize: isMobile ? '0.85rem' : '0.95rem' }}
                    >
                      {msg.sender === 'user' ? (userName || 'You') : 'Content Creator AI'}
                    </span>
                    <span 
                      className="message-time"
                      style={{ fontSize: isMobile ? '0.7rem' : '0.8rem' }}
                    >
                      {msg.time}
                    </span>
                  </div>
                  <div 
                    className="message-text"
                    style={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="typing-indicator">
                <div className="typing-dots">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
                <span style={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>AI is typing...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div 
            className="input-container"
            style={{ 
              padding: isMobile ? '1rem' : '1.5rem 2rem',
              paddingTop: isMobile ? '0.8rem' : '1.5rem'
            }}
          >
            <div 
              className="input-wrapper"
              style={{ marginBottom: isMobile ? '0.3rem' : '0.5rem' }}
            >
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  chatPhase === 'name' 
                    ? "Enter your name here..." 
                    : isSpecialUser && !loveMessageShown
                      ? "Answer the secret question..." 
                      : "Type your message..."
                }
                className="message-input"
                style={{ 
                  padding: isMobile ? '0.8rem 1rem' : '1rem 1.25rem',
                  fontSize: isMobile ? '0.9rem' : '1rem'
                }}
                autoFocus
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="send-button"
                style={{ 
                  width: isMobile ? '48px' : '56px',
                  height: isMobile ? '48px' : '56px'
                }}
              >
                <Send size={isMobile ? 18 : 20} />
              </button>
            </div>
            <div className="input-hint">
              <span 
                className="hint-text"
                style={{ fontSize: isMobile ? '0.75rem' : '0.85rem' }}
              >
                {chatPhase === 'name' ? (
                  "Please enter your name to continue"
                ) : isSpecialUser && !loveMessageShown ? (
                  "Try answering 'yes' to the secret question! ❤️"
                ) : loveMessageShown ? (
                  "Love message sent! Further queries will show maintenance info"
                ) : (
                  "Press Enter to send"
                )}
              </span>
            </div>

            {/* Mobile Quick Actions */}
            {isMobile && (
              <div className="mobile-actions">
                <button 
                  onClick={() => quickNameSet("Heran Getachew")}
                  className="mobile-action-btn heran-btn"
                >
                  👩‍💻 Heran
                </button>
                <button 
                  onClick={() => quickNameSet("Other")}
                  className="mobile-action-btn other-btn"
                >
                  👤 Other
                </button>
                {isMobile && (
                  <div className="mobile-device-info">
                    <Smartphone size={12} />
                    <span>Mobile Mode</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile-only Sidebar Info */}
        {isMobile && userName && (
          <div className="mobile-info-card">
            <div className="mobile-info-row">
              <span>User:</span>
              <strong className={isSpecialUser ? 'special-text' : ''}>
                {userName} {isSpecialUser && '❤️'}
              </strong>
            </div>
            <div className="mobile-info-row">
              <span>Status:</span>
              <span>{isSpecialUser ? 'Special User' : 'Regular User'}</span>
            </div>
            <div className="mobile-info-row">
              <span>Love Msg:</span>
              <span>{loveMessageShown ? 'Sent ✅' : 'Pending'}</span>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer 
        className="app-footer"
        style={{ padding: isMobile ? '1rem' : '1.5rem 2rem' }}
      >
        <p style={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
          <strong>Content Creator AI</strong> • Under Development by Habtamu Kasahun (ECE) & Heran Getachew (SWE)
        </p>
        <p 
          className="footer-note"
          style={{ fontSize: isMobile ? '0.7rem' : '0.9rem' }}
        >
          {isMobile ? 'Mobile Optimized' : 'Responsive Design'} • Love message shows only once
        </p>
      </footer>

      {/* Styles */}
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .app-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          color: #333;
        }

        /* Header */
        .app-header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 1rem;
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo-icon {
          background: linear-gradient(135deg, #667eea, #764ba2);
          padding: 0.5rem;
          border-radius: 10px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .subtitle {
          color: #718096;
        }

        .header-badge {
          background: linear-gradient(135deg, #00b09b, #96c93d);
          color: white;
          border-radius: 20px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #4ade80;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Main Layout */
        .app-main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1rem;
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 1rem;
          height: calc(100vh - 140px);
        }

        @media (max-width: 768px) {
          .app-main {
            grid-template-columns: 1fr;
            height: auto;
            min-height: calc(100vh - 140px);
            padding: 0.5rem;
            gap: 0.5rem;
          }
        }

        /* Sidebar (Desktop only) */
        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        @media (max-width: 768px) {
          .sidebar {
            display: none;
          }
        }

        .sidebar-section h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: white;
          font-size: 1rem;
          margin-bottom: 0.8rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .info-card, .developers-card, .hint-box {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.9rem;
        }

        .info-item:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        .info-label {
          color: rgba(255, 255, 255, 0.8);
        }

        .info-value {
          color: white;
          font-weight: 500;
        }

        .special-user {
          color: #fbb6ce;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .heart-icon {
          color: #f687b3;
          animation: heartbeat 1.5s infinite;
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        /* Actions */
        .actions-container {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 0.8rem;
          border: none;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          color: white;
          text-align: left;
        }

        .reset-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .demo-btn {
          background: linear-gradient(135deg, #00b09b, #96c93d);
        }

        .other-btn {
          background: linear-gradient(135deg, #f687b3, #f78fb3);
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .btn-icon {
          font-size: 1rem;
        }

        /* Developers */
        .developer {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.6rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.9rem;
        }

        .developer:last-child {
          border-bottom: none;
        }

        .dev-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.8rem;
          color: white;
          flex-shrink: 0;
        }

        .ece {
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .swe {
          background: linear-gradient(135deg, #00b09b, #96c93d);
        }

        .dev-info {
          color: white;
          min-width: 0;
        }

        .dev-info strong {
          display: block;
          font-size: 0.85rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dev-info small {
          font-size: 0.75rem;
          opacity: 0.9;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Hint Box */
        .hint-box {
          background: rgba(255, 255, 255, 0.15);
          border-left: 4px solid #fbb6ce;
          font-size: 0.85rem;
        }

        .hint-title {
          color: #fbb6ce;
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .hint-box p {
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.4;
          margin-bottom: 0.3rem;
          font-size: 0.8rem;
        }

        .hint-box p:last-child {
          margin-bottom: 0;
        }

        /* Chat Container */
        .chat-container {
          display: flex;
          flex-direction: column;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        /* Mobile Header */
        .mobile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.8rem 1rem;
          background: rgba(255, 255, 255, 0.98);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .mobile-user-info {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .mobile-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          color: white;
          flex-shrink: 0;
        }

        .mobile-user-name {
          font-weight: 600;
          font-size: 0.9rem;
          color: #2d3748;
        }

        .mobile-status {
          font-size: 0.75rem;
          color: #718096;
          margin-top: 0.2rem;
        }

        .mobile-reset-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 8px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1rem;
          flex-shrink: 0;
        }

        /* Messages */
        .messages-container {
          flex: 1;
          overflow-y: auto;
          background: rgba(255, 255, 255, 0.98);
        }

        .message-wrapper {
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .user-message {
          display: flex;
          justify-content: flex-end;
        }

        .bot-message {
          display: flex;
          justify-content: flex-start;
        }

        .message-content {
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .user-message .message-content {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .bot-message .message-content {
          background: white;
          color: #2d3748;
        }

        .message-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .sender-avatar {
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .user-message .sender-avatar {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .bot-message .sender-avatar {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .sender-name {
          font-weight: 600;
        }

        .message-time {
          opacity: 0.8;
          margin-left: auto;
          white-space: nowrap;
        }

        .message-text {
          line-height: 1.4;
          word-break: break-word;
        }

        .user-message .message-time {
          color: rgba(255, 255, 255, 0.9);
        }

        .bot-message .message-time {
          color: #718096;
        }

        /* Typing Indicator */
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.8rem;
          background: white;
          border-radius: 8px;
          border: 1px solid rgba(0, 0, 0, 0.05);
          width: fit-content;
          margin-bottom: 0.8rem;
        }

        .typing-dots {
          display: flex;
          gap: 0.2rem;
        }

        .dot {
          width: 6px;
          height: 6px;
          background: #667eea;
          border-radius: 50%;
          animation: typing 1.4s infinite;
        }

        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }

        /* Input Area */
        .input-container {
          background: white;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }

        .input-wrapper {
          display: flex;
          gap: 0.8rem;
        }

        .message-input {
          flex: 1;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          transition: all 0.3s ease;
          outline: none;
        }

        .message-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .send-button {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .send-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .input-hint {
          text-align: center;
          margin-top: 0.3rem;
        }

        .hint-text {
          color: #718096;
        }

        /* Mobile Actions */
        .mobile-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.8rem;
          justify-content: center;
          align-items: center;
        }

        .mobile-action-btn {
          padding: 0.4rem 0.8rem;
          border: none;
          border-radius: 6px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .mobile-action-btn.heran-btn {
          background: linear-gradient(135deg, #00b09b, #96c93d);
          color: white;
        }

        .mobile-action-btn.other-btn {
          background: linear-gradient(135deg, #f687b3, #f78fb3);
          color: white;
        }

        .mobile-device-info {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          color: #718096;
          margin-left: auto;
        }

        /* Mobile Info Card */
        .mobile-info-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 10px;
          padding: 0.8rem;
          margin-top: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          font-size: 0.85rem;
          color: white;
        }

        .mobile-info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.4rem;
          padding-bottom: 0.4rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .mobile-info-row:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        .mobile-info-row span:first-child {
          color: rgba(255, 255, 255, 0.8);
        }

        .special-text {
          color: #fbb6ce;
        }

        /* Footer */
        .app-footer {
          background: rgba(255, 255, 255, 0.95);
          text-align: center;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          color: #4a5568;
        }

        .footer-note {
          color: #718096;
        }

        /* Responsive Utilities */
        @media (max-width: 480px) {
          .app-header {
            padding: 0.8rem;
          }
          
          .app-main {
            padding: 0.3rem;
          }
          
          .message-content {
            max-width: 90% !important;
          }
          
          .mobile-actions {
            flex-wrap: wrap;
          }
        }

        @media (max-width: 360px) {
          .logo-container h1 {
            font-size: 1rem;
          }
          
          .header-badge {
            font-size: 0.7rem;
            padding: 0.3rem 0.6rem;
          }
          
          .message-input {
            font-size: 0.85rem;
            padding: 0.6rem 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}

export default App;