
import NameField from "../Components/NameField";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


const CreateAccount: React.FC = () => {

    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConformPassword] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [userName, setUserName] = useState<string>("");



    return (<>
        <div className=" container mt-28 flex flex-col items-center h-144 w-100">
            {/* <NameField
                Name="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name" /> */}
            <input
                placeholder="Email"
                value={email}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm '
                onChange={(e) => setEmail(e.target.value)}></input>
            <input
                placeholder="Name"
                value={name}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm '
                onChange={(e) => setName(e.target.value)}></input>
            <input
                placeholder="Username"
                value={userName}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm '
                onChange={(e) => setUserName(e.target.value)}></input>
            <input
                placeholder="Password"
                value={password}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm '
                onChange={(e) => setPassword(e.target.value)}></input>
            <input
                placeholder="Confirm password"
                value={confirmPassword}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm '
                onChange={(e) => setConformPassword(e.target.value)}></input>
            <input
                placeholder=" Optional Phone Number"
                value={phoneNumber}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm '
                onChange={(e) => setPhoneNumber(e.target.value)}></input>

            <Link to="/login" className=" btn btn-primary w-full mt- text-sm "> Complete Account </Link>



        </div>

    </>)
}

export default CreateAccount;