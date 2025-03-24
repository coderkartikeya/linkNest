'use client'
import ResponsiveTabBar from '@/app/components/TabBar';
import { IChatGroup } from '@/app/Interfaces/ChatGroup';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import { Message } from '@/app/Interfaces/Message';
import io from "socket.io-client";

interface User {
  _id: string;
  fullName: string;
  username: string;
  profilePic: string;
  accessToken: string;
  refreshToken: string;
  dateCreatedAt: Date;
}

interface UserData {
  user: User;
}

interface AuthenticatedUser {
  data: UserData;
}

const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER!, { withCredentials: true });

const Page = () => {
  const pathname = usePathname();
  const communityId = pathname?.split('/').pop();
  const [messages, setMessages] = useState<Message[]>([]);
  const [group, setGroup] = useState<IChatGroup | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<AuthenticatedUser | null>(null);

  // Get user from localStorage on component mount
  useEffect(() => {
    const data = localStorage.getItem('user');
    if (data) {
      const userData = JSON.parse(data);
      setUser(userData);
    }
  }, []);

  // Fetch group data
  useEffect(() => {
    const fetchGroup = async () => {
      if (!communityId) return;
      
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_ADDRESS}/api/v1/community/getMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: communityId })
        });
        const data = await res.json();
        setGroup(data.message);
      } catch (error) {
        console.error('Error fetching chat group:', error);
      }
    };
    
    fetchGroup();
  }, [communityId, user]);

  const userId = user?.data.user._id;
  const groupId = group?._id;

  // Socket connection and message handling
  useEffect(() => {
    if (!userId || !groupId) return;

    socket.emit("joinRoom", { userId, groupId });

    socket.on("receiveMessage", (messageData) => {
      // Handle received message, including converting base64 image to blob if needed
      const processedMessage = {
        ...messageData,
        image: messageData.image ? 
          (messageData.image.startsWith('data:') ? 
            messageData.image : 
            `data:image/jpeg;base64,${messageData.image}`) 
          : null
      };

      setMessages((prev) => {
        // Add new message and sort
        const updatedMessages = [...prev, processedMessage].sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        return updatedMessages;
      });
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [groupId, userId]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!group?._id) return;
  
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_ADDRESS}/api/v1/messages/allMessages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ groupId: group._id }),
        });
  
        const data = await res.json();
        // Sort messages by date and process images
        const sortedMessages = data.data.map((msg: Message) => ({
          ...msg,
          image: msg.image
              ? (msg.image instanceof File
                  ? URL.createObjectURL(msg.image) // Handle File objects
                  : (typeof msg.image === 'string' && msg.image.startsWith('data:')
                      ? msg.image // Base64 data, keep as-is
                      : (typeof msg.image === 'string' && msg.image.startsWith('http')
                          ? msg.image // Valid URL, keep as-is
                          : `data:image/jpeg;base64,${msg.image}`))) // Raw base64, prepend header
              : null
      })).sort((a: Message, b: Message) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      
      
      
      
        setMessages(sortedMessages);
        // setMessages(data.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
  
    fetchMessages();
  }, [group]);
  // console.log(messages)

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview URL if it's an image
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        // For non-image files, show a placeholder or filename
        setPreviewUrl(null);
      }
    }
  };

  // Handle file button click
  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Cancel file selection
  const cancelFileSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Send message function
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't send if no message or file, or if already loading
    if ((!newMessage.trim() && !selectedFile) || isLoading) return;
    
    setIsLoading(true);

    // Prepare message object for socket and API
    const messageData: Message = {
      message: newMessage,
      groupId: group?._id || '',
      image: selectedFile ? await convertFileToBase64(selectedFile) : '',
      user: userId || '',
      username: user?.data.user.username || '',
      _id: '',
      date: new Date()
    };
    
    try {
      // Send via socket
      socket.emit("sendMessage", messageData);
      
      // Prepare FormData for API
      const formData = new FormData();
      formData.append('text', newMessage);
      
      // Add selected file if any
      if (selectedFile) {
        formData.append('image', selectedFile);
      }
      
      formData.append('user', user?.data?.user?._id || '');     
      formData.append('groupId', group?._id || '');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_ADDRESS}/api/v1/messages/saveMessage`, {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Clear form
        setNewMessage('');
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        console.error('Failed to send message:', result.message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to convert file to base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className='h-screen flex flex-row bg-slate-100 overflow-hidden'>
      <div className='flex-shrink-0'>
        <ResponsiveTabBar />
      </div>
      <div className='flex flex-col w-full h-90vh md:m-5 m-2 overflow-hidden'>
        {/* Header */}
        <div className='bg-white rounded-t-xl p-4 shadow-sm flex-shrink-0'>
          <h2 className='font-bold text-xl text-gray-800'>
            {group?.name || 'Chat Group'}
          </h2>
          <p className='text-sm text-gray-500'>
            {group?.members?.length || 0} members
          </p>
        </div>
        
        {/* Messages container */}
        <div className='flex-grow bg-white p-4 overflow-y-auto scrollbar-hide'>
          {messages.length > 0 ? (
            messages.map((message, index) => {
              // Determine if this message is from the current user
              const isCurrentUser = message.user === user?.data?.user?._id;
              
              // Group messages by date
              const currentMessageDate = new Date(message.date);
              const prevMessageDate = index > 0 
                ? new Date(messages[index - 1].date) 
                : null;
              
              // Check if the date is different from the previous message
              const shouldShowDate = 
                !prevMessageDate || 
                currentMessageDate.toDateString() !== prevMessageDate.toDateString();

              return (
                <React.Fragment key={message._id || index}>
                  {/* Date separator */}
                  {shouldShowDate && (
                    <div className='text-center my-4'>
                      <span className='bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs'>
                        {currentMessageDate.toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                  )}
                  
                  {/* Message */}
                  <div 
                    className={`mb-3 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[90%]`}>
                      {/* User Avatar */}
                      <div 
                        className={`w-8 h-8 rounded-full flex-shrink-0 overflow-hidden 
                          ${!isCurrentUser ? 'bg-blue-100' : 'bg-green-100'}`}
                      >
                        {message.username && (
                          <div 
                            className={`w-full h-full flex items-center justify-center 
                              ${!isCurrentUser ? 'text-blue-600' : 'text-green-600'} font-bold`}
                          >
                            {message.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      
                      {/* Message Content */}
                      <div 
                        className={`rounded-2xl px-3 py-2 max-w-[calc(100%-3rem)] 
                          ${isCurrentUser 
                            ? 'bg-blue-500 text-white rounded-br-none' 
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}
                      >
                        {/* Username */}
                        <p 
                          className={`text-xs mb-1 font-semibold 
                            ${isCurrentUser ? 'text-blue-100' : 'text-gray-600'}`}
                        >
                          {message.username}
                        </p>
                        
                        {/* Image */}
                        {message.image && (
                          <div className='mb-2 rounded-lg overflow-hidden'>
                            <img 
                                src={message.image instanceof File ? URL.createObjectURL(message.image) : message.image} 
                                alt="Shared image" 
                                className="max-w-full h-auto max-h-48 object-contain"
                              />

                          </div>
                        )}
                        
                        {/* Message Text */}
                        {message.message && (
                          <p className='break-words text-sm'>{message.message}</p>
                        )}
                        
                        {/* Timestamp */}
                        <p 
                          className={`text-xs mt-1 text-right 
                            ${isCurrentUser ? 'text-blue-200' : 'text-gray-500'}`}
                        >
                          {new Date(message.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          ) : (
            <div className='h-full flex items-center justify-center text-gray-500'>
              No messages yet. Start the conversation!
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* File preview */}
        {previewUrl && (
          <div className='bg-white p-2 border-t border-gray-200 flex-shrink-0'>
            <div className='relative inline-block'>
              <img 
                src={previewUrl} 
                alt="Preview" 
                className='h-16 w-auto rounded-lg object-cover'
              />
              <button 
                onClick={cancelFileSelection}
                className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs'
              >
                ×
              </button>
            </div>
          </div>
        )}
        
        {/* Selected file but no preview (non-image file) */}
        {selectedFile && !previewUrl && (
          <div className='bg-white p-2 border-t border-gray-200 flex-shrink-0'>
            <div className='relative inline-block bg-gray-100 rounded-lg py-1 px-3'>
              <span className='text-sm'>{selectedFile.name}</span>
              <button 
                onClick={cancelFileSelection}
                className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs'
              >
                ×
              </button>
            </div>
          </div>
        )}
        
        {/* Message input */}
        <div className='bg-white rounded-b-xl p-2 border-t border-gray-200 flex-shrink-0 mb-20 md:mb-1'>
          <form onSubmit={handleSendMessage} className='flex gap-1 items-center'>
            <button 
              type='button'
              onClick={handleFileButtonClick}
              className='text-blue-500 rounded-full p-2 hover:bg-blue-100 focus:outline-none flex-shrink-0'
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <input
              type='file'
              ref={fileInputRef}
              onChange={handleFileSelect}
              className='hidden'
              disabled={isLoading}
            />
            <input
              type='text'
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder='Type your message...'
              className='flex-grow p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-300 text-sm'
              disabled={isLoading}
            />
            <button 
              type='submit'
              className={`${isLoading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-full p-2 focus:outline-none focus:ring-1 focus:ring-blue-300 flex-shrink-0`}
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;