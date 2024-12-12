// import React, { useState } from 'react';
// import { Link } from 'react-router-dom'; // Import Link from react-router-dom
// import SettingsModal from './SetttingsModal';

// const Navbar: React.FC = () => {
//     const [isOpen, setIsOpen] = useState(false);

//     const toggleMenu = () => {
//         setIsOpen(!isOpen);
//     };

//     return (
//         <nav className="bg-green-700 p-4">
//             <div className="container mx-auto flex justify-between items-center">
//                 {/* Logo */}
//                 <div className="text-blue text-2xl font-bold"> </div>

//                 {/* Links for desktop */}
//                 <div className="hidden md:flex space-x-4">

//                     <Link to="/home" className="text-white text-2xl font-bold">Home</Link>
//                     <Link to="/findgame" className="text-white hover:text-blue-300">Find Game</Link>
//                     <Link to="/creategame" className="text-white hover:text-white">Create Game</Link>
//                     <Link to="/clubs" className="text-white hover:text-white-300">Clubs</Link>
//                     <Link to="/profile" className="text-white hover:text-gray-300">Profile</Link>
//                     <div className="text-white hover:text-gray-300"> <SettingsModal /> </div>
//                 </div>

//                 {/* Hamburger menu for mobile */}
//                 <div className="md:hidden">
//                     <button onClick={toggleMenu} className="text-white focus:outline-none">_
//                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
//                         </svg>
//                     </button>
//                 </div>
//             </div>


//             <div className={`${isOpen ? 'block' : 'hidden'} md:hidden mt-4 space-y-2  text-right ml-auto`}>
//                 <Link to="/home" className="block text-white hover:text-white-300 flex-row-reverse">HOME</Link>
//                 <Link to="/findgame" className="block text-white hover:white-gray-300">Find Game</Link>
//                 <Link to="/creategame" className="block text-white hover:text-white-300">Create Game</Link>
//                 <Link to="/clubs" className="block text-white hover:text-white-300">Clubs</Link>
//                 <Link to="/profile" className="block text-white hover:text-white-300">Profile</Link>
//                 <div className="block text-white hover:text-white-300"> <SettingsModal /> </div>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;

// import React, { useState } from "react";
// import { Link } from "react-router-dom"; // Import Link from react-router-dom
// import SettingsModal from "./SetttingsModal";

// const Navbar: React.FC = () => {
//     const [isOpen, setIsOpen] = useState(false);

//     const toggleMenu = () => {
//         setIsOpen(!isOpen);
//     };

//     return (
//         <nav className="bg-green-700 p-2 shadow-md fixed top-0 left-0 w-full z-50">
//             <div className="container mx-auto flex justify-between items-center">
//                 {/* Left: Logo */}
//                 <div className="text-white text-2xl font-bold">
//                     <Link to="/" className="flex items-center space-x-2">
//                         {/* <img src="/logo.png" alt="Logo" className="w-8 h-8" /> */}
//                         <span>OmadaGroupEvents</span>
//                     </Link>
//                 </div>

//                 {/* Center: Main Links */}
//                 <div className="hidden md:flex space-x-6">
//                     <Link to="/home" className="flex flex-col items-center text-white hover:text-green-400">
//                         <svg className="w-6 h-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//                             <path d="M12 3l10 9h-5v9h-10v-9h-5z" />
//                         </svg>
//                         <span className="text-sm">Home</span>
//                     </Link>
//                     <Link to="/findgame" className="flex flex-col items-center text-white hover:text-green-400">
//                         <svg className="w-6 h-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//                             <path d="M10 20v-6h4v6h5v-8h3l-12-12-12 12h3v8z" />
//                         </svg>
//                         <span className="text-sm">Find Game</span>
//                     </Link>
//                     <Link to="/creategame" className="flex flex-col items-center text-white hover:text-green-400">
//                         <svg className="w-6 h-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//                             <path d="M5 20h14v-2h-14v2zm0-4h14v-2h-14v2zm0-4h14v-2h-14v2zm0-4h14v-2h-14v2z" />
//                         </svg>
//                         <span className="text-sm">Create Game</span>
//                     </Link>
//                     <Link to="/clubs" className="flex flex-col items-center text-white hover:text-green-400">
//                         <svg className="w-6 h-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//                             <path d="M3 13h18v-2h-18v2zm3-4h12v-2h-12v2zm3-4h6v-2h-6v2z" />
//                         </svg>
//                         <span className="text-sm">Clubs</span>
//                     </Link>
//                 </div>

//                 {/* Right: Profile and Settings */}
//                 <div className="hidden md:flex items-center space-x-4">
//                     <Link to="/profile" className="flex flex-col items-center text-white hover:text-green-400">
//                         <svg className="w-6 h-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//                             <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
//                         </svg>
//                         <span className="text-sm">Profile</span>
//                     </Link>
//                     <SettingsModal />
//                 </div>

//                 {/* Hamburger Menu for Mobile */}
//                 <div className="md:hidden">
//                     <button onClick={toggleMenu} className="text-white focus:outline-none">
//                         <svg
//                             className="w-6 h-6"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                             xmlns="http://www.w3.org/2000/svg"
//                         >
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
//                         </svg>
//                     </button>
//                 </div>
//             </div>

//             {/* Mobile Menu */}
//             <div className={`${isOpen ? "block" : "hidden"} md:hidden mt-4 space-y-2`}>
//                 <Link to="/home" className="block text-white hover:text-green-400">
//                     Home
//                 </Link>
//                 <Link to="/findgame" className="block text-white hover:text-green-400">
//                     Find Game
//                 </Link>
//                 <Link to="/creategame" className="block text-white hover:text-green-400">
//                     Create Game
//                 </Link>
//                 <Link to="/clubs" className="block text-white hover:text-green-400">
//                     Clubs
//                 </Link>
//                 <Link to="/profile" className="block text-white hover:text-green-400">
//                     Profile
//                 </Link>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;
import React from "react";
import { Link } from "react-router-dom";
import SettingsModal from "./SetttingsModal";

const Navbar: React.FC = () => {
    return (
        <>
            <nav className="bg-green-700 p-2 shadow-md fixed top-0 left-0 w-full z-50">
                <div className="container mx-auto flex justify-between items-center">
                    {/* Desktop and Mobile Links */}
                    <div className="flex w-full justify-around">
                        <Link to="/home" className="flex flex-col items-center text-white hover:text-green-400">
                            <svg
                                className="w-6 h-6"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 3l10 9h-5v9h-10v-9h-5z" />
                            </svg>
                            <span className="text-sm">Home</span>
                        </Link>
                        <Link to="/findgame" className="flex flex-col items-center text-white hover:text-green-400">
                            <svg
                                className="w-6 h-6"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <path d="M10 20v-6h4v6h5v-8h3l-12-12-12 12h3v8z" />
                            </svg>
                            <span className="text-sm">Find Game</span>
                        </Link>
                        <Link to="/creategame" className="flex flex-col items-center text-white hover:text-green-400">
                            <svg
                                className="w-6 h-6"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <path d="M5 20h14v-2h-14v2zm0-4h14v-2h-14v2zm0-4h14v-2h-14v2zm0-4h14v-2h-14v2z" />
                            </svg>
                            <span className="text-sm">Create Game</span>
                        </Link>
                        <Link to="/clubs" className="flex flex-col items-center text-white hover:text-green-400">
                            <svg
                                className="w-6 h-6"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <path d="M3 13h18v-2h-18v2zm3-4h12v-2h-12v2zm3-4h6v-2h-6v2z" />
                            </svg>
                            <span className="text-sm">Clubs</span>
                        </Link>
                        <Link to="/profile" className="flex flex-col items-center text-white hover:text-green-400">
                            <svg
                                className="w-6 h-6"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                            <span className="text-sm">Profile</span>
                        </Link>
                        <SettingsModal />
                    </div>
                </div>
            </nav>

            {/* Padding to prevent page content from being hidden behind navbar */}
            <div className="pt-12"></div>
        </>
    );
};

export default Navbar;
