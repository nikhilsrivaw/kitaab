import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { chatAPI } from '../services/api';


const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const sendMessage = async () => {
        if (!input.trim()) return; // empty messages 


        //add user message to chat 
        const userMessage = { role: "user", content: input };
        setMessages([...messages, userMessage]);
        setInput('');

        try {
            //Calling the api 
            const result = await chatAPI.sendMessage(input, messages);
            // Update with full conversation history from backend
            setMessages(result.data.conversationHistory);
        } catch (error) {
            console.error('Chat error', error);
            // Show error Message 
            setMessages([...messages, userMessage, {
                role: 'assistant',
                content: "Sorry , i have encountered an error , please try again"
            }])

        }
    };


    return (
        <>

            {/* Floating Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50"
            >
                {isOpen ? '✕' : '💬'}
            </Button>
            {isOpen && (
                <Card className="fixed bottom-24 right-6 w-96 h-[500px] flex flex-col z-50 shadow-2xl">
                    {/* Header */}
                    <div className="bg-black/80 text-white p-4 rounded-t-lg">
                        <h3 className="font-bold"> Kitaab AI Assistant</h3>
                        <p className="text-xs opacity-90">Ask me anything about your projects!</p>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto">
                        {messages.length === 0 ? (
                            <div className="text-center text-gray-500 mt-8">
                                <p className="text-sm">👋 Hi! I'm your AI assistant.</p>
                                <p className="text-xs mt-2">Try asking:</p>
                                <ul className="text-xs mt-2 space-y-1">
                                    <li>"What projects do I have?"</li>
                                    <li>"Show me pending tasks"</li>
                                </ul>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {messages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === 'user'
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t">
                        <div className="flex gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        sendMessage(); // Call our function
                                    }
                                }}
                                placeholder="Ask me anything..."
                                className="flex-1"
                            />
                            <Button onClick={sendMessage}>
                                Send
                            </Button>
                        </div>
                    </div>
                </Card>
            )}


        </>
    )
}

export default ChatWidget;