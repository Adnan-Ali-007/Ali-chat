import React, { useEffect, useState } from 'react';
import { ChatState} from '../Context/ChatProvider';
import { Box, Text, IconButton, Flex, Spinner, FormControl, Input, position, Toast, Tooltip, Avatar } from '@chakra-ui/react'; // Combined into a single import
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull, isSameSender } from '../Config/ChatLogics';
import ProfileModel from './miscellaneous/ProfileModel';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import './styles.css'
import ScrollableChat from './ScrollableChat';
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
      console.log(messages);
      setMessages(data);
      setLoading(false);
    } catch (error) {
      Toast({
        title: "Error Occurred",
        description: "Failed to load messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };  
  useEffect(()=>{
     fetchMessages();
  },[selectedChat])
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
  
        // Log the data being sent
        console.log("Sending message:", newMessage, "to chat:", selectedChat._id);
        
        const { data } = await axios.post('/api/message', {
          content: newMessage,
          chatId: selectedChat._id,
        }, config);
  
        console.log("Message sent successfully:", data);
        setNewMessage(""); // Clear the input after sending message
        setMessages([...messages, data]); // Update messages state with new message
  
      } catch (error) {
        // Log full error details, including response
        console.error("Error response from server:", error.response.data);
        Toast({
          title: "Error Occurred",
          description: "Failed to send the message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value)
  };
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false); // Simulate loading for testing spinner
  const [newMessage, setNewMessage] = useState();

  return (
    <>
      {selectedChat ? (
        <>
          <Flex
            direction="column"
            w="100%"
            h="100%"
            justifyContent="space-between"
          >
            <Flex
              fontSize={{ base: '28px', md: '30px' }}
              pb={3}
              px={2}
              w="100%"
              fontFamily="Work sans"
              justifyContent="space-between"
              alignItems="center"
              borderBottom="1px solid lightgray"
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
                  <Box ml="auto">
                    <ProfileModel user={getSenderFull(user, selectedChat.users)} />
                  </Box>
                </>
              ) : (
                <>
                  {/* Display the group chat name */}
                  <Text>{selectedChat.chatName.toUpperCase()}</Text>
                  <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  />
                </>
              )}
            </Flex>

            {/* Chat messages container */}
            <Box
              flex="1"
              bg="gray.100"
              p={3}
              overflowY="auto"
              display="flex"
              flexDirection="column"
              justifyContent="flex-end"
            >
              {/* Messages would go here */}
              {loading ? (
                <Spinner
                  size="xl"
                  w={20}
                  h={20}
                  alignSelf="center"
                  margin="auto"
                />
              ) : (
                <div className='messages'>
                 <ScrollableChat messages={messages}/>
                </div>
              )}
              <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message.."
                  onChange={typingHandler}
                  value={newMessage}
                />
              </FormControl>
            </Box>

            {/* Spinner at the bottom left */}
            {loading && (
              <Box position="absolute" bottom={3} left={3}>
                <Spinner size="md" />
              </Box>
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
