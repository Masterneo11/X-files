

import NameField from "../Components/NameField";
import DiceIcon from "../assets/dice-d20.svg"
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import PodiumIcon from "../assets/podium-victory-leader.svg"
// interface Event {
//     event_title: string;
//     location: string;
//     start_time: string;  // Assuming this is a string in the response, adjust if necessary
//     end_time: string;
//     description?: string;
//     max_players: number;
//     user_id: number;
// }   1st edition 

// interface Event {
//     event_title: string;
//     location: string;
//     start_time: string;
//     end_time: string;
//     description?: string;
//     max_players: number;
//     user_id: number;
//     name: string;  // Add this line
// } current edition 

interface Event {
    event_title: string;
    location: string;
    start_time: string;
    end_time: string;
    description?: string;
    max_players: number;
    user_id: number;
    event_owner: string;  // gpt edition 
}



const Home: React.FC = () => {
    const [name, setName] = useState<string>("");
    const [date, setDate] = useState<Date>();
    const [startTime, setStartTime] = useState<string>("");
    const [user, setUser] = useState<string>("");
    const [events, setEvents] = useState<Event[]>([]);

    const fetchEvents = async () => {
        try {
            const response = await fetch("http://localhost:8000/events/Event", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            if (response.ok) {
                const data = await response.json();
                setEvents(data);
            } else {
                console.error("Failed to fetch event data.");
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    // Fetch events on component mount
    useEffect(() => {
        fetchEvents();
    }, []);

    return (<>
        <div className="container sm:80 w-sm mt-2 flex flex-col items-center w-full vw-90">
            <h1 className=" flex mr-60">Home</h1>
            {events.map((event, index) => (
                <div key={index} className="p-4 border-gray-200 ">
                    <div className=" flex ">
                        <img className="h-5 w-5 z-10 " src={DiceIcon} alt="dice"></img>
                        <div className=" text-green  ml-5">{event.event_title}</div>
                    </div>
                    <p>{event.start_time}</p>
                    <div className=" flex justify-between">
                        <div className="flex">
                            <img className="flex h-5 w-5" src={PodiumIcon} alt="podium"></img>
                            <p>{event.event_owner}</p>
                        </div>
                        <Link to="/fullgameinfo" className="btn btn-success h-5 w-10 flex justify-center items-center">info</Link>

                        {/* <Link to="/info" className=" btn btn-success h-5 w-10 justify-center items-middle">info</Link> */}


                    </div>
                </div>
            ))}
        </div>



        {/* <div className="container mx-auto mt-2 flex flex-col items-center w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg">
            <h1 className="text-center text-2xl sm:text-center font-semibold mb-4">Home</h1>
            {events.map((event, index) => (
                <div key={index} className="w-full sm:w-1 md:w-10/12 lg:w-9/12 p-4 border-b border-gray-200">
                    <h3 className="text-lg sm:text-sm font-semibold">{event.event_title}</h3>
                    <p className="text-sm sm:text-base mt-1">Start Time: {event.start_time}</p>
                    <p className="text-sm sm:text-base mt-1">User: {event.event_owner}</p>
                </div>
            ))}
        </div> */}


    </>
    );
};

export default Home;
















{/* <div className="container mt-10 px-4 sm:px-8 flex flex-col items-center h-auto w-full sm:w-3/4 lg:w-1/2">
            <div className="text-center text-lg sm:text-xl">hello there</div>
            <h1 className="text-2xl sm:text-3xl font-semibold">Home</h1>
            <h2 className="text-lg sm:text-xl font-medium mt-2">Your Games</h2>
            {events.map((event, index) => (
                <div key={index}
                    className="w-full sm:w-3/4 lg:w-1/2 bg-white shadow-md rounded-lg p-4 my-2 border border-gray-200">
                    <h3 className="text-lg sm:text-xl font-semibold">{event.event_title}</h3>
                    <p className="text-sm sm:text-base mt-1">Start Time: {event.start_time}</p>
                    <p className="text-sm sm:text-base mt-1">User: {event.event_owner}</p> </div> ))}
        </div> */}
{/* {events.map((event, index) => (
                <div key={index} className="p-4 border-b border-gray-200">
                    <h3>{event.event_title}</h3> 
                    <p>Start Time: {event.start_time}</p>
                    <p>User ID: {event.user_id}</p>
                </div>
            ))} */}