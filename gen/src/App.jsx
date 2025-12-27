import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { generateAd } from "./api";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("Both");
  const [open, setOpen] = useState(false);

  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  const chatRef = useRef(null);
  const menuRef = useRef(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");


  useEffect(() => {
    async function loadChats() {
      const res = await fetch("http://localhost:5000/api/chat/conversations", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setConversations(data);

      if (data.length) {
        openChat(data[0]._id);
      }
    }

    if (token) loadChats();
  }, [token]);


  async function openChat(chatId) {
    setActiveChatId(chatId);

    const res = await fetch(`http://localhost:5000/api/chat/${chatId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setMessages(data);
  }


  async function newChat() {
    const res = await fetch("http://localhost:5000/api/chat/new", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });

    const chat = await res.json();
    setConversations((c) => [chat, ...c]);
    setMessages([]);
    setActiveChatId(chat._id);
  }

 
  function updateConversationTitle(chatId, text) {
    setConversations((prev) =>
      prev.map((c) =>
        c._id === chatId && c.title === "New Chat"
          ? {
              ...c,
              title: text
                .replace(/\n/g, " ")
                .split(" ")
                .slice(0, 6)
                .join(" ")
            }
          : c
      )
    );
  }


  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages, loading]);

  
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

 
  async function handleSend(customPrompt) {
    if (!activeChatId) return;

    const finalPrompt = customPrompt || prompt;
    if (!finalPrompt.trim()) return;

    const userMsg = { role: "user", text: finalPrompt };

    setMessages((m) => [...m, userMsg]);

    updateConversationTitle(activeChatId, finalPrompt);

    setPrompt("");
    setLoading(true);

    await fetch("http://localhost:5000/api/chat/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        conversationId: activeChatId,
        role: "user",
        text: finalPrompt
      })
    });

    try {
      const data = await generateAd(finalPrompt, mode);
      const aiMsg = {
        role: "ai",
        text: data.text || "",
        imageUrl: data.imageUrl || null
      };

      setMessages((m) => [...m, aiMsg]);

      await fetch("http://localhost:5000/api/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          conversationId: activeChatId,
          role: "ai",
          text: aiMsg.text,
          imageUrl: aiMsg.imageUrl
        })
      });
    } catch {
      setMessages((m) => [...m, { role: "ai", text: "⚠️ Something went wrong" }]);
    } finally {
      setLoading(false);
    }
  }

  function copy(text) {
    navigator.clipboard.writeText(text);
  }

  return (
    <>
     <nav className="top-bar">
        <img src="/logo2.jpg" className="logo-small" />
        <span>M-Engine AI</span>
      

        <div className="profile">
    <div className="avatar" onClick={() => setOpen(!open)}>
      {user?.name?.charAt(0).toUpperCase()}
    </div>

    {open && (
      <div className="profile-dropdown">
        <div className="profile-name">{user?.name}</div>
        <button
          className="logout"
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          🚪 Logout
        </button>
      </div>
    )}
  </div>
      </nav>

      <div className="layout">
        <aside className="side-panel">
        <button onClick={newChat}>➕ New Chat</button>

        <h3>Chats</h3>
        {conversations.map((c) => (
          <button
            key={c._id}
            className={activeChatId === c._id ? "active-chat" : ""}
            onClick={() => openChat(c._id)}
          >
            💬 {c.title}
          </button>
        ))}
      </aside>
          
      

        <div className="app">
          <header className="app-header">
            <img src="/logo2.jpg" className="logo" />
            M-Engine AI
          </header>

          <div className="chat" ref={chatRef}>
            {messages.length === 0 && (
              <div className="empty-state">
                ✨ Type or select a prompt to begin
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`msg ${msg.role}`}>
                {msg.role === "user" ? (
                  <p>{msg.text}</p>
                ) : (
                  <>
                    {msg.text && (
                      <div className="ai-text">
                        <p>{msg.text}</p>
                        <div className="tool-row">
          
                        </div>
                      </div>
                    )}

                    {msg.imageUrl && (
                      <div className="image-wrap">
                        <img src={msg.imageUrl} alt="AI result" />
                        <div className="tool-row">
              
                          <a href={msg.imageUrl} download>
                            <button>⬇ Download</button>
                          </a>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}

            {loading && (
              <div className="msg ai thinking">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="text">AI thinking…</span>
              </div>
            )}
          </div>

          <div className="input-bar">
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Type your prompt…"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleSend()
                }
              />
              <button onClick={() => handleSend()} className="send-btn">
                ➤
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        © 2026 M-Engine AI · @ Muthu
      </footer>
    </>
  );
}
