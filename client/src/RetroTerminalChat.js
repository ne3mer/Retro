import React, { useState, useEffect, useRef } from "react";

const RetroTerminalChat = () => {
  const [messages, setMessages] = useState([
    {
      sender: "system",
      text: "SYSTEM INITIALIZED: WELCOME TO TERMINALX-9000 By NE3MA",
    },
    { sender: "system", text: "ARTIFICIAL INTELLIGENCE UNIT ONLINE" },
    { sender: "system", text: "ENTER COMMAND:" },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [systemStatus, setSystemStatus] = useState({
    cpu: "OPERATIONAL",
    memory: "640K (SUFFICIENT)",
    network: "CONNECTED",
    users: 1,
  });
  const [commandHistory, setCommandHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Focus input on component mount and after each AI response
  useEffect(() => {
    inputRef.current?.focus();
  }, [messages, isThinking]);

  // AI response generator with built-in commands
  const generateAIResponse = (userMessage) => {
    // Convert message to uppercase to match terminal aesthetic
    const message = userMessage.toUpperCase();

    // Keywords to check in the user's message
    const keywords = {
      HELLO: [
        "GREETINGS HUMAN.",
        "HELLO USER. HOW MAY I ASSIST YOU?",
        "COMMUNICATION RECEIVED.",
      ],
      HELP: [
        "AVAILABLE COMMANDS: HELP, STATUS, VERSION, CLEAR, EXIT",
        "HOW MAY I ASSIST YOU?",
      ],
      STATUS: [
        "ALL SYSTEMS OPERATIONAL. CPU LOAD: 42%",
        "SYSTEMS FUNCTIONING WITHIN NORMAL PARAMETERS.",
      ],
      VERSION: [
        "TERMINALX-9000 VERSION 1.0.83 (BUILD 2584)",
        "CURRENT SOFTWARE VERSION: MS-DOS 5.0 COMPATIBLE",
      ],
      CLEAR: ["SCREEN BUFFER CLEARED."],
      EXIT: ["TERMINATING SESSION... GOODBYE."],
      NAME: [
        "I AM DESIGNATED AS TERMINALX-9000, AN ADVANCED AI TERMINAL SYSTEM.",
      ],
      WEATHER: [
        "CURRENT ATMOSPHERIC CONDITIONS UNAVAILABLE. SENSOR ARRAY OFFLINE.",
      ],
      TIME: [
        `CURRENT SYSTEM TIME: ${new Date().toLocaleTimeString().toUpperCase()}`,
      ],
      DATE: [
        `CURRENT SYSTEM DATE: ${new Date().toLocaleDateString().toUpperCase()}`,
      ],
    };

    // Check for special commands
    if (message === "CLEAR") {
      setTimeout(() => {
        setMessages([
          { sender: "system", text: "SCREEN BUFFER CLEARED" },
          { sender: "system", text: "TERMINAL READY" },
        ]);
      }, 500);
      return "EXECUTING CLEAR COMMAND...";
    }

    if (message === "STATUS") {
      // Randomly update CPU and network status for effect
      setTimeout(() => {
        setSystemStatus((prev) => ({
          ...prev,
          cpu: Math.random() > 0.5 ? "OPERATIONAL" : "RUNNING AT 87% CAPACITY",
          network: Math.random() > 0.3 ? "CONNECTED" : "INTERMITTENT",
        }));
      }, 1000);
    }

    // Check if the message contains any keywords
    for (const [key, responses] of Object.entries(keywords)) {
      if (message.includes(key)) {
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }

    // Default responses if no keywords match
    const defaultResponses = [
      "PROCESSING YOUR REQUEST...",
      "ANALYZING INPUT... NO CLEAR DIRECTIVE FOUND.",
      'COMMAND NOT RECOGNIZED. TRY "HELP" FOR AVAILABLE COMMANDS.',
      "I REQUIRE MORE SPECIFIC PARAMETERS TO PROCESS THIS REQUEST.",
      "AFFIRMATIVE. I WILL PROCESS THIS INFORMATION.",
      "NEGATIVE. UNABLE TO COMPLY WITH REQUEST.",
      "YOUR INPUT HAS BEEN LOGGED. AWAITING FURTHER INSTRUCTIONS.",
      "THAT INFORMATION IS CLASSIFIED, USER.",
      "INTERESTING QUERY. MY CIRCUITS ARE PROCESSING...",
      "THE ANSWER TO THAT IS COMPLEX. SIMPLIFYING...",
    ];

    return defaultResponses[
      Math.floor(Math.random() * defaultResponses.length)
    ];
  };

  // Simulate typing animation for AI responses
  const simulateTypingAnimation = (response) => {
    let displayedResponse = "";
    const typingInterval = setInterval(() => {
      if (displayedResponse.length < response.length) {
        displayedResponse += response[displayedResponse.length];
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { sender: "ai", text: displayedResponse },
        ]);
      } else {
        clearInterval(typingInterval);
        setIsThinking(false);
      }
    }, 30); // 30ms per character
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const userInput = input.trim();

    // Add user message
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userInput.toUpperCase() },
    ]);

    // Add to command history
    setCommandHistory((prev) => {
      const newHistory = [userInput.toUpperCase(), ...prev];
      return newHistory.slice(0, 4); // Keep only last 4 commands
    });

    // Start AI response
    setIsThinking(true);
    setMessages((prev) => [...prev, { sender: "ai", text: "" }]);

    // Random delay to simulate "thinking"
    setTimeout(() => {
      const aiResponse = generateAIResponse(userInput);
      simulateTypingAnimation(aiResponse);
    }, 500 + Math.random() * 1500); // Random delay between 0.5 and 2 seconds

    setInput("");
  };

  // Function to calculate a "random" hash code for system display
  const getHashCode = () => {
    const characters = "0123456789ABCDEF";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-4 flex flex-col">
      <div className="mb-4 border-b border-green-500 pb-2">
        <h1 className="text-xl text-center">
          TERMINALX-9000 ARTIFICIAL INTELLIGENCE SYSTEM
        </h1>
        <p className="text-center">© 1983 CYBERDYNE SYSTEMS</p>
      </div>

      <div className="flex-1 overflow-auto mb-4 border border-green-500 p-4 bg-black">
        <div className="space-y-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${
                message.sender === "user" ? "text-cyan-400" : "text-green-500"
              }`}
            >
              {message.sender === "user" ? "> " : ""}
              {message.text}
            </div>
          ))}
          {isThinking && <div className="text-green-500">_</div>}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex border border-green-500 bg-black"
      >
        <div className="px-2 py-1 text-green-500"></div>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-black text-green-500 outline-none px-2 py-1"
          disabled={isThinking}
          autoComplete="off"
        />
        <div
          className={`px-2 py-1 ${cursorVisible ? "opacity-100" : "opacity-0"}`}
        >
          _
        </div>
      </form>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="border border-green-500 p-2">
          <div className="text-center mb-1">SYSTEM STATUS</div>
          <div className="text-xs">
            <div>CPU: {systemStatus.cpu}</div>
            <div>MEMORY: {systemStatus.memory}</div>
            <div>NETWORK: {systemStatus.network}</div>
            <div>USERS: {systemStatus.users}</div>
            <div>HASH: {getHashCode()}</div>
          </div>
        </div>
        <div className="border border-green-500 p-2">
          <div className="text-center mb-1">COMMAND HISTORY</div>
          <div className="text-xs">
            {commandHistory.length > 0 ? (
              commandHistory.map((cmd, index) => (
                <div key={index}>
                  {cmd.length > 20 ? cmd.substring(0, 20) + "..." : cmd}
                </div>
              ))
            ) : (
              <div>NO PREVIOUS COMMANDS</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetroTerminalChat;
