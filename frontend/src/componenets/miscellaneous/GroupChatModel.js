import { 
  Button, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalCloseButton, 
  ModalBody, 
  ModalFooter, 
  useDisclosure, 
  useToast,
  FormControl,
  Input,
  Box
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);  // State to store search results
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config); // added await
      console.log(data);
      setLoading(false);
      setSearchResult(data); // Store results
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false); // Ensure loading state is reset on error
    }
  };

  const handleSubmit = () => {
    // Logic to handle group chat creation
    console.log("Creating group chat:", groupChatName, selectedUsers);
  };
 const handleGroup=(userToAdd)=>{
 if(selectedUsers.includes(userToAdd))
 {
  toast({
    title: "User already added",
    status: "warning",
    duration: 5000,
    isClosable: true,
    position: "top",
  });
  return;
 }
 setSelectedUsers([...selectedUsers,userToAdd])
 };
 const handleDelete = (delUser) => {
  setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
};
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg:John, Piyush, Jane"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" d="flex" flexWrap="wrap">
            {selectedUsers.map((u)=>(
              <UserBadgeItem key={user._id}
              user={u}
              handleFunction={()=>handleDelete(u)}
              />
            ))}
            </Box>
            {loading?<div>loading</div>:(
              searchResult?.slice(0,4).map((user)=>(
                <UserListItem key={user._id}
                user={user}
                handleFunction={()=>handleGroup(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default GroupChatModal;
