import { useState, useEffect } from 'react';
import { channelAPI, messageAPI, uploadAPI } from '../services/api';
import { initializeSocket, joinChannel, onNewMessage } from '../services/socket';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSocket } from '../services/socket';
import { useContext } from 'react';  // If not already imported
import { AuthContext } from '../context/AuthContext';




const Chat = () => {
    const { user } = useContext(AuthContext);

    const [channels, setChannels] = useState(null);
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [typingUsers, setTypingUsers] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(null);
    const [messageReactions, setMessageReactions] = useState({});


    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;


        setSelectedFile(file);

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFilePreview(null);
        }
    }

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setFilePreview(null);
    }

    const handleReaction = async (messageId, emoji) => {
        try {
            const reactionData = {
                message_id: messageId,
                emoji: emoji,
                channel_id: selectedChannel?.id
            }
            await messageAPI.addReaction(reactionData);
            setMessageReactions(prev => {
                const messageReacs = prev[messageId] || [];
                const existing = messageReacs.find(r => r.emoji === emoji && r.userId === user?.id);
                if (existing) {
                    return {
                        ...prev,
                        [messageId]: messageReacs.filter(r => !(r.emoji === emoji && r.userId === user?.id))
                    };
                } else {
                    return {
                        ...prev,
                        [messageId]: [...messageReacs, { emoji, userId:user?.id , count:1 }]
                    }
                }
            })
            setShowEmojiPicker(null)
        } catch (error) {
            console.error("Error adding reaction", error)
        }
    }

    const toggleEmojiPicker = (messageId) => {
        setShowEmojiPicker(showEmojiPicker === messageId ? null : messageId);

    }

    const handleSendWithFile = async () => {
        console.log('🚀 handleSendWithFile called!');
        console.log('📝 newMessage:', newMessage);
        console.log('📎 selectedFile:', selectedFile);
        if (!newMessage.trim() && !selectedFile) { console.log('⚠️ Stopped: No message and no file'); return };

        setUploading(true);
        try {
            let attachments = null;

            // Upload file if exists
            if (selectedFile) {
                console.log('📤 Uploading file:', selectedFile.name);
                const uploadResponse = await uploadAPI.uploadFile(selectedFile);
                console.log('✅ Upload response:', uploadResponse.data);

                if (uploadResponse.data.success) {
                    attachments = [uploadResponse.data.file];
                    console.log('📎 Attachments array:', attachments);
                }
            }

            // Send message with or without attachment
            const messageData = {
                channel_id: selectedChannel?.id,
                content: newMessage,
                attachments: attachments
            };

            console.log('📨 Sending message data:', messageData);

            await messageAPI.sendMessage(messageData);  // REMOVED response variable
            console.log('✅ Message sent successfully!');

            // Clear inputs
            setNewMessage('');
            setSelectedFile(null);
            setFilePreview(null);
        } catch (error) {
            console.error('❌ Error sending message:', error);
            setError(error.message);
        } finally {
            setUploading(false);
        }
    };

    let typingTimer = null;
    const handleTyping = () => {
        if (!selectedChannel) return;

        // Send typing start event
        const socket = getSocket();
        if (socket) {
            socket.emit('typing:start', { channelId: selectedChannel.id });
        }

        // Clear existing timer
        if (typingTimer) {
            clearTimeout(typingTimer);
        }

        // Set new timer to stop typing after 3 seconds
        typingTimer = setTimeout(() => {
            handleStopTyping();
        }, 3000);
    };
    const handleStopTyping = () => {
        if (!selectedChannel) return;

        const socket = getSocket();
        if (socket) {
            socket.emit('typing:stop', { channelId: selectedChannel.id });
        }
    };



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

        // Listen for new messages
        onNewMessage((message) => {
            setMessages(prev => [...prev, message]);
        })
        // Listen for typing start
        if (socket) {
            socket.on('user:typing', ({ userId, channelId }) => {
                if (channelId === selectedChannel?.id) {
                    setTypingUsers(prev => {
                        if (!prev.includes(userId)) {
                            return [...prev, userId];
                        }
                        return prev;
                    });
                }
            });

            // Listen for typing stop
            socket.on('user:stopped-typing', ({ userId, channelId }) => {
                if (channelId === selectedChannel?.id) {
                    setTypingUsers(prev => prev.filter(id => id !== userId));
                }
            });
            socket.on('reaction:new', ({ message_id, user_id, emoji }) => {
                console.log('Reaction received:', { message_id, user_id, emoji });
                // For now, just log it - we'll fetch reactions next
            });
        }

        return () => {
            if (socket) socket.disconnect();
        };


    }, [selectedChannel])
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
                                            {messages.map((message) => {
                                                console.log('=== MESSAGE DEBUG ===');
                                                console.log('Full message:', message);
                                                console.log('message.attachments raw:', message.attachments);
                                                console.log('Type of attachments:', typeof message.attachments);

                                                // Parse attachments if exists
                                                const attachments = message.attachments
                                                    ? (typeof message.attachments === 'string'
                                                        ? JSON.parse(message.attachments)
                                                        : message.attachments)
                                                    : null;

                                                console.log('Parsed attachments:', attachments);
                                                console.log('==================');

                                                return (
                                                    <div key={message.id} className="flex gap-3 group">
                                                        {/* Avatar */}
                                                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white
  font-bold text-sm shadow-md flex-shrink-0">
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

                                                                {/* Reaction Button (shows on hover) */}
                                                                <button
                                                                    onClick={() => toggleEmojiPicker(message.id)}
                                                                    className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-lg hover:scale-125 transition-transform"
                                                                    title="Add reaction"
                                                                >
                                                                    😊
                                                                </button>
                                                            </div>

                                                            {/* Message Text */}
                                                            {message.content && (
                                                                <div className="bg-slate-50/50 dark:bg-slate-700/50 rounded-lg p-3 border border-slate-200/50 dark:border-slate-600/50 mb-2">
                                                                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                                                                        {message.content}
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {/* File Attachments */}
                                                            {attachments && attachments.length > 0 && (
                                                                <div className="space-y-2 mb-2">
                                                                    {attachments.map((file, index) => (
                                                                        <div key={index} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg p-3        
  hover:shadow-md transition-shadow">
                                                                            {file.resource_type === 'image' ? (
                                                                                <a href={file.url} target="_blank" rel="noopener noreferrer">
                                                                                    <img
                                                                                        src={file.url}
                                                                                        alt={file.original_filename}
                                                                                        className="max-w-sm max-h-64 rounded cursor-pointer hover:opacity-90 transition-opacity"
                                                                                    />
                                                                                </a>
                                                                            ) : (
                                                                                <a
                                                                                    href={file.url}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 p-2 rounded transition-colors"
                                                                                >
                                                                                    <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/40 rounded flex items-center justify-center">
                                                                                        <span className="text-2xl">📄</span>
                                                                                    </div>
                                                                                    <div className="flex-1 min-w-0">
                                                                                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                                                                                            {file.original_filename}
                                                                                        </p>
                                                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                                            {(file.size / 1024).toFixed(2)} KB • {file.format?.toUpperCase()}
                                                                                        </p>
                                                                                    </div>
                                                                                    <div className="text-blue-600 dark:text-blue-400">
                                                                                        ↓
                                                                                    </div>
                                                                                </a>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            {/* Emoji Picker (Simple) */}
                                                            {showEmojiPicker === message.id && (
                                                                <div className="flex gap-2 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg       
  mb-2">
                                                                    {['👍', '❤️', '😂', '🎉', '🚀', '👏', '🔥', '✨'].map((emoji) => (
                                                                        <button
                                                                            key={emoji}
                                                                            onClick={() => handleReaction(message.id, emoji)}
                                                                            className="text-2xl hover:scale-125 transition-transform"
                                                                        >
                                                                            {emoji}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {messageReactions[message.id] && messageReactions[message.id].length > 0 && (
                                                                <div className="flex gap-2 mt-2 flex-wrap">
                                                                    {messageReactions[message.id].map((reaction, idx) => (
                                                                        <button
                                                                            key={idx}
                                                                            onClick={() => handleReaction(message.id, reaction.emoji)}
                                                                            className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full    
   text-sm transition-colors border border-slate-200 dark:border-slate-600"
                                                                        >
                                                                            <span>{reaction.emoji}</span>
                                                                            <span className="text-xs text-slate-600 dark:text-slate-400">{reaction.count || 1}</span>
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}



                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {/* Typing Indicator */}
                                            {typingUsers.length > 0 && (
                                                <div className="flex gap-3 items-center px-4 py-2">
                                                    <div className="flex gap-1">
                                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                                    </div>
                                                    <span className="text-sm text-slate-500 dark:text-slate-400 italic">
                                                        {typingUsers.length === 1 ? 'Someone' : `${typingUsers.length} people`} typing...
                                                    </span>
                                                </div>
                                            )}
                                        </CardContent>

                                        {/* Input Area */}
                                        <div className="p-6 border-t border-slate-200/50 dark:border-slate-700/50">
                                            {/* File Preview */}
                                            {selectedFile && (
                                                <div className="mb-3 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center gap-3">
                                                    {filePreview ? (
                                                        <img src={filePreview} alt="Preview" className="h-16 w-16 object-cover rounded" />
                                                    ) : (
                                                        <div className="h-16 w-16 bg-slate-200 dark:bg-slate-600 rounded flex items-center justify-center">
                                                            <span className="text-2xl">📄</span>
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{selectedFile.name}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {(selectedFile.size / 1024).toFixed(2)} KB
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={handleRemoveFile}
                                                        className="text-slate-500 hover:text-red-600 dark:hover:text-red-400"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            )}

                                            {/* Input Row */}
                                            <div className="flex gap-3">
                                                {/* File Input (Hidden) */}
                                                <input
                                                    type="file"
                                                    id="file-upload"
                                                    onChange={handleFileSelect}
                                                    className="hidden"
                                                    accept="image/*,application/pdf,.doc,.docx"
                                                />

                                                {/* File Upload Button */}
                                                <label
                                                    htmlFor="file-upload"
                                                    className="px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-200
  dark:border-slate-600 rounded-lg cursor-pointer transition-colors flex items-center justify-center"
                                                >
                                                    <span className="text-xl">📎</span>
                                                </label>

                                                {/* Message Input */}
                                                <input
                                                    type="text"
                                                    value={newMessage}
                                                    onChange={(e) => { setNewMessage(e.target.value); handleTyping(); }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && !uploading) {
                                                            handleStopTyping();
                                                            handleSendWithFile();
                                                        }
                                                    }}
                                                    placeholder="Type a message..."
                                                    disabled={uploading}
                                                    className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none      
  focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-900 dark:text-slate-100 placeholder:text-slate-400
  dark:placeholder:text-slate-500 disabled:opacity-50"
                                                />

                                                {/* Send Button */}
                                                <button
                                                    onClick={handleSendWithFile}
                                                    disabled={uploading || (!newMessage.trim() && !selectedFile)}
                                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow-md
  disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {uploading ? 'Uploading...' : 'Send'}
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