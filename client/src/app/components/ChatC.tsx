import React, { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

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
    user: string;
    message: string;
    date: Date;
    image?: string;
}

interface UserData {
    user: User;
}

interface AuthenticatedUser {
    data: UserData;
}

interface ChatCProps {
    messages: Message[];
    user: AuthenticatedUser;
}

const ChatC: React.FC<ChatCProps> = ({ messages, user }) => {
    const [newMessage, setNewMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    return (
        <div className="flex flex-col h-screen bg-gray-100 ">
    {/* Messages Container */}
    <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
        {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.user === user.data.user.fullName ? 'justify-end' : 'justify-start'}`}>
                <div 
                    className={`max-w-[80%] md:max-w-[60%] p-3 md:p-4 rounded-lg shadow-sm 
                        ${msg.user === user.data.user.fullName ? 'bg-blue-500 text-white' : 'bg-white text-gray-900'}
                    `}
                >
                    <div className="text-xs font-medium opacity-70">{msg.user}</div>
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                    
                    {msg.image && (
                        <div className="relative w-full h-40 md:h-60 mt-2 rounded-lg overflow-hidden">
                            <Image
                                src={msg.image}
                                alt="Message Attachment"
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    
                    <div className="text-xs opacity-50 text-right">{new Date(msg.date).toLocaleTimeString()}</div>
                </div>
            </div>
        ))}
    </div>

    {/* Sticky Input Bar (Fixed for Mobile & Desktop) */}
    
</div>

    );
};

export default ChatC;
