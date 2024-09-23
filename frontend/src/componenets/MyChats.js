import React, { useState, useEffect } from 'react';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import { ChatState } from '../Context/ChatProvider';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import { getSender } from '../Config/ChatLogics';
import GroupChatModel from './miscellaneous/GroupChatModel';
const MyChats = ({ refreshChats }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats, fetchAgain } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get('/api/chat', config);
      setChats(data);
    } catch (error) {
      toast({
        title: 'Error Occurred!',
        description: 'Failed to Load the chats',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
    fetchChats();
  }, [fetchAgain, refreshChats]);

  return (
    <Box
      display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDirection="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: '100%', md: '40%' }}
      borderRadius="lg"
      borderWidth="1px"
      height="100%" // Set the height of the entire component
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: '28px', md: '30px' }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModel>
          <Button
            display="flex"
            fontSize={{ base: '17px', md: '10px', lg: '17px' }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModel>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%" // Set height to 100% for proper centering
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                color={selectedChat === chat ? 'white' : 'black'}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%" // Make sure this takes the full height of its container
            width="100%"  // Full width for proper centering
          >
            <Text fontSize="xl" color="gray.500">
              Click on a user to start chatting
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};
export default MyChats;
