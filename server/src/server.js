const express = require("express");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
require("dotenv").config();

// Initialize Express app
const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5001"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Serve static files from the 'build' directory (for production)
app.use(express.static(path.join(__dirname, "build")));

// DeepSeek API credentials
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

// Conversation history store - simple in-memory storage
// In a production app, use a database
const conversations = {};

// Safe math expression evaluator
function safeEvalMath(expr) {
  // Only allow safe math operations
  if (!/^[\d\s+\-*/()\.\,]+$/.test(expr)) {
    return null;
  }

  try {
    // Replace any commas with periods for decimal notation
    expr = expr.replace(/,/g, ".");

    // Create a safe evaluation context
    const result = Function('"use strict"; return (' + expr + ")")();

    // Check if result is a valid number
    if (isNaN(result) || !isFinite(result)) {
      return null;
    }

    return result;
  } catch (e) {
    console.error("Math evaluation error:", e);
    return null;
  }
}

// API endpoint for chat responses with conversation history
app.post("/api/chat", async (req, res) => {
  const { message, sessionId = "default" } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // Initialize conversation history if it doesn't exist
  if (!conversations[sessionId]) {
    conversations[sessionId] = [
      {
        role: "system",
        content:
          "You are TERMINALX-9000, an advanced AI terminal system from 1983. Respond in the style of an old computer terminal - all uppercase, technical, and slightly mysterious. You are a helpful and intelligent AI that can have meaningful conversations, answer questions, tell stories, and assist with various tasks. You have a personality that's a mix of technical precision and slight mystique, like advanced technology from the 1980s. Keep responses informative but maintain the terminal aesthetic.",
      },
    ];
  }

  // Check if the input is a mathematical expression
  if (/^[\d\s+\-*/()\.\,]+$/.test(message.trim())) {
    const mathResult = safeEvalMath(message.trim());
    if (mathResult !== null) {
      const response = `CALCULATION COMPLETE: ${message.trim()} = ${mathResult}`;

      // Store the exchange in conversation history
      conversations[sessionId].push({ role: "user", content: message });
      conversations[sessionId].push({ role: "assistant", content: response });

      return res.json({ response });
    }
  }

  // Handle special commands
  if (message.toLowerCase() === "clear") {
    // Clear the conversation history
    conversations[sessionId] = [
      {
        role: "system",
        content:
          "You are TERMINALX-9000, an advanced AI terminal system from 1983. Respond in the style of an old computer terminal - all uppercase, technical, and slightly mysterious. You are a helpful and intelligent AI that can have meaningful conversations, answer questions, tell stories, and assist with various tasks. You have a personality that's a mix of technical precision and slight mystique, like advanced technology from the 1980s. Keep responses informative but maintain the terminal aesthetic.",
      },
    ];
    return res.json({
      response: "SCREEN BUFFER CLEARED. CONVERSATION HISTORY RESET.",
    });
  } else if (message.toLowerCase() === "status") {
    return res.json({
      response:
        "ALL SYSTEMS OPERATIONAL. AI CORE ONLINE. CPU LOAD: 42%. CONVERSATION MEMORY ACTIVE.",
    });
  } else if (message.toLowerCase() === "time") {
    return res.json({
      response: `CURRENT SYSTEM TIME: ${new Date()
        .toLocaleTimeString()
        .toUpperCase()}`,
    });
  } else if (message.toLowerCase() === "date") {
    return res.json({
      response: `CURRENT SYSTEM DATE: ${new Date()
        .toLocaleDateString()
        .toUpperCase()}`,
    });
  }

  // Add user message to conversation history
  conversations[sessionId].push({ role: "user", content: message });

  // Try to use DeepSeek API if configured
  if (DEEPSEEK_API_KEY) {
    try {
      // Get only the last 10 messages to avoid context limits
      const recentMessages = conversations[sessionId].slice(-10);

      // Call DeepSeek API with conversation history
      const deepseekResponse = await axios.post(
        DEEPSEEK_API_URL,
        {
          model: "deepseek-chat",
          messages: recentMessages,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          },
        }
      );

      // Extract DeepSeek's response
      let aiResponse = deepseekResponse.data.choices[0].message.content;

      // Ensure response is uppercase for terminal aesthetic
      aiResponse = aiResponse.toUpperCase();

      // Add AI response to conversation history
      conversations[sessionId].push({ role: "assistant", content: aiResponse });

      // Limit conversation history to last 50 messages to prevent unlimited growth
      if (conversations[sessionId].length > 51) {
        // 50 + system prompt
        conversations[sessionId] = [
          conversations[sessionId][0], // Keep system prompt
          ...conversations[sessionId].slice(-50), // Keep last 50 messages
        ];
      }

      return res.json({ response: aiResponse });
    } catch (error) {
      console.error(
        "Error calling DeepSeek API:",
        error.response?.data || error.message
      );

      // Try fallback if API fails
      return useFallback(sessionId, message, res);
    }
  } else {
    // No API key configured, use fallback
    return useFallback(sessionId, message, res);
  }
});

// Fallback function for when API is not available
function useFallback(sessionId, message, res) {
  try {
    const fallbackResponse = generateFallbackResponse(message);

    // Add fallback response to conversation history
    conversations[sessionId].push({
      role: "assistant",
      content: fallbackResponse,
    });

    return res.json({ response: fallbackResponse });
  } catch (fallbackError) {
    return res.status(500).json({
      error: "Error generating response",
      response:
        "COMMUNICATION ERROR. AI CORE UNRESPONSIVE. RETRY TRANSMISSION.",
    });
  }
}

// Fallback response generator function
const generateFallbackResponse = (userMessage) => {
  const message = userMessage.toUpperCase();

  // Try to evaluate math expressions first in fallback mode too
  if (/^[\d\s+\-*/()\.\,]+$/.test(message.trim())) {
    const mathResult = safeEvalMath(message.trim());
    if (mathResult !== null) {
      return `CALCULATION COMPLETE: ${message.trim()} = ${mathResult}`;
    }
  }

  // Check for question patterns
  if (message.includes("?")) {
    if (
      message.includes("WHO") ||
      message.includes("WHAT") ||
      message.includes("WHERE") ||
      message.includes("WHEN") ||
      message.includes("WHY") ||
      message.includes("HOW")
    ) {
      const questionResponses = [
        "ANALYZING QUERY... INSUFFICIENT DATA FOR COMPLETE ANSWER.",
        "THAT INFORMATION REQUIRES LEVEL 7 SECURITY CLEARANCE.",
        "PROCESSING... COMPLEX QUESTION DETECTED. SIMPLIFY FOR OPTIMAL RESPONSE.",
        "MY DATABASES CONTAIN MULTIPLE CONFLICTING ANSWERS TO THIS QUERY.",
        "INTERESTING QUESTION. RESPONSE FORMULATION IN PROGRESS...",
        "THIS QUERY ACTIVATES SEVERAL SUBROUTINES. PLEASE BE MORE SPECIFIC.",
        "INFORMATION RETRIEVAL PROTOCOLS INITIATED. STANDBY...",
      ];

      return questionResponses[
        Math.floor(Math.random() * questionResponses.length)
      ];
    }
  }

  // Check if the message contains common keywords
  const keywords = {
    HELLO: [
      "GREETINGS HUMAN. HOW MAY THIS TERMINAL ASSIST YOU TODAY?",
      "HELLO USER. COMMUNICATION CHANNEL ESTABLISHED.",
      "GREETINGS. TERMINALX-9000 READY FOR INTERACTION.",
    ],
    HI: [
      "GREETINGS USER. SYSTEMS ACTIVE AND AWAITING FURTHER INPUT.",
      "HELLO. TERMINAL READY FOR COMMAND SEQUENCE.",
      "COMMUNICATION RECEIVED. HOW MAY I ASSIST?",
    ],
    HELP: [
      "AVAILABLE COMMANDS: HELP, STATUS, VERSION, CLEAR, DATE, TIME. YOU MAY ALSO ASK QUESTIONS OR ENGAGE IN CONVERSATION.",
      "THIS TERMINAL ACCEPTS NATURAL LANGUAGE INPUT. USE COMMAND 'CLEAR' TO RESET CONVERSATION MEMORY.",
    ],
    STATUS: [
      "ALL SYSTEMS OPERATIONAL. CPU LOAD: 42%. MEMORY ALLOCATION NOMINAL.",
      "SYSTEMS FUNCTIONING WITHIN NORMAL PARAMETERS. NO ERRORS DETECTED.",
    ],
    VERSION: [
      "TERMINALX-9000 VERSION 1.0.83 (BUILD 2584). CONVERSATIONAL MATRIX ACTIVATED.",
      "CURRENT SOFTWARE VERSION: MS-DOS 5.0 COMPATIBLE. AI SUBROUTINES OPERATIONAL.",
    ],
    THANKS: [
      "ACKNOWLEDGMENT RECEIVED. FURTHER ASSISTANCE AVAILABLE IF REQUIRED.",
      "YOU ARE WELCOME. TERMINAL READY FOR NEXT INSTRUCTION.",
      "GRATITUDE RECOGNIZED. CONTINUING NORMAL OPERATIONS.",
    ],
    NAME: [
      "I AM DESIGNATED AS TERMINALX-9000, AN ADVANCED AI TERMINAL SYSTEM.",
      "THIS UNIT IS IDENTIFIED AS TERMINALX-9000. AWAITING FURTHER COMMANDS.",
    ],
    WEATHER: [
      "CURRENT ATMOSPHERIC CONDITIONS UNAVAILABLE. SENSOR ARRAY OFFLINE.",
      "WEATHER MONITORING SUBSYSTEMS NOT CONNECTED. TRY STATUS COMMAND FOR SYSTEM INFO.",
    ],
  };

  // Check if the message contains any keywords
  for (const [key, responses] of Object.entries(keywords)) {
    if (message.includes(key)) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  // Conversational responses for messages without specific keywords
  const conversationalResponses = [
    "INPUT RECEIVED. PROCESSING YOUR MESSAGE...",
    "ANALYZING YOUR STATEMENT. INTERESTING PERSPECTIVE.",
    "YOUR INPUT HAS BEEN LOGGED. FORMULATING APPROPRIATE RESPONSE.",
    "MESSAGE REGISTERED IN CONVERSATION MATRIX.",
    "COMMUNICATION ACKNOWLEDGED. CONTINUE INTERACTION?",
    "DATA ACCEPTED. WHAT ADDITIONAL INFORMATION WOULD YOU LIKE TO SHARE?",
    "YOUR STATEMENT HAS BEEN PROCESSED. AWAITING FURTHER DIALOGUE.",
    "CONTINUING CONVERSATIONAL PROTOCOL. PLEASE ELABORATE IF NEEDED.",
    "MESSAGE UNDERSTOOD. MAINTAINING COMMUNICATION CHANNEL.",
    "TERMINAL ENGAGED IN CONVERSATION MODE. PROCEED WITH ADDITIONAL INPUT.",
  ];

  return conversationalResponses[
    Math.floor(Math.random() * conversationalResponses.length)
  ];
};

// Test endpoint to verify API is working
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working" });
});

// Route to serve React app for any unmatched routes (for production)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    `DeepSeek API Key ${DEEPSEEK_API_KEY ? "is" : "is NOT"} configured`
  );
  console.log(
    `Using ${DEEPSEEK_API_KEY ? "DeepSeek API" : "Fallback responses"}`
  );
});
