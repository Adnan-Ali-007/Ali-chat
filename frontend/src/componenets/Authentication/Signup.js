import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import axios from "axios";
import { useHistory } from "react-router-dom"; // Ensure correct import

const Signup = () => {
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [confirmpassword, setConfirmpassword] = useState('');
   const [password, setPassword] = useState('');
   const [pic, setPic] = useState('');
   const [show, setShow] = useState(false);
   const [loading, setLoading] = useState(false); // Use this state to manage loading
   const toast = useToast();
   const history = useHistory(); // Initialize history

   const handleClick = () => setShow(!show); // to show/hide password

   const postDetails = (pics) => {
      if (pics === undefined) {
         toast({
            title: "Please Select an Image!",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
         });
         return;
      }

      if (pics.type === "image/jpeg" || pics.type === "image/png") {
         const data = new FormData();
         data.append("file", pics);
         data.append("upload_preset", "ali-chat");
         data.append("cloud_name", "piyushproje");

         fetch("https://api.cloudinary.com/v1_1/piyushproje/image/upload", {
            method: "post",
            body: data,
         })
         .then((res) => res.json())
         .then((data) => {
            setPic(data.url.toString());
            console.log(data.url.toString());
         })
         .catch((err) => {
            console.log(err);
         });
      } else {
         toast({
            title: "Please Select an Image!",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
         });
         return;
      }
   };

   const submitHandler = async () => {
      setLoading(true); // Set loading to true when starting submission
      if (!name || !email || !password || !confirmpassword) { //checking feilds filled by user or nt
         toast({
            title: "Please Fill all the Fields",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
         });
         setLoading(false); // Reset loading state
         return;
      }
      if (password !== confirmpassword) {
         toast({
            title: "Passwords Do Not Match",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
         });
         setLoading(false); // Reset loading state
         return;
      }
      console.log(name, email, password, pic);
      try {
         const config = {
            headers: {
               "Content-type": "application/json",
            },
         };
         const { data } = await axios.post(
            "/api/user",
            { name, email, password, pic },
            config
         );
         console.log(data);
         toast({
            title: "Registration Successful",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
         });
         localStorage.setItem("userInfo", JSON.stringify(data));
         setLoading(false); // Reset loading state
         history.push('/chats') // Navigate to chats page
      } catch (error) {
         toast({
            title: "Error Occurred!",
            description: error.response?.data?.message || "Something went wrong!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
         });
         setLoading(false); // Reset loading state
      }
   };

   return (
      <VStack spacing="5px">
         <FormControl id='first-name' isRequired>
            <FormLabel>Name</FormLabel>
            <Input placeholder='Enter Your Name' onChange={(e) => setName(e.target.value)} />
         </FormControl>
         <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
            <Input placeholder='Enter Your Email' onChange={(e) => setEmail(e.target.value)} />
         </FormControl>
         <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup size="md">
               <Input
                  type={show ? "text" : "password"}
                  placeholder="Enter Password"
                  onChange={(e) => setPassword(e.target.value)}
               />
               <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                     {show ? "Hide" : "Show"}
                  </Button>
               </InputRightElement>
            </InputGroup>
         </FormControl>
         <FormControl id="confirm-password" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup size="md">
               <Input
                  type={show ? "text" : "password"}
                  placeholder="Confirm Password"
                  onChange={(e) => setConfirmpassword(e.target.value)}
               />
               <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                     {show ? "Hide" : "Show"}
                  </Button>
               </InputRightElement>
            </InputGroup>
         </FormControl>
         <FormControl id="pic">
            <FormLabel>Upload your Picture</FormLabel>
            <Input
               type="file"
               p={1.5}
               accept="image/*"
               onChange={(e) => postDetails(e.target.files[0])}
            />
         </FormControl>
         <Button
            colorScheme="blue"
            width="100%"
            style={{ marginTop: 15 }}
            onClick={submitHandler}
            isLoading={loading}
         >
            Sign Up
         </Button>
      </VStack>
   );
};

export default Signup;
