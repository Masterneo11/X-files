import { useState } from 'react';
import { Link } from 'react-router-dom';
import see_password from "../assets/eye.png";
import hide_password from "../assets/hidden.png"

const Login: React.FC = () => {
    // Set the initial state to false so that the password is hidden initially
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <div className='box-border h-400 w-300 mb-8 flex flex-col justify-center items-center mt-64'>
                <div className='basis-6'>
                    <input className='box-border mb-2 h-10 w-80 flex pl-3' placeholder='Username' />

                    <div className="relative mb-20">
                        <input
                            type={showPassword ? "text" : "password"} // Toggle input type based on state
                            className="box-border h-10 w-80 pl-3 pr-10" // Added padding for icon space
                            placeholder="Password"
                        />
                        <img
                            src={showPassword ? see_password : hide_password} // Show closed eye first
                            alt="Toggle Password Visibility"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                        />
                    </div>

                    <Link to="/home" className="btn btn-primary w-full mt-3 text-sm flex justify-center"> Login </Link>
                    <Link to="/create" className="btn btn-outline-success border-green text-green hover:bg-green w-full mt-3 text-sm"> Create account</Link>
                    <Link to="/login/forgot_password" className='text-blue justify-end flex mr-3 text-sm'> Forgot password?</Link>
                </div>
            </div>
        </>
    );
};

export default Login;
