import React, { useEffect } from 'react'
import {Box, Container,Tab,Tabs,TabList,TabPanels,TabPanel,Text} from "@chakra-ui/react"
import Login from "../componenets/Authentication/Login"
import Signup from "../componenets/Authentication/Signup"
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
const Homepage = () => {
  const history=useHistory();
  useEffect(()=>{
  const user= JSON.parse(localStorage.getItem("userInfo"));
  if(user){
   history.push("/chats")
  }
   },[history]);
  return (
  //for screen size fitting
  <Container maxW='lg' centerContent> 
    <Box d="flex"  justifyContent="center"  p={3}bg="white" w="100%" m="40px 0 15px 0"borderRadius="lg"borderWidth="1px" textAlign="center"> 
   <Text fontSize="4xl" fontFamily="Work sans" color="black">
    Ali Chat
   </Text>
    </Box>
    <Box bg="white" w="100%"p={4}borderRadius="lg"borderWidth="1px"color="black">
    <Tabs variant='soft-rounded'>
  <TabList mb="1em">
    <Tab width="50%">Login</Tab>
    <Tab width="50%">Sign Up</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
    <Login/>
    </TabPanel>
    <TabPanel>
    <Signup/>
    </TabPanel>
  </TabPanels>
</Tabs>
    </Box>
  </Container>
  )
}

export default Homepage