import { Toast } from '@chakra-ui/react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory from react-router-dom
const ChatContext = createContext();
const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState(); // Define initialState (null in this case)
  const [chats, setChats] = useState([]); 
  const [notification,setNotification]=useState([])
  const history = useHistory(); // Initialize useHistory
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    setUser(userInfo);
    if (!userInfo) {
      Toast({
        title: "You must log in first.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      console.log(history);
      history.push('/'); // Navigate to the login page
    }
  }, [history, Toast])
  return (
    <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat,chats,setChats,notification,setNotification}}>
      {children}
    </ChatContext.Provider>
  );
};
export const ChatState = () => {
  return useContext(ChatContext);
};
export default ChatProvider;
