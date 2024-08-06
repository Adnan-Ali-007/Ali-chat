import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';

const ChatPage = () => {
   const [chats, setChats] = useState([]);

   const fetchChats = async () => {
      try {
         const { data } = await axios.get('/api/chat');
         console.log(data); // Log the entire response
         setChats(data.chats); // Extract the chats array from the response
      } catch (error) {
         console.error('Error fetching chats:', error);
      }
   };

   useEffect(() => {
      fetchChats();
   }, []);

   return (
      <div>
         {chats.length === 0 ? (
            <div>No chats available</div>
         ) : (
            chats.map(chat => (
               <div key={chat._id}>
                  {chat.chatName}
               </div>
            ))
         )}
      </div>
   );
};

export default ChatPage;
