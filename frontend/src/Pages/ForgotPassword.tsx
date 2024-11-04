
import NameField from "../Components/NameField";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import padlock from "../assets/padlock.png"

const CreateAccount: React.FC = () => {

    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConformPassword] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [userName, setUserName] = useState<string>("");



    return (<>
        <div className='container h-36 w-36 mt-20'>
            < img src={padlock} alt='dixiebanner' id='cat'></img >
        </div >
        <div className=" container flex flex-col items-center h-144 w-80">
            <div className=" font-bold"> Trouble logging in?</div>
            <div className=" text-sm  text-gray mb-9"> Enter your Email and we'll send you a link to get back into your account</div>
            <input
                placeholder="Email"
                value={email}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm '
                onChange={(e) => setEmail(e.target.value)}></input>
            <Link to="/login" className=" btn btn-primary w-full mt-3 text-sm "> Send Url Link</Link>


        </div>

    </>)
}

export default CreateAccount;