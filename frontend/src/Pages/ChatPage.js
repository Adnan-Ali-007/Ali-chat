import { Box } from "@chakra-ui/layout";
import Chatbox from "../componenets/ChatBox";
import MyChats from "../componenets/MyChats";
import SideDrawer from "../componenets/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";
const Chatpage = () => {
  const { user } = ChatState();
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
        {user && <MyChats />}
        {user && <Chatbox />}
      </Box>
    </div>
  );
};
export default Chatpage;
