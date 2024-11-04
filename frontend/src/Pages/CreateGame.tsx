
import NameField from "../Components/NameField";
import React, { useState, useEffect } from "react";



const CreateGame: React.FC = () => {


    const [eventTitle, setEventTitle] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [Date, setDate] = useState<string>("");
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    return (<>


        <div className="container mt-2 flex flex-col items-center h-144 w-full px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
                <div className="col-span-2">
                    <label className="-mb-2">Event Title</label>
                    <input
                        placeholder="example: Tourney Thursdays"
                        value={eventTitle}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        onChange={(e) => setEventTitle(e.target.value)}
                    />
                </div>
                {/* <div className="col-span-2 flex col">
                    <label className="w-28 -mb-2 flex">Event Title</label>
                    <input
                        placeholder="example: Tourney Thursdays"
                        value={eventTitle}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm "
                        onChange={(e) => setEventTitle(e.target.value)}
                    />
                </div> */}
                <div className="col-span-2">
                    <label className="-mb-2">Location</label>
                    <input
                        placeholder="Location"
                        value={location}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>
                <div className="col-span-2 sm:col-span-1">
                    <label className="-mb-2">Date</label>
                    <input
                        placeholder="Date"
                        value={Date}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 col-span-2 justify-between">
                    <div className="flex flex-col gap-2 w-1/2">
                        <label className="-mb-2">Start Time</label>
                        <input
                            placeholder="Start time"
                            value={startTime}
                            className="block w-3/4 px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-xs"
                            onChange={(e) => setStartTime(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2 w-1/2">
                        <label className="-mb-2 ml-2 text-gray">End Time</label>
                        <input
                            placeholder="End time"
                            value={endTime}
                            className="block w-3/4 px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-xs"
                            onChange={(e) => setEndTime(e.target.value)}
                        />
                    </div>
                </div>

                <div >
                    <label className="-mb-2">Description</label>
                    <input
                        placeholder="for fun"
                        value={description}
                        className="block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
            </div>

            {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
                <div className="col-span-2 flex">
                    <label className="w-28">Event Title</label>
                    <input
                        placeholder="example: Tourney Thursdays"
                        value={eventTitle}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        onChange={(e) => setEventTitle(e.target.value)}
                    />
                </div>

                <div className="col-span-2">
                    <label> Location </label>
                    <input
                        placeholder="Location"
                        value={location}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>

                <div className="col-span-2 sm:col-span-1 ">
                    <label> Date</label>
                    <input
                        placeholder="Date"
                        value={Date}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <div className=" flex gap-2 col-span-2 justify-between ">

                    <div className="flex  justify-self-end gap-2 col-span-1 sm:col-span-1 flex-col w-1/2">
                        <label className="flex  "> Start Time</label>
                        <input
                            placeholder="Start time"
                            value={startTime}
                            className="mt-1 block w-3/4 px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-xs"
                            onChange={(e) => setStartTime(e.target.value)} /> </div>

                    <div className="flex gap-2 col-span2 sm:col-span-1 flex-col w-1/2">
                        <label> End Time </label>
                        <input
                            placeholder="End time"
                            value={endTime}
                            className="mt-1 block w-3/4 px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-xs"
                            onChange={(e) => setEndTime(e.target.value)} />
                    </div></div>

                <div className="col-span-2">
                    <label>Description</label>
                    <input
                        placeholder="for fun "
                        value={description}
                        className="mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
            </div > */}

        </div >









        {/* <div className=" container mt-28 flex flex-col items-center h-144 w-100">

            <div className=" w-28 flex"> Event Title</div>
            <input
                placeholder="example : Tourney Thursdays "
                value={eventTitle}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm '
                onChange={(e) => setEventTitle(e.target.value)}></input>

            <input
                placeholder="Location"
                value={location}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm '
                onChange={(e) => setLocation(e.target.value)}></input>
            <input
                placeholder="Date"
                value={Date}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm '
                onChange={(e) => setDate(e.target.value)}></input>

            <input
                placeholder=" start time"
                value={startTime}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm '
                onChange={(e) => setStartTime(e.target.value)}></input>
            <input
                placeholder="end time"
                value={endTime}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm '
                onChange={(e) => setEndTime(e.target.value)}></input>

            <input
                placeholder=" description"
                value={description}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm '
                onChange={(e) => setDescription(e.target.value)}></input>




        </div> */}

    </>)
}

export default CreateGame;