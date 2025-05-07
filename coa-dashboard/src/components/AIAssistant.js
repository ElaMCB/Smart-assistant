import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, TextField, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import './AIAssistant.css';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const responses = {
    greetings: [
      "Hello! How can I help you today?",
      "Hi there! What can I do for you?",
      "Greetings! How may I assist you?"
    ],
    help: [
      "I can help you with:\n• Dashboard navigation\n• Data interpretation\n• System status\n• Performance metrics\n• User analytics",
      "Here's what I can do:\n• Explain dashboard features\n• Show data trends\n• Provide system insights\n• Analyze user behavior\n• Answer your questions"
    ],
    data: [
      "Current dashboard metrics:\n• Active users: 1,234\n• System uptime: 99.9%\n• Response time: 120ms\n• Data points: 45,678\n• Alerts: 3",
      "Latest statistics:\n• User engagement: 85%\n• System performance: Excellent\n• Data accuracy: 99.5%\n• Processing speed: 2.5s\n• Error rate: 0.1%"
    ],
    features: [
      "Available features:\n• Real-time monitoring\n• Custom reports\n• Data visualization\n• Alert management\n• User analytics",
      "Dashboard capabilities:\n• Interactive charts\n• Export functionality\n• Custom dashboards\n• Role-based access\n• API integration"
    ],
    default: [
      "I'm not sure I understand. Could you rephrase that?",
      "Could you be more specific about what you're looking for?",
      "I'm here to help with dashboard-related questions. What would you like to know?"
    ]
  };

  const getResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return responses.greetings[Math.floor(Math.random() * responses.greetings.length)];
    }
    if (input.includes('help') || input.includes('what can you do')) {
      return responses.help[Math.floor(Math.random() * responses.help.length)];
    }
    if (input.includes('data') || input.includes('metrics') || input.includes('statistics')) {
      return responses.data[Math.floor(Math.random() * responses.data.length)];
    }
    if (input.includes('feature') || input.includes('capability') || input.includes('function')) {
      return responses.features[Math.floor(Math.random() * responses.features.length)];
    }
    
    return responses.default[Math.floor(Math.random() * responses.default.length)];
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse = getResponse(input);
      setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);
    }, 500);
  };

  return (
    <Box className="ai-assistant-container">
      <Box className="ai-assistant-widget">
        <Box className="robot-face">
          <Box className="eyes">
            <Box className={`eye ${isBlinking ? 'blink' : ''}`} />
            <Box className={`eye ${isBlinking ? 'blink' : ''}`} />
          </Box>
          <Box className="mouth" />
        </Box>
        <Typography variant="subtitle2" className="ai-text">CoA AI</Typography>
      </Box>

      {isOpen && (
        <Paper className="chat-container">
          <Box className="messages">
            {messages.map((message, index) => (
              <Box key={index} className={`message ${message.sender}`}>
                {message.text.split('\n').map((line, i) => (
                  <Typography key={i} variant="body2">
                    {line}
                  </Typography>
                ))}
              </Box>
            ))}
          </Box>
          <Box className="input-container">
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
            />
            <IconButton onClick={handleSend} color="primary">
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default AIAssistant; 