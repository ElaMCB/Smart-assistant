import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Fab,
  Drawer,
  List,
  ListItem,
  Avatar,
  styled,
  keyframes,
  CircularProgress,
  Chip,
  Tooltip,
  Divider,
  Collapse,
  Alert,
} from '@mui/material';
import { Send as SendIcon, Close as CloseIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import { blue, green, red, orange } from '@mui/material/colors';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'analysis' | 'insight' | 'error' | 'chart';
  data?: any;
  expanded?: boolean;
}

const blink = keyframes`
  0% { transform: scaleY(1); }
  5% { transform: scaleY(0.1); }
  10% { transform: scaleY(1); }
  100% { transform: scaleY(1); }
`;

const RoboticFace = styled(Box)(({ theme }) => ({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const Eye = styled(Box)({
  width: '8px',
  height: '12px',
  backgroundColor: 'white',
  borderRadius: '50%',
  position: 'absolute',
  top: '12px',
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '4px',
    height: '4px',
    backgroundColor: 'black',
    borderRadius: '50%',
    top: '4px',
    left: '2px',
  },
});

const LeftEye = styled(Eye)({
  left: '10px',
  animation: `${blink} 4s infinite`,
});

const RightEye = styled(Eye)({
  right: '10px',
  animation: `${blink} 4s infinite`,
  animationDelay: '0.1s',
});

const Mouth = styled(Box)({
  width: '12px',
  height: '4px',
  backgroundColor: 'white',
  borderRadius: '2px',
  position: 'absolute',
  bottom: '12px',
});

const AnalysisCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
  borderLeft: `4px solid ${theme.palette.primary.main}`,
}));

const MetricChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  '&.good': {
    backgroundColor: green[100],
    color: green[800],
  },
  '&.warning': {
    backgroundColor: orange[100],
    color: orange[800],
  },
  '&.critical': {
    backgroundColor: red[100],
    color: red[800],
  },
}));

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your CoA Assistant. I can help you with:\n• Checking CoA status\n• Understanding notifications\n• Creating new CoAs\n• Finding specific CoAs\n• Analyzing data trends\n• Generating reports\n• Document analysis\n• Predictive insights\n\nHow can I assist you today?',
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleMessageExpansion = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, expanded: !msg.expanded } : msg
    ));
  };

  const analyzeData = (data: any) => {
    const trends = {
      passRate: data.passRate > 90 ? 'excellent' : data.passRate > 75 ? 'good' : 'needs improvement',
      deviation: data.avgDeviation < 2 ? 'low' : data.avgDeviation < 5 ? 'moderate' : 'high',
      processing: data.processingTime < 500 ? 'fast' : data.processingTime < 1000 ? 'normal' : 'slow',
    };

    return {
      summary: `Based on the current data:\n• Pass rate is ${trends.passRate}\n• Deviation levels are ${trends.deviation}\n• Processing speed is ${trends.processing}`,
      recommendations: [
        trends.passRate === 'needs improvement' ? 'Consider reviewing quality control procedures' : null,
        trends.deviation === 'high' ? 'Investigate potential sources of variation' : null,
        trends.processing === 'slow' ? 'Look into process optimization opportunities' : null,
      ].filter(Boolean),
      metrics: [
        { label: 'Pass Rate', value: data.passRate, status: trends.passRate },
        { label: 'Deviation', value: data.avgDeviation, status: trends.deviation },
        { label: 'Processing Time', value: data.processingTime, status: trends.processing },
      ],
    };
  };

  const generateInsights = (data: any) => {
    const insights = [];
    
    if (data.passRate < 80) {
      insights.push({
        type: 'critical',
        text: 'The pass rate is below target. Consider reviewing recent quality control measures.',
        action: 'Review QC procedures',
      });
    }
    
    if (data.avgDeviation > 5) {
      insights.push({
        type: 'warning',
        text: 'High deviation levels detected. This may indicate process instability.',
        action: 'Check process parameters',
      });
    }
    
    if (data.processingTime > 800) {
      insights.push({
        type: 'warning',
        text: 'Processing times are elevated. Process optimization may be needed.',
        action: 'Analyze bottlenecks',
      });
    }

    return insights.length > 0 
      ? insights
      : [{
          type: 'good',
          text: 'Current performance metrics are within acceptable ranges. No immediate action required.',
          action: 'Continue monitoring',
        }];
  };

  const getAIResponse = async (userInput: string): Promise<Message> => {
    const input = userInput.toLowerCase();
    
    if (input.includes('analyze') || input.includes('analysis')) {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      const analysis = analyzeData({
        passRate: 85,
        avgDeviation: 3.2,
        processingTime: 750,
      });
      
      setIsTyping(false);
      return {
        id: Math.random().toString(36).substr(2, 9),
        text: analysis.summary,
        sender: 'assistant',
        timestamp: new Date(),
        type: 'analysis',
        data: analysis,
        expanded: true,
      };
    }

    if (input.includes('insight') || input.includes('trend')) {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      const insights = generateInsights({
        passRate: 85,
        avgDeviation: 3.2,
        processingTime: 750,
      });
      
      setIsTyping(false);
      return {
        id: Math.random().toString(36).substr(2, 9),
        text: 'Here are the key insights from your data:',
        sender: 'assistant',
        timestamp: new Date(),
        type: 'insight',
        data: insights,
        expanded: true,
      };
    }

    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return {
        id: Math.random().toString(36).substr(2, 9),
        text: 'Hello! How can I help you with the CoA system today?',
        sender: 'assistant',
        timestamp: new Date(),
      };
    }

    if (input.includes('status')) {
      return {
        id: Math.random().toString(36).substr(2, 9),
        text: 'You can check the status of a CoA in the dashboard. The status will be shown as:\n• Approved: Green checkmark\n• Rejected: Red X\n• Pending: Yellow clock icon\n\nWould you like me to help you find a specific CoA?',
        sender: 'assistant',
        timestamp: new Date(),
      };
    }

    if (input.includes('notification')) {
      return {
        id: Math.random().toString(36).substr(2, 9),
        text: 'The system sends notifications for:\n• Status changes\n• New CoA assignments\n• Due date reminders\n• System updates\n\nYou can manage your notification preferences in the Settings menu.',
        sender: 'assistant',
        timestamp: new Date(),
      };
    }

    if (input.includes('help') || input.includes('what can you do')) {
      return {
        id: Math.random().toString(36).substr(2, 9),
        text: 'I can help you with:\n• Checking CoA status\n• Understanding notifications\n• Creating new CoAs\n• Finding specific CoAs\n• Analyzing data trends\n• Generating reports\n• Document analysis\n• Predictive insights\n• Troubleshooting issues\n\nWhat would you like to know more about?',
        sender: 'assistant',
        timestamp: new Date(),
      };
    }

    if (input.includes('data') || input.includes('analytics')) {
      return {
        id: Math.random().toString(36).substr(2, 9),
        text: 'The analytics dashboard shows:\n• Pass rates\n• Average deviations\n• Processing times\n• Error rates\n• Trend analysis\n\nWould you like me to explain any specific metric or generate insights?',
        sender: 'assistant',
        timestamp: new Date(),
      };
    }

    if (input.includes('create') || input.includes('new')) {
      return {
        id: Math.random().toString(36).substr(2, 9),
        text: 'To create a new CoA:\n1. Go to the "New CoA" section\n2. Fill in the required fields\n3. Upload any necessary documents\n4. Submit for review\n\nWould you like me to guide you through the process?',
        sender: 'assistant',
        timestamp: new Date(),
      };
    }
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      text: 'I\'m here to help with any questions about the CoA system. You can ask about:\n• Status checks\n• Notifications\n• Creating new CoAs\n• Data analysis\n• System features\n• Document processing\n• Predictive analytics\n\nWhat would you like to know?',
      sender: 'assistant',
      timestamp: new Date(),
    };
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const response = await getAIResponse(input);
    setMessages(prev => [...prev, response]);
  };

  const renderMessageContent = (message: Message) => {
    if (message.type === 'analysis' && message.data) {
      return (
        <AnalysisCard>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {message.text}
          </Typography>
          <Box sx={{ mt: 2 }}>
            {message.data.metrics.map((metric: any, index: number) => (
              <MetricChip
                key={index}
                label={`${metric.label}: ${metric.value}`}
                className={metric.status === 'excellent' || metric.status === 'low' || metric.status === 'fast' ? 'good' :
                         metric.status === 'good' || metric.status === 'moderate' || metric.status === 'normal' ? 'warning' : 'critical'}
              />
            ))}
          </Box>
          {message.data.recommendations.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Recommendations:
              </Typography>
              <List dense>
                {message.data.recommendations.map((rec: string, index: number) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <Typography variant="body2">• {rec}</Typography>
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </AnalysisCard>
      );
    }

    if (message.type === 'insight' && message.data) {
      return (
        <AnalysisCard>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {message.text}
          </Typography>
          <Box sx={{ mt: 2 }}>
            {message.data.map((insight: any, index: number) => (
              <Alert
                key={index}
                severity={insight.type === 'critical' ? 'error' : insight.type === 'warning' ? 'warning' : 'success'}
                sx={{ mb: 1 }}
              >
                <Typography variant="body2">{insight.text}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Suggested action: {insight.action}
                </Typography>
              </Alert>
            ))}
          </Box>
        </AnalysisCard>
      );
    }

    return (
      <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
        {message.text}
      </Typography>
    );
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setIsOpen(true)}
      >
        <RoboticFace>
          <LeftEye />
          <RightEye />
          <Mouth />
        </RoboticFace>
      </Fab>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400 } },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: blue[500], mr: 2 }}>
              <RoboticFace>
                <LeftEye />
                <RightEye />
                <Mouth />
              </RoboticFace>
            </Avatar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>CoA Assistant</Typography>
            <IconButton onClick={() => setIsOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            {messages.map((message) => (
              <ListItem
                key={message.id}
                sx={{
                  flexDirection: 'column',
                  alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2,
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.100',
                    color: message.sender === 'user' ? 'white' : 'text.primary',
                    maxWidth: '80%',
                  }}
                >
                  {renderMessageContent(message)}
                </Paper>
                <Typography variant="caption" sx={{ mt: 0.5 }}>
                  {message.timestamp.toLocaleTimeString()}
        </Typography>
              </ListItem>
            ))}
            {isTyping && (
              <ListItem sx={{ justifyContent: 'flex-start' }}>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Analyzing...
              </Typography>
              </ListItem>
            )}
            <div ref={messagesEndRef} />
          </List>

          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <TextField
        fullWidth
        placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        InputProps={{
          endAdornment: (
                  <IconButton color="primary" onClick={handleSend}>
                <SendIcon />
              </IconButton>
          ),
        }}
      />
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default AIAssistant; 