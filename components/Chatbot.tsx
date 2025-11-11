import React, { useState, useEffect, useRef } from 'react';
import { getChatbotResponse } from '../services/gemini';
import { useAppContext } from '../hooks/useAppContext';
import { translations } from '../constants';
import type { ChatMessage, GroundingChunk } from '../types';

const Chatbot: React.FC = () => {
    const { language } = useAppContext();
    const t = translations[language];

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [location, setLocation] = useState<{ latitude: number, longitude: number} | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Request user's location when the chatbot is first opened
        if (isOpen && !location) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.warn(`Geolocation error: ${error.message}`);
                    // You could add a message to the chat here informing the user
                }
            );
        }
    }, [isOpen, location]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;

        const newMessages: ChatMessage[] = [...messages, { role: 'user', text: userInput.trim() }];
        setMessages(newMessages);
        setUserInput('');
        setIsLoading(true);

        const chatHistory = messages.slice(-6); // Keep last 3 pairs of user/model messages for context
        const response = await getChatbotResponse(userInput.trim(), chatHistory, location);

        setMessages([...newMessages, { role: 'model', text: response.text, grounding: response.grounding }]);
        setIsLoading(false);
    };

    const GroundingInfo: React.FC<{ chunks: GroundingChunk[] }> = ({ chunks }) => (
        <div className="mt-2 border-t border-gray-200 pt-2">
            <h4 className="text-xs font-semibold text-gray-500 mb-1">{t.sources}</h4>
            <ul className="flex flex-wrap gap-2">
                {chunks.map((chunk, index) => {
                    const source = chunk.web || chunk.maps;
                    if (!source) return null;
                    const icon = chunk.maps ? '🗺️' : '🌐';
                    return (
                        <li key={index}>
                            <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full px-2 py-1 flex items-center transition-colors">
                                {icon} <span className="ml-1 truncate max-w-40">{source.title}</span>
                            </a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-[#138808] text-white rounded-full p-4 shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-110"
                aria-label={t.chatWithUs}
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                )}
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-[90vw] max-w-sm h-[70vh] max-h-[500px] bg-white rounded-xl shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right">
                    <header className="bg-[#FF9933] text-white p-4 rounded-t-xl">
                        <h3 className="font-bold text-lg">{t.appName} {t.chatWithUs}</h3>
                    </header>
                    <div className="flex-1 p-4 overflow-y-auto bg-[#F9F9F2]">
                        {messages.length === 0 && (
                             <div className="text-center text-gray-500 text-sm mt-4">
                                {t.chatPlaceholder}
                            </div>
                        )}
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
                                <div className={`p-3 rounded-lg max-w-xs ${msg.role === 'user' ? 'bg-[#138808] text-white' : 'bg-gray-200 text-gray-800'}`}>
                                    <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                                    {msg.grounding && msg.grounding.length > 0 && <GroundingInfo chunks={msg.grounding} />}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start mb-3">
                                <div className="p-3 rounded-lg bg-gray-200 text-gray-500">
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s] mx-1"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="p-3 border-t bg-white rounded-b-xl">
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder={t.chatPlaceholder}
                                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#FF9933]"
                                disabled={isLoading}
                            />
                            <button type="submit" className="bg-[#FF9933] text-white p-2 rounded-r-md hover:bg-orange-500 disabled:bg-orange-300" disabled={isLoading}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default Chatbot;