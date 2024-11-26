import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import SettingsModal from './SetttingsModal';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <div className="text-blue text-2xl font-bold"> </div>

                {/* Links for desktop */}
                <div className="hidden md:flex space-x-4">

                    <Link to="/home" className="text-white text-2xl font-bold">Home</Link>
                    <Link to="/findgame" className="text-white hover:text-blue-300">Find Game</Link>
                    <Link to="/creategame" className="text-white hover:text-white">Create Game</Link>
                    <Link to="/clubs" className="text-white hover:text-white-300">Clubs</Link>
                    <Link to="/profile" className="text-white hover:text-gray-300">Profile</Link>
                    <div className="text-white hover:text-gray-300"> <SettingsModal /> </div>
                    <Link to="messages" className='text-white'>messages</Link>
                </div>

                {/* Hamburger menu for mobile */}
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="text-white focus:outline-none">_
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>
            </div>


            <div className={`${isOpen ? 'block' : 'hidden'} md:hidden mt-4 space-y-2  text-right ml-auto`}>
                <Link to="/home" className="block text-white hover:text-white-300 flex-row-reverse">HOME</Link>
                <Link to="/findgame" className="block text-white hover:white-gray-300">Find Game</Link>
                <Link to="/creategame" className="block text-white hover:text-white-300">Create Game</Link>
                <Link to="/clubs" className="block text-white hover:text-white-300">Clubs</Link>
                <Link to="/profile" className="block text-white hover:text-white-300">Profile</Link>
                <div className="block text-white hover:text-white-300"> <SettingsModal /> </div>

                {/* <div className="block text-black hover:text-gray-300 flex justify-end">
                    <img
                        src={settingsimg}
                        alt="settingsimg"
                        className="w-8 h-8 object-contain"
                    />
                </div> */}
                {/* <div className="block text-black hover:text-gray-300 h-8 w-8 flex justify-end">
                    <img
                        src={settingsimg}
                        alt="settingsimg"
                        className="w-[setWidth] h-[setHeight] object-contain"
                    />
                </div> */}
                {/* <div className="block text-black hover:text-gray-300"> */}
                {/* <img src={settingsimg} alt="settingsimg" ></img> */}



            </div>
        </nav>
    );
};

export default Navbar;
