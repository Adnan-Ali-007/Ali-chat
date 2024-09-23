import React from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box, Text, IconButton, Flex } from '@chakra-ui/react'; // Added Flex for easier layout control
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../Config/ChatLogics';
import ProfileModel from './miscellaneous/ProfileModel'; // Profile modal component
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();

  return (
    <>
      {selectedChat ? (
        <>
          <Flex
            fontSize={{ base: '28px', md: '30px' }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            justifyContent="space-between"
            alignItems="center"
          >
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat('')}
            />

            {!selectedChat.isGroupChat ? (
              <>
                {/* Display the sender's name */}
                <Text>{getSender(user, selectedChat.users)}</Text>

                {/* Align the eye icon (ProfileModel) to the far right */}
                <Box ml="auto"> {/* This moves the eye icon to the far right */}
                  <ProfileModel user={getSenderFull(user, selectedChat.users)} />
                </Box>
              </>
            ) : (
              <>
                {/* Display the group chat name */}
                <Text>{selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  />
                </Text>
                <Box>
                  Message is here
                </Box>
                {/* UpdateGroupChatModal can go here if needed */}
              </>
            )}
          </Flex>
        </>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
