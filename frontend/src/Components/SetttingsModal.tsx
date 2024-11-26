import React, { useState } from "react";
import LogoutButton from '../Components/LogoutButton';


function SettingsModal() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            {/* Settings Trigger */}
            <div
                className="block text-white  hover:text-gray-300 cursor-pointer"
                onClick={() => setIsModalOpen(true)}
            >
                Settings
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                        <h2 className="text-lg text-gray-600 font-bold mb-4">Settings</h2>


                        {/* Logout Button */}
                        <div className="bg-white text-red-500 border border-red-500 px-4 py-2 rounded w-full justify-center "><LogoutButton className=" w-full " /></div>

                        <div className="bg-blue  rounded hover:bg-blue-600"><button className=" w-full bg-white text-blue-500 border border-2px border-blue-500 px-4 py-2 rounded hover:bg-blue-600"
                            onClick={() => setIsModalOpen(false)}> Close </button>
                        </div>
                    </div>
                </div>

            )}
        </div>
    );
}

export default SettingsModal;
