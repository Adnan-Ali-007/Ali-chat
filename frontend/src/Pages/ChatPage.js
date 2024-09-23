import { Box } from "@chakra-ui/layout";
import Chatbox from "../componenets/ChatBox";
import MyChats from "../componenets/MyChats";
import SideDrawer from "../componenets/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";
import { useState } from "react";
const Chatpage = () => {
  const { user } = ChatState();
  const [fetchAgain,setFetchAgain]=useState(false)

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        flexDirection="row" // Set the layout direction to horizontal
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain}/>}
        {user && (<Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>)}
      </Box>
    </div>
  );
};
export default Chatpage;
