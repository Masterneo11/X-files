import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Login from './Pages/Login';
import CreateAccount from './Pages/CreateAccount';
import FindGames from './Pages/FindGames';
import Clubs from './Pages/Clubs';
import Home from './Pages/Home';
import CreateGame from './Pages/CreateGame';
import Profile from './Pages/Profile';
import ForgotPassword from './Pages/ForgotPassword'
import FullGameInfo from './Pages/FullGameInfo';

// handle conditional Navbar rendering
function ConditionalNavbar() {
  const location = useLocation();

  // List of routes where the Navbar will not appear
  const noNavbarRoutes = ["/login", "/login/create", "/forgot_password", "/login/forgot_password", "/create", "/login/create"];

  // Conditionally render Navbar only if the current route is not in the noNavbarRoutes list
  return !noNavbarRoutes.includes(location.pathname) ? <Navbar /> : null;
}

function App() {
  return (
    <Router>
      {/* Conditionally render the Navbar */}
      <ConditionalNavbar />

      <Routes>
        {/* Redirect from root to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* other routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/login/create" element={<CreateAccount />} />
        <Route path="/create" element={<CreateAccount />} />
        <Route path="/login/forgot_password" element={<ForgotPassword />} />
        <Route path="forgot_password" element={<ForgotPassword />} />

        {/* Ensure correct route is used for FindGames */}
        <Route path="/login/home" element={<Home />} />

        <Route path="/login/home" element={<Home />} />
        <Route path="/login/home/fullgameinfo" element={<FullGameInfo />} />
        <Route path='profile' element={<Profile />} />
        <Route path="/findgame" element={<FindGames />} />
        <Route path="/creategame" element={<CreateGame />} />
        <Route path="/clubs" element={<Clubs />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/fullgameinfo" element={<FullGameInfo />} />
        <Route path="/fullgameinfo" element={<FullGameInfo />} /> {/* Add this line for the /info route */}


        {/* <Route path="/login/home" element={<Home />} />
        <Route path='profile' element={<Profile />} />
        <Route path="/findgame" element={<FindGames />} />
        <Route path="/creategame" element={<CreateGame />} />
        <Route path="/clubs" element={<Clubs />} />
        <Route path="/home" element={<Home />} />
         */}


      </Routes>
    </Router>
  );
}

export default App;
