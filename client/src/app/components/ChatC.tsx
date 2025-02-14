import React, { useState } from 'react';
import Image from 'next/image';
import { X, Edit2 } from 'lucide-react';

interface User {
    _id: string;
    fullName: string;
    username: string;
    profilePic: string;
    accessToken: string;
    refreshToken: string;
    dateCreatedAt: Date;
}

interface Message {
    owner: string;
    ownerName: string;
    content: string;
    date: Date;
    picture?: string;
    createdAt: Date;
}

interface UserData {
    user: User;
}

interface AuthenticatedUser  {
    data: UserData;
}

interface ChatCProps {
    messages: Message[];
    user: AuthenticatedUser ;
}

const ChatC: React.FC<ChatCProps> = ({ messages, user }) => {
    const [newMessage, setNewMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [editingMessageIndex, setEditingMessageIndex] = useState<number | null>(null);

    const handleEditMessage = (index: number) => {
        setEditingMessageIndex(index);
        setNewMessage(messages[index].content);
    };

    const handleDeleteMessage = (index: number) => {
        // Implement delete logic here (e.g., remove from state or call API)
        console.log(`Delete message at index: ${index}`);
    };

    const handleSendMessage = () => {
        // Implement send message logic here
        console.log('Send message:', newMessage);
        setNewMessage('');
        setSelectedFile(null);
        setEditingMessageIndex(null);
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const renderMessages = () => {
        const messageElements: React.JSX.Element[] =[];
        let lastDate: string | null = null;

        messages.forEach((msg, index) => {
            const messageDate = formatDate(msg.createdAt);
            if (messageDate !== lastDate) {
                messageElements.push(
                    <div key={`date-${index}`} className="text-center text-gray-500 my-2">
                        {messageDate}
                    </div>
                );
                lastDate = messageDate;
            }

            messageElements.push(
                <div key={index} className={`flex ${msg.ownerName === user.data.user.fullName ? 'justify-end' : 'justify-start'}`}>
                    <div
                        className={`w-1/2 p-3 md:p-4 rounded-lg shadow-sm 
                            ${msg.ownerName === user.data.user.fullName ? 'bg-blue-500 text-white' : 'bg-white text-gray-900'}
                        `}
                    >
                        <div className="text-xs font-medium opacity-70">{msg.ownerName}</div>
                        <p className="text-sm leading-relaxed">{msg.content}</p>

                        {msg.picture && (
                            <div className="relative w-full h-40 md:h-60 mt-2 rounded-lg overflow-hidden">
                                <Image
                                    src={msg.picture}
                                    alt="Message Attachment"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}

                        <div className="text-xs opacity-50 text-right">{new Date(msg.createdAt).toLocaleTimeString()}</div>

                        {msg.ownerName === user.data.user.fullName && (
                            <div className="flex justify-end space-x-2 mt-2">
                                <button onClick={() => handleEditMessage(index)} className="text-blue-400 hover:underline">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDeleteMessage(index)} className="text-red-400 hover:underline">
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            );
        });

        return messageElements;
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Messages Container */}
            <div className="flex overflow-y-auto justify-between flex-col p-4 space-y-3 scrollbar-hide">
                {renderMessages()}
            </div>

            {/* Input Bar */}
            
        </div>
    );
};

export default ChatC;