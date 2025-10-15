import { useState, useEffect } from 'react';
import { channelAPI, messageAPI } from '../services/api';
import { initializeSocket, joinChannel, onNewMessage } from '../services/socket';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';




const Chat = () => {

    const [channels, setChannels] = useState(null);
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newMessage, setNewMessage] = useState('');



    const fetchChannles = async () => {
        setLoading(true);
        try {
            const Getchannles = await channelAPI.getAll();
            if (Getchannles && Getchannles.data) {
                setChannels(Getchannles.data.channels)
            }

        } catch (error) {
            console.log(error.message)
            setError(error.message)

        } finally {
            setLoading(false);
        }




    }


    const fetchMessage = async (channelId) => {
        setLoading(true);
        try {
            const getMessage = await messageAPI.getMessages(channelId);
            if (getMessage && getMessage.data && getMessage.data.messages) {
                setMessages(getMessage.data.messages)
            }

        } catch (error) {
            console.log(error.message)
            setError(error.message)

        } finally {
            setLoading(false);
        }


    }

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return; // Don't send empty messages

        try {
            const messageData = {
                channel_id: selectedChannel?.id,
                content: newMessage
            };
            await messageAPI.sendMessage(messageData);
            setNewMessage(''); // Clear input after sending
        } catch (error) {
            console.error('Error sending message:', error);
            setError(error.message);
        }
    }

    const handleChannelClick = async (channel) => {
        try {
            setSelectedChannel(channel); // Just set the selected channel
            await fetchMessage(channel.id); // Fetch messages for this channel
            joinChannel(channel.id); // Join Socket.io room
        } catch (error) {
            console.log(error.message)
            setError(error.message)

        }

    }

    useEffect(() => {
        fetchChannles();
        const socket = initializeSocket();
        onNewMessage((message) => {
            setMessages(prev => [...prev, message]);
        });

        return () => {
            if (socket) socket.disconnect();
        };


    }, [])
    return (
       <div className="min-h-screen bg-[var(--color-cream)] dark:bg-slate-950">
            {/* Loading State */}
            {loading && channels === null && (
                <div className="container mx-auto px-8 py-12 pt-28">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                        <p className="text-center text-slate-600 dark:text-slate-400 text-lg">Loading channels...</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="container mx-auto px-8 py-12 pt-28">
                    <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg p-6">
                        <p className="text-center text-rose-600 dark:text-rose-400 text-lg font-semibold">{error}</p>
                    </div>
                </div>
            )}

            {/* Main Chat Interface */}
            {!loading && channels && (
                <div className="container mx-auto px-8 py-12 pt-28">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="font-serif text-6xl font-bold text-slate-900 dark:text-slate-100 mb-2">Chat</h1>
                        <p className="text-slate-600 dark:text-slate-400 text-lg">Real-time collaboration with your team</p>
                    </div>

                    {/* Chat Container */}
                     <div className="grid grid-cols-12 gap-6 min-h-[calc(100vh-280px)]">

                        {/* LEFT SIDEBAR - Channels */}
                        <div className="col-span-3">
                            <Card className="h-full border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl shadow-lg">
                                <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50">
                                    <CardTitle className="text-xl text-slate-900 dark:text-slate-100">Channels</CardTitle>
                                    <CardDescription className="dark:text-slate-400">Select a conversation</CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 overflow-y-auto h-[calc(100%-88px)]">
                                    {channels.length > 0 ? (
                                        <div className="space-y-2">
                                            {channels.map((channel) => (
                                                <button
                                                    key={channel.id}
                                                    onClick={() => handleChannelClick(channel)}
                                                    className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${selectedChannel?.id === channel.id
                                                            ? 'bg-blue-600 text-white shadow-md'
                                                            : 'bg-slate-50/50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-600/50 text-slate-900 dark:text-slate-100'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center font-bold text-sm ${selectedChannel?.id === channel.id
                                                                ? 'bg-white/20 text-white'
                                                                : 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                                                            }`}>
                                                            {channel.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold truncate">{channel.name}</p>
                                                            <p className={`text-xs truncate ${selectedChannel?.id === channel.id
                                                                    ? 'text-blue-100'
                                                                    : 'text-slate-500 dark:text-slate-400'
                                                                }`}>
                                                                {channel.project_name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <p className="text-slate-500 dark:text-slate-400 text-sm">No channels yet</p>
                                            <p className="text-slate-400 dark:text-slate-500 text-xs mt-2">Create a project channel to start</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* RIGHT SIDE - Messages */}
                        <div className="col-span-9">
                            <Card className="h-full border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl shadow-lg flex flex-col">

                                {selectedChannel ? (
                                    <>
                                        {/* Channel Header */}
                                        <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-lg bg-blue-500/10 dark:bg-blue-400/20 flex items-center
  justify-center">
                                                    <div className="h-6 w-6 rounded-lg bg-blue-500 dark:bg-blue-400"></div>
                                                </div>
                                                <div>
                                                    <CardTitle className="text-slate-900 dark:text-slate-100">{selectedChannel.name}</CardTitle>
                                                    <CardDescription className="dark:text-slate-400">
                                                        Project: {selectedChannel.project_name}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        {/* Messages Area */}
                                        <CardContent className="flex-1 overflow-y-auto p-6">
                                            {messages.length > 0 ? (
                                                <div className="space-y-4">
                                                    {messages.map((message) => (
                                                        <div key={message.id} className="flex gap-3">
                                                            {/* Avatar */}
                                                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex        
  items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
                                                                {message.sender_name?.charAt(0).toUpperCase()}
                                                            </div>

                                                            {/* Message Content */}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                                                                        {message.sender_name}
                                                                    </span>
                                                                    <span className="text-xs text-slate-400 dark:text-slate-500">
                                                                        {new Date(message.created_at).toLocaleTimeString([], {
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })}
                                                                    </span>
                                                                </div>
                                                                <div className="bg-slate-50/50 dark:bg-slate-700/50 rounded-lg p-3 border
  border-slate-200/50 dark:border-slate-600/50">
                                                                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                                                                        {message.content}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full text-center">
                                                    <div className="h-20 w-20 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center
  justify-center mb-4">
                                                        <div className="h-10 w-10 rounded-xl bg-slate-300 dark:bg-slate-600"></div>
                                                    </div>
                                                    <p className="text-slate-900 dark:text-slate-100 font-semibold text-lg mb-2">No messages yet</p>
                                                    <p className="text-slate-500 dark:text-slate-400 text-sm">Start the conversation!</p>
                                                </div>
                                            )}
                                        </CardContent>

                                        {/* Input Area */}
                                        <div className="p-6 border-t border-slate-200/50 dark:border-slate-700/50">
                                            <div className="flex gap-3">
                                                <input
                                                    type="text"
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                                    placeholder="Type a message..."
                                                    className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200
  dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-900 dark:text-slate-100       
  placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                                />
                                                <button
                                                    onClick={handleSendMessage}
                                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium
  transition-colors shadow-sm hover:shadow-md"
                                                >
                                                    Send
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                                        <div className="h-24 w-24 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-6">
                                            <div className="h-12 w-12 rounded-xl bg-slate-300 dark:bg-slate-600"></div>
                                        </div>
                                        <p className="text-slate-900 dark:text-slate-100 font-semibold text-xl mb-2">Select a channel</p>
                                        <p className="text-slate-500 dark:text-slate-400">Choose a conversation from the sidebar to start chatting</p>
                                    </div>
                                )}

                            </Card>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Chat;