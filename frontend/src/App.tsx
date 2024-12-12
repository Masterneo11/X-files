import { useAuth0 } from "@auth0/auth0-react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./Components/Navbar";
import Login from "./Pages/Login";
import CreateAccount from "./Pages/CreateAccount";
import ForgotPassword from "./Pages/ForgotPassword";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import FindGames from "./Pages/FindGames";
import CreateGame from "./Pages/CreateGame";
import Clubs from "./Pages/Clubs";
import FullGameInfo from "./Pages/FullGameInfo";
import FindFriends from "./Pages/FindFriends";
import MakeAccount from "./Pages/MakeAccount";
import FriendsProfile from "./Pages/FriendsProfile";
import Messages from "./Pages/Messages";
import ClubsCreate from "./Pages/ClubsCreate";
import PreJoinGame from "./Pages/PreJoinGame";
import EventDetails from "./Pages/EventDetails"


function ConditionalNavbar() {
  const location = useLocation();

  // List of routes where the Navbar will not appear
  const noNavbarRoutes = [
    "/login",
    "/login/create",
    "/forgot_password",
    "/login/forgot_password",
    "/create",
  ];

  // Conditionally render Navbar only if the current route is not in the noNavbarRoutes list
  return !noNavbarRoutes.includes(location.pathname) ? <Navbar /> : null;
}

function App() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  // Show a loading screen while Auth0 is initializing
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      {/* Conditionally render the Navbar */}
      <ConditionalNavbar />

      <Routes>
        {/* Redirect from root to home or login */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />}
        />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/login/create" element={<CreateAccount />} />
        <Route path="/create" element={<CreateAccount />} />
        <Route path="/login/forgot_password" element={<ForgotPassword />} />
        <Route path="forgot_password" element={<ForgotPassword />} />

        {/* Private routes */}
        <Route
          path="/home"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/login/home"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/login/home/fullgameinfo"
          element={isAuthenticated ? <FullGameInfo /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/findgame"
          element={isAuthenticated ? <FindGames /> : <Navigate to="/login" />}
        />
        <Route
          path="/creategame"
          element={isAuthenticated ? <CreateGame /> : <Navigate to="/login" />}
        />
        <Route
          path="/clubs"
          element={isAuthenticated ? <Clubs /> : <Navigate to="/login" />}
        />
        {/* <Route path="/fullgameinfo/:event_id" element={<FullGameInfo />} /> */}
        <Route
          path="findfriends"
          element={isAuthenticated ? <FindFriends /> : <Navigate to="/profile" />} />

        <Route
          path="makeaccount"
          element={isAuthenticated ? <MakeAccount /> : <Navigate to="login" />} />

        <Route path="/user/:id" element={<FriendsProfile />} />
        <Route
          path="fullgameinfo"
          element={isAuthenticated ? <Messages /> : <Navigate to="login" />} />

        <Route path="/fullgameinfo/:eventId"
          element={isAuthenticated ? <FullGameInfo /> : <Navigate to="login" />} />

        <Route
          path="clubscreate"
          element={isAuthenticated ? <ClubsCreate /> : <Navigate to="login" />} />
        <Route
          path="messages"
          element={isAuthenticated ? <Messages /> : <Navigate to="login" />} />

        <Route path="/messages/:loggedInUserId/:attendeeId"
          element={isAuthenticated ? <Messages /> : <Navigate to="login" />} />

        <Route
          path="/findgames/:eventId/prejoingame"
          element={isAuthenticated ? <PreJoinGame /> : <Navigate to="/login" />} />
        <Route path="/prejoingame/:id" element={<PreJoinGame />} />
        <Route path="/event/:id"
          element={isAuthenticated ? <EventDetails /> : <Navigate to="/login" />} />

        <Route path="/users/:id"
          element={isAuthenticated ? <FriendsProfile /> : <Navigate to="/login" />} />



      </Routes>
    </Router>
  );
}

export default App;
