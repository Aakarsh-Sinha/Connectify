import React, { useState, useEffect } from "react";
import Messagebubble from "./Messagebubble";
import axios from "axios";

function Chatwindow({ active }) {
    const [messages, setMessages] = useState([]);
    const [sendmsg, setSendmsg] = useState("");

    useEffect(() => {
        if (active) {
            fetchMessages(active.userId);
        }
    }, [active]);
    useEffect(() => {
        const messageContainer = document.getElementById("messages-container");
        if (messageContainer) {
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }
    }, [messages]);

    const sendmessage = async () => {
        const trimmedMessage = sendmsg.trim();

        if (!trimmedMessage) {
            console.log('Cannot send an empty message');
            return;
        }

        try {
            const userId = localStorage.getItem("userId");
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:5000/api/user/sendmessage",
                {
                    friendId: active.userId,
                    message: sendmsg
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        userId: userId
                    }
                }
            );

            
            setSendmsg("");
            fetchMessages(active.userId);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchMessages = async (friendId) => {
        try {
            const userId = localStorage.getItem("userId");
            const token = localStorage.getItem("token");
            const response = await axios.get('http://localhost:5000/api/user/messages', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    userId: userId
                },
                params: {
                    friendId: friendId
                }
            });

            if (response.status === 200) {
                const messages = response.data;
                setMessages(messages);
            } else {
                console.error('Failed to fetch messages:', response.statusText);
            }

        } catch (error) {
            console.error('Error fetching messages:', error.message);
        }
    };

    if (!active) {
        return (
            <div className="flex flex-col items-center justify-center gap-8 w-[100%] text-3xl font-bold">
                <div className="text-6xl font-bold bg-gradient-to-br from-purple-500 to-indigo-500 text-purple p-[1vw] bg-clip-text text-transparent">Connectify</div>
                <div className="flex flex-col items-center">
                    <div>Your Messages</div>
                    <div>Send a message to start a chat</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col">
            <div className="flex p-[2vw] text-4xl font-bold border-b-2 border-gray-800">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="3vw" height="3vw" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                        <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                    </svg>
                </div>
                <div className="ml-[2vw]">{active.username}</div>
            </div>
            <div id="messages-container" className="grid grid-cols-1 gap-5 h-[90%] px-[2vw] overflow-y-auto" >
                {messages.length === 0 ? (
                    <div>No messages found</div>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className={`flex w-[100%] ${msg.sender === localStorage.getItem("userId") ? 'justify-end' : 'justify-start'}`}>
                            <Messagebubble username={msg.sender === localStorage.getItem("userId") ? 'You' : 'Friend'} message={msg.message} time={msg.timestamp} />
                        </div>
                    ))
                )}
            </div>
            <div className="px-[2vw]">
                <input
                    className="w-[80%] h-[8vh] rounded-xl bg-transparent border-2 border-gray-500 p-[1vw]"
                    placeholder="Message...."
                    value={sendmsg}
                    onChange={e => setSendmsg(e.target.value)}
                />
                <button onClick={sendmessage}>Send</button>
            </div>
        </div>
    );
}

export default Chatwindow;
