import React, { useState } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
  useToast,

} from '@chakra-ui/react';
import axios from 'axios';
import { Avatar, Box, Button, Menu, MenuButton, MenuItem, MenuList, Text, Tooltip } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModel from './ProfileModel';
import { useHistory } from 'react-router-dom'; 
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import {Spinner} from '@chakra-ui/spinner'

const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(); // If needed
  const { user,setSelectedChat,chats,setChats } = ChatState();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    history.push("/");
  };
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: 'Please enter a search query',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }
    try{
    setLoading(true);
    const config={
      headers:{
     Authorization:`Bearer ${user.token }`,

      },
    };
  const {data}=await axios.get(`/api/user?search=${search}`,config);
  setLoading(false)
  setSearchResult(data);
    }catch(error){
     toast({
     title:"Error occured",
     description:"failed to Load the Search Results",
     status:"error",
     duration:5000,
     isClosable:true,
     position:"bottom-left",
     });
    }
  };
  const accessChat = async(userId) => { 
    try{
   setLoadingChat(true);
   const config={
    headers:{
      "Content-type":"application/json",
      Authorization:`Bearer ${user.token}`,
    },
   };
   const {data}=await axios.post('/api/chat',{userId},config);
   if(!chats.find((c)=>c._id===data._id))setChats([data,...chats]);
   //returns the selcted chat created 
   setLoadingChat(false);
   setSelectedChat(data);
   onClose();
  }
    catch(error){
    toast({
   title:"Error fetching the chat ",
   description: error.message,
   status:"error",
   duration:5000,
   isClosable:true,
   position:"bottom-left",
    });
    setLoadingChat(false);
    }
  };
  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }}  px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work sans">
          Ali Chat
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList>
              {/* Menu items for notifications */}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size="sm" cursor="pointer" name={user?.name} src={user?.pic} />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
    
      <Drawer placement="left" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
  <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
  <DrawerBody>
    <Box display="flex" pb={2} alignItems="center">
      <Input
        placeholder="Search by name or email"
        mr={2} // margin-right to create space between input and button
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button onClick={handleSearch}>
        Go
      </Button>
    </Box>
    {loading?<ChatLoading/>:(
      searchResult?.map(user=>(
      <UserListItem
      key={user._id}
      user={user}
      handleFunction={()=>accessChat(user._id)}
      />
      ))
    )}
   {loadingChat &&<Spinner ml="auto" d="flex"/>}
  </DrawerBody>
</DrawerContent>
      </Drawer>
    </div>
  );
};
export default SideDrawer;
