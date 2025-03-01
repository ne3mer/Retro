import React, { useState, useEffect } from "react";

const HackerTerminalUI = () => {
  const [ipAddresses, setIpAddresses] = useState([]);
  const [hexDump, setHexDump] = useState([]);
  const [statusMessages, setStatusMessages] = useState([]);
  const [scanProgress, setScanProgress] = useState(0);

  // Generate random IP address
  const generateRandomIP = () => {
    return `${Math.floor(Math.random() * 255)}.${Math.floor(
      Math.random() * 255
    )}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  };

  // Generate hex dump data
  const generateHexDump = () => {
    const hexChars = "0123456789ABCDEF";
    let result = [];

    for (let i = 0; i < 4; i++) {
      let line = "0x";
      for (let j = 0; j < 8; j++) {
        line += hexChars[Math.floor(Math.random() * 16)];
      }
      line += ": ";

      for (let j = 0; j < 8; j++) {
        for (let k = 0; k < 2; k++) {
          line += hexChars[Math.floor(Math.random() * 16)];
        }
        line += " ";
      }

      result.push(line);
    }

    return result;
  };

  // Generate status messages
  const generateStatusMessages = () => {
    const messages = [
      "BYPASSING FIREWALL...",
      "DECRYPTING SSL TRAFFIC...",
      "SCANNING FOR VULNERABILITIES...",
      "BRUTE FORCE IN PROGRESS...",
      "PACKET SNIFFER ACTIVATED",
      "INITIALIZING BACKDOOR...",
      "ACCESSING SECURE MAINFRAME...",
      "DEPLOYING REMOTE SHELL...",
      "TRACE DETECTION NEGATIVE",
      "INTRUSION DETECTION BYPASSED",
      "CRYPTOGRAPHIC HANDSHAKE COMPLETE",
      "SECURED CONNECTION ESTABLISHED",
      "PROXY TUNNELING ACTIVE",
      "VPN TUNNEL ESTABLISHED",
      "NETWORK TRAFFIC REROUTED",
    ];

    const result = [];
    const shuffled = [...messages].sort(() => 0.5 - Math.random());

    for (let i = 0; i < 5; i++) {
      result.push({
        message: shuffled[i],
        timestamp: new Date().toLocaleTimeString(),
        status: Math.random() > 0.3 ? "SUCCESS" : "FAILED",
      });
    }

    return result;
  };

  // Initialize data
  useEffect(() => {
    // Generate initial data
    const ips = Array(5)
      .fill()
      .map(() => ({
        address: generateRandomIP(),
        status: Math.random() > 0.7 ? "VULNERABLE" : "SECURE",
        ports: `${Math.floor(Math.random() * 1000) + 20}, ${
          Math.floor(Math.random() * 1000) + 20
        }, ${Math.floor(Math.random() * 1000) + 20}`,
      }));

    setIpAddresses(ips);
    setHexDump(generateHexDump());
    setStatusMessages(generateStatusMessages());

    // Update scan progress periodically
    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          // Reset and regenerate some data when complete
          setHexDump(generateHexDump());
          setStatusMessages(generateStatusMessages());
          return 0;
        }
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, 300);

    // Regenerate IP list periodically
    const ipInterval = setInterval(() => {
      const newIp = {
        address: generateRandomIP(),
        status: Math.random() > 0.7 ? "VULNERABLE" : "SECURE",
        ports: `${Math.floor(Math.random() * 1000) + 20}, ${
          Math.floor(Math.random() * 1000) + 20
        }`,
      };

      setIpAddresses((prev) => {
        const updated = [...prev];
        updated.shift(); // Remove first item
        updated.push(newIp); // Add new item at end
        return updated;
      });
    }, 5000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(ipInterval);
    };
  }, []);

  return (
    <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono text-green-500">
      {/* Network Scanner */}
      <div className="border border-green-500 p-2">
        <div className="text-center mb-1">NETWORK SCAN IN PROGRESS</div>
        <div className="mb-2 bg-black border border-green-500">
          <div
            className="bg-green-900 h-2"
            style={{ width: `${scanProgress}%` }}
          ></div>
        </div>
        <div className="h-24 overflow-y-auto">
          {ipAddresses.map((ip, index) => (
            <div key={index} className="mb-1 flex justify-between">
              <span>{ip.address}</span>
              <span
                className={
                  ip.status === "VULNERABLE" ? "text-red-500" : "text-green-500"
                }
              >
                {ip.status} [PORTS: {ip.ports}]
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Status Log */}
      <div className="border border-green-500 p-2">
        <div className="text-center mb-1">SYSTEM LOG</div>
        <div className="h-24 overflow-y-auto">
          {statusMessages.map((item, index) => (
            <div key={index} className="mb-1 flex justify-between">
              <span>
                [{item.timestamp}] {item.message}
              </span>
              <span
                className={
                  item.status === "FAILED" ? "text-red-500" : "text-green-500"
                }
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Memory Dump */}
      <div className="border border-green-500 p-2 col-span-2">
        <div className="text-center mb-1">MEMORY DUMP</div>
        <div className="grid grid-cols-2 gap-2">
          <div className="font-mono text-xs">
            {hexDump.slice(0, 2).map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
          <div className="font-mono text-xs">
            {hexDump.slice(2).map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackerTerminalUI;
