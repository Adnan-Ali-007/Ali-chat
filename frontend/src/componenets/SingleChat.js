import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box, Text, IconButton, Flex, Spinner, FormControl, Input, Tooltip, Avatar, useToast } from '@chakra-ui/react'; // Single import for Chakra components
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../Config/ChatLogics';
import ProfileModel from './miscellaneous/ProfileModel';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';
import './styles.css';
import Lottie from 'react-lottie'
import animationData from '../animations/typing.json'
const ENDPOINT = 'http://localhost:5000';
let socket, selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing,setTyping]=useState(false)
  const [isTyping,setIsTyping]=useState(false)
  const [notification, setNotification] = useState([]);
  const toast = useToast(); // Correct usage of toast
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) return; // Prevent running if no chat is selected

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);

      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      toast({
        title: 'Error Occurred',
        description: 'Failed to load messages.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
    }
  };
   
  useEffect(() => {
      
      socket = io(ENDPOINT);
      socket.emit("setup", user);
      socket.on("connected", () => setSocketConnected(true));
      socket.on("typing",()=>setIsTyping(true))
      socket.on("stop typing",()=>setIsTyping(false))
  }, [user]);
  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
      selectedChatCompare = selectedChat;

    }
  }, [selectedChat]);
  //  console.log(notification,"----------");
  useEffect(() => {
    socket.on('message received', (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        // for notifications
        if(!notification.includes(newMessageReceived)){
          setNotification([newMessageReceived,...notification])
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    });

    return () => {
      // Clean up listeners when component unmounts
      socket.off('message received');
    };
  }, [selectedChatCompare]);

  const sendMessage = async (event) => {
    if (event.key === 'Enter' && newMessage) {
      socket.emit('stop typing',selectedChat._id)
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post('/api/message', {
          content: newMessage,
          chatId: selectedChat._id,
        }, config);

        socket.emit('new message', data);
        setMessages([...messages, data]);
        setNewMessage(''); // Clear input after sending
      } catch (error) {
        toast({
          title: 'Error Occurred',
          description: 'Failed to send the message.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if(!socketConnected) return;
    if(!typing){
      setTyping(true)
      socket.emit("typing",selectedChat._id)
    }
    let LastTypingTime=new Date().getTime()
    var timerLength=3000;
      setTimeout(()=>{
       var timeNow=new Date().getTime()
       var timeDiff=timeNow-LastTypingTime;
       if(timeDiff>=timerLength && typing){
         socket.emit("stop typing",selectedChat._id)
         setTyping(false)
       }
      },timerLength)
  };
  return (
    <>
      {selectedChat ? (
        <Flex direction="column" w="100%" h="100%" justifyContent="space-between">
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
                <Text>{getSender(user, selectedChat.users)}</Text>
                <Box ml="auto">
                  <ProfileModel user={getSenderFull(user, selectedChat.users)} />
                </Box>
              </>
            ) : (
              <>
                <Text>{selectedChat.chatName.toUpperCase()}</Text>
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Flex>
          <Box
            flex="1"
            bg="gray.100"
            p={3}
            overflowY="auto"
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
          >
            {loading ? (
              <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
            ) : (
              <ScrollableChat messages={messages} />
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
            {isTyping ? (
                <div>
                <Lottie options={defaultOptions} width={70} style={{marginBottom:15,marginLeft:0}} />

                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </Flex>
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
