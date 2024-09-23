// import { Button } from '@chakra-ui/react';
import './App.css';
import { Route } from 'react-router-dom';
import Homepage from './Pages/Homepage';
import Chatpage from './Pages/ChatPage';
function App() {
  return (
    <div className="App">
    <Route path="/"component={Homepage} exact/>
    <Route path="/chats"component={Chatpage}/>
    </div>
  );
}
export default App;
