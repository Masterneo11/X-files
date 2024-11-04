// import React, { useState } from 'react';

// const Navbar: React.FC = () => {
//     const [isOpen, setIsOpen] = useState(false);

//     const toggleMenu = () => {
//         setIsOpen(!isOpen);
//     };

//     return (
//         <nav className="bg-gray-800 p-4">
//             <div className="container mx-auto flex justify-between items-center">
//                 {/* Logo */}
//                 <div className="text-blue text-2xl font-bold">.</div>

//                 {/* Links for desktop */}
//                 <div className="hidden md:flex space-x-4">
//                     <a href="#" className="text-blue text-2xl font-bold">Home</a>
//                     <a href="#" className="text-black hover:text-gray-300">Find Game</a>
//                     <a href="#" className="text-black hover:text-gray-300">Create Game</a>
//                     <a href="#" className="text-black hover:text-gray-300">Clubs </a>
//                     <a href="#" className="text-black hover:text-gray-300">Profile</a>

//                 </div>

//                 {/* Hamburger menu for mobile */}
//                 <div className="md:hidden">
//                     <button onClick={toggleMenu} className="text-white focus:outline-none">
//                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
//                         </svg>
//                     </button>
//                 </div>
//             </div>

//             {/* Mobile Menu */}
//             <div className={`${isOpen ? 'block' : 'hidden'} md:hidden mt-4 space-y-2`}>
//                 <a href="#" className="block text-black hover:text-gray-300"> HOME</a>
//                 <a href="#" className="block text-black hover:text-gray-300">Find Game</a>
//                 <a href="#" className="block text-black hover:text-gray-300">Create Game</a>
//                 <a href="#" className="block text-black hover:text-gray-300">Clubs</a>
//                 <a href="#" className="block text-black hover:text-gray-300">Profile</a>

//             </div>
//         </nav>
//     );
// };

// export default Navbar;

import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

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
                    <Link to="/" className="text-blue text-2xl font-bold"> back to login page....</Link>

                    <Link to="/home" className="text-blue text-2xl font-bold">Home</Link>
                    <Link to="/findgame" className="text-black hover:text-gray-300">Find Game</Link>
                    <Link to="/creategame" className="text-black hover:text-gray-300">Create Game</Link>
                    <Link to="/clubs" className="text-black hover:text-gray-300">Clubs</Link>
                    <Link to="/profile" className="text-black hover:text-gray-300">Profile</Link>
                </div>

                {/* Hamburger menu for mobile */}
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="text-black focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`${isOpen ? 'block' : 'hidden'} md:hidden mt-4 space-y-2  text-right ml-auto`}>
                <Link to="/home" className="block text-black hover:text-gray-300 flex-row-reverse">HOME</Link>
                <Link to="/findgame" className="block text-black hover:text-gray-300">Find Game</Link>
                <Link to="/creategame" className="block text-black hover:text-gray-300">Create Game</Link>
                <Link to="/clubs" className="block text-black hover:text-gray-300">Clubs</Link>
                <Link to="/profile" className="block text-black hover:text-gray-300">Profile</Link>
            </div>
        </nav>
    );
};

export default Navbar;
