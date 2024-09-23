import React, { useState, useEffect } from 'react';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import { ChatState } from '../Context/ChatProvider';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../Config/ChatLogics' 
import GroupChatModel from './miscellaneous/GroupChatModel';
const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats, fetchAgain } = ChatState();
  const toast = useToast();
  // Function to fetch chats
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  // useEffect hook to fetch logged user and chats
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, []);
   
  return <Box     
  d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
  flexDir="column"
  alignItems="center"
  p={3}
  bg="white"
  w={{ base: "100%", md: "40%" }}
  borderRadius="lg"
  borderWidth="1px">
<Box 
    pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center">
   My Chats
   <GroupChatModel>
   <Button
   d="flex"
   fontSize={{base:"17px",md:"10px",lg:"17px"}}
   rightIcon={<AddIcon/>}
   >
  New Group Chat 
   </Button>
   </GroupChatModel>
</Box>
<Box
  d="flex"
  flexDir="column"
  p={3}
  bg="#F8F8F8"
  w="100%"
  h="100%"
  borderRadius="lg"
  overflowY="hidden">
    {chats?(
    <Stack overflowY='scroll'>
      {chats.map((chat)=>(
      <Box  onClick={() => setSelectedChat(chat)}
      cursor="pointer"
      bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
      color={selectedChat === chat ? "white" : "black"}
      px={3}
      py={2}
      borderRadius="lg"
      key={chat._id}>
     <Text>
      {!chat.isGroupChat?getSender(loggedUser,chat.users)
       :chat.chatName} 
     </Text>
      </Box>
      ))}
    </Stack>
    ):(
      <ChatLoading/>
    )}
</Box>
  </Box>;
};
export default MyChats;
