'use client';

import React, { useEffect, useState, useRef } from "react";
import Spline from '@splinetool/react-spline';
import styled from 'styled-components';
import { FaPaperPlane, FaEdit, FaTrashAlt } from 'react-icons/fa';
import Cookies from 'js-cookie';

const HOME_CHAT_COOKIE = 'home_chat';



const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 800px;
  height: 80vh;
  position: fixed;
  bottom: 20px;
  left: 60px; /* Slightly to the right */
  background: transparent;
  z-index: 10;
`;

const MessageArea = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.5) transparent;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, #ff0099, #493240);
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(255, 0, 153, 0.7);
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(45deg, #ff0099, #493240);
  }
`;

const Message = styled.div`
  margin-bottom: 25px;
  padding: 15px 20px;
  background: ${(props) => (props.isUser ? 'linear-gradient(45deg, #007BFF, #0056b3)' : 'linear-gradient(45deg, #ff0099, #8e44ad)')};
  color: white;
  align-self: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')};
  border-radius: 15px;
  max-width: 70%;
  box-shadow: 0px 0px 15px ${(props) => (props.isUser ? 'rgba(0, 123, 255, 0.7)' : 'rgba(255, 0, 153, 0.7)')};
  position: relative;
  transition: background 0.3s, transform 0.3s;

  &:hover {
    background: ${(props) => (props.isUser ? 'linear-gradient(45deg, #0095f6, #007bb5)' : 'linear-gradient(45deg, #ff66cc, #b03e99)')};
    transform: translateY(-2px);
  }

  &:hover .actions {
    display: flex;
    opacity: 1;
  }
`;

const Footer = styled.div`
  padding: 15px;
  display: flex;
`;

const NewChatButton = styled.button`
  padding: 10px 20px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  box-shadow: 0px 0px 10px rgba(0, 123, 255, 0.5);
  transition: background-color 0.3s, transform 0.3s;
  margin-right: 30px;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 16px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const SendButton = styled.button`
  margin-left: 10px;
  padding: 12px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 0px 10px rgba(0, 123, 255, 0.3);

  &:hover {
    background-color: #0056b3;
    box-shadow: 0px 0px 15px rgba(0, 123, 255, 0.7);
  }
`;

const Actions = styled.div`
  display: flex;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: ${(props) => (props.isUser ? 'calc(100% + 15px)' : 'calc(100% + 15px)')};
  flex-direction: row;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;

  button {
    margin: 0 5px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 5px;
    cursor: pointer;
    padding: 5px;
    transition: background 0.3s ease-in-out, transform 0.3s ease-in-out;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }
  }
`;

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const messageAreaRef = useRef(null);

  useEffect(() => {

    const savedMessages = Cookies.get(HOME_CHAT_COOKIE);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([{ text: 'Hello, how can I assist you today?', isUser: false }]);
    }
  }, []);

  useEffect(() => {

    Cookies.set(HOME_CHAT_COOKIE, JSON.stringify(messages), { expires: 365 });
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim()) {
      const updatedMessages = editIndex !== null 
        ? messages.map((msg, index) => (index === editIndex ? { text: input, isUser: true } : msg))
        : [...messages, { text: input, isUser: true }];

      setMessages(updatedMessages);
      setInput('');
      setEditIndex(null);

      console.log("Messages after sending:", updatedMessages);

      await fetchAzureResponse(input);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const fetchAzureResponse = async (message) => {
    try {
      const conversation = messages.map(msg => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text
      }));
      conversation.push({ role: "user", content: message });

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer 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`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.1-8b-instruct:free",
          messages: conversation,
          top_p: 1,
          temperature: 0.85,
          repetition_penalty: 1
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const reply = data.choices[0]?.message?.content || "Sorry, I didn't get that.";

      setMessages(prevMessages => [
        ...prevMessages,
        { text: reply, isUser: false }
      ]);
    } catch (error) {
      console.error("Error fetching response from API:", error);
    }
  };

  const startNewChat = () => {
    setMessages([{ text: 'Hello, how can I assist you today?', isUser: false }]);
    Cookies.remove(HOME_CHAT_COOKIE);
  };

  useEffect(() => {
    messageAreaRef.current?.scrollTo({
      top: messageAreaRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const editMessage = (index) => {
    setInput(messages[index].text);
    setEditIndex(index);
  };

  const deleteMessage = (index) => {
    setMessages(messages.filter((_, i) => i !== index));
  };

  return (
    <main>
      <Spline
        scene="https://prod.spline.design/W4nXNJ-GpaUMvHQn/scene.splinecode"
        style={{ 
          width: '100vw', 
          height: '100vh', 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          zIndex: -1 
        }}
      />
      <ChatContainer>
        <MessageArea ref={messageAreaRef}>
          {messages.map((msg, index) => (
            <Message key={index} isUser={msg.isUser}>
              {msg.text}
              <Actions className="actions" isUser={msg.isUser}>
                <button onClick={() => editMessage(index)}><FaEdit /></button>
                <button onClick={() => deleteMessage(index)}><FaTrashAlt /></button>
              </Actions>
            </Message>
          ))}
        </MessageArea>
        
        <Footer>
          <NewChatButton onClick={startNewChat}>Clear Chat</NewChatButton>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={handleKeyPress}
          />
          <SendButton onClick={sendMessage}>
            <FaPaperPlane />
          </SendButton>
        </Footer>
      </ChatContainer>
    </main>
  );
};

export default Home;