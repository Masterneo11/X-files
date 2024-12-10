import { Link } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {

    const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to /home if already authenticated
        if (isAuthenticated) {
            navigate("/home");
        }

    }, [isAuthenticated, navigate]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <><>
            <div className="flex justify-end box-border h-auto w-full mb-8 mt-32 sm:mt-64 px-4 sm:px-8">
                <div className="w-full sm:w-96 md:w-[30rem] lg:w-[35rem] xl:w-[40rem] flex flex-col items-center">
                    <div className="basis-6 text-center px-4 sm:px-0 flex flex-col">

                        <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-4 flex justify-start self-start" >
                            Welcome to Omada Group Events
                        </div>
                        <div className="text-sm text-gray-500 sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-4 flex justify-start self-start" >
                            Primarily made to help you find local board game events and video game events in your area
                        </div>

                        <div className="h-14 w-full sm:w-48 flex items-center justify-center bg-blue-500 rounded-md mb-4">
                            <button
                                onClick={() => loginWithRedirect()}
                                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-300"
                            >
                                Log In
                            </button>
                        </div>
                        <Link to="/create" className="bg-green-400 h-12 border-green text-white hover:bg-green w-full sm:w-48 mt-3 text-sm" >
                            Create account</Link>



                    </div>
                </div>
            </div>

        </>
        </>
    );
};

export default Login;
































{/* <input className='box-border mb-2 h-10 w-80 flex pl-3' placeholder='Username' /> */ }
{/* <div className="relative mb-20"><input
                            type={showPassword ? "text" : "password"} // Toggle input type based on state
                            className="box-border h-10 w-80 pl-3 pr-10" // Added padding for icon space
                            placeholder="Password"/> 
                        <img
                            src={showPassword ? see_password : hide_password} // Show closed eye first
                            alt="Toggle Password Visibility"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)} // Toggle password visibility/> </div> */}
{/* <div className="box-border h-auto w-full sm:w-96 md:w-[30rem] lg:w-[35rem] xl:w-[40rem] mb-8 flex flex-col justify-center items-center mt-32 sm:mt-64">
                    <div className="basis-6 text-center px-4 sm:px-0">
                        <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-4">
                            Welcome to Omada Gaming Center
                        </div>
                        <div className="h-14 w-full sm:w-48 flex items-center justify-center bg-blue rounded-md mb-4">
                            <LoginButton />
                        </div>
                        <Link to="/home" className="btn btn-primary w-full sm:w-48 mt-3 text-sm flex justify-center">
                            Login
                        </Link>
                        <Link
                            to="/create"
                            className="btn btn-outline-success border-green text-green hover:bg-green w-full sm:w-48 mt-3 text-sm"
                        >
                            Create account
                        </Link>
                        <Link
                            to="/login/forgot_password"
                            className="text-blue text-sm flex justify-end w-full sm:w-48 mt-3"
                        >
                            Forgot password?
                        </Link>
                    </div>
                </div> */}


{/* <div className='box-border h-400 w-300 mb-8 flex flex-col justify-center items-center mt-64'>
                <div className='basis-6'>
                    <div> Welcome to Omada gaming center</div>
                    <div className=' h-14 w-30 flex align-middle justify-center bg-blue rounded-md'> <LoginButton /> </div>
                    <Link to="/home" className="btn btn-primary w-full mt-3 text-sm flex justify-center"> Login </Link>
                    <Link to="/create" className="btn btn-outline-success border-green text-green hover:bg-green w-full mt-3 text-sm"> Create account</Link>
                    <Link to="/login/forgot_password" className='text-blue justify-end flex mr-3 text-sm'> Forgot password?</Link>
                </div>
            </div> */}