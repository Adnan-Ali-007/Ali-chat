import { Box } from "@chakra-ui/layout";
import Chatbox from "../componenets/ChatBox";
import MyChats from "../componenets/MyChats";
import SideDrawer from "../componenets/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Chatpage = () => {
  const { user, setUser } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  const history = useHistory();

  useEffect(() => {
    if (!user) {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (userInfo) {
        setUser(userInfo);
      } else {
        history.push("/");
      }
    }
  }, [user, setUser, history]);

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
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};
export default Chatpage;