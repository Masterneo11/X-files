
import NameField from "../Components/NameField";
import React, { useState, useEffect } from "react";

const FindGames: React.FC = () => {

    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConformPassword] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [userName, setUserName] = useState<string>("");



    return (<>

        <div> hello there </div>
        <h1> Find Games</h1>


    </>)
}

export default FindGames;