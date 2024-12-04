import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { auth, db } from "../../firebase/firebase"
import { setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

const Register = () => {
    
    const [userName, setUserName] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { userLoggedIn } = useAuth();

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isRegistering) {
        setIsRegistering(true);
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            setIsRegistering(false);
            return;
        }
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            const user = auth.currentUser;
            console.log(user);
            if(user){
                await setDoc(doc(db,"Users",user.uid), {
                    email: user.email,
                    userName: userName,
                });
            }
        } catch (error) {
            setErrorMessage(error.message);
            setIsRegistering(false);
        }
        }
    };

    return (
        <div className="bg-gradient-to-b from-black to-gray-900 min-h-screen flex justify-center items-center text-white">
        {userLoggedIn && <Navigate to="/profile" replace />}
        <main className="w-full p-5 flex justify-center items-center">
            <div className="mr-[50px]">
                <h1 className="text-7xl">Start A Journey!</h1>
                <div className="w-fit border-[2px] text-white italic text-lg px-4 py-2 ml-[18px]">
                Need Help for <span className="text-indigo-500">C Language?</span>
                </div>
            </div>
            
            <div className="text-left ml-[50px] bg-gray-800 bg-opacity-90 rounded-xl shadow-lg p-8 w-full max-w-md">
            <h2 className="text-4xl font-semibold">Signup</h2>
            <p className="text-sm text-gray-400 mb-6">Just some details to get you in!</p>
            <form onSubmit={onSubmit} className="space-y-5">
                <div>
                <label className="block text-sm font-bold mb-1">UserName</label>
                <input
                    type="text"
                    autoComplete="username"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                </div>
                <div>
                <label className="block text-sm font-bold mb-1">Email</label>
                <input
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                </div>
                <div>
                <label className="block text-sm font-bold mb-1">Password</label>
                <input
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                </div>
                <div>
                <label className="block text-sm font-bold mb-1">Confirm Password</label>
                <input
                    type="password"
                    autoComplete="off"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                </div>
                {errorMessage && (
                <span className="text-red-500 font-bold">{errorMessage}</span>
                )}
                <button
                type="submit"
                disabled={isRegistering}
                className={`w-full py-2 rounded-lg font-semibold transition ${
                    isRegistering
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'
                }`}
                >
                {isRegistering ? 'Signing Up...' : 'Signup'}
                </button>
            </form>
            {/* <div className="flex items-center justify-center space-x-3 my-4">
                <button className="flex items-center space-x-2 bg-gray-700 p-2 rounded-lg hover:bg-gray-600 transition">
                    <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_17_40)">
                            <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4" />
                            <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853" />
                            <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z" fill="#FBBC04" />
                            <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335" />
                        </g>
                        <defs>
                            <clipPath id="clip0_17_40">
                                <rect width="48" height="48" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                <span>Google</span>
                </button>
                <button className="flex items-center space-x-2 bg-gray-700 p-2 rounded-lg hover:bg-gray-600 transition">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Facebook_icon.svg/1280px-Facebook_icon.svg.png"
                    alt="Facebook"
                    className="w-5 h-5"
                />
                <span>Facebook</span>
                </button>
                <button className="flex items-center space-x-2 bg-gray-700 p-2 rounded-lg hover:bg-gray-600 transition">
                <img
                    src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                    alt="GitHub"
                    className="w-5 h-5"
                />
                <span>GitHub</span>
                </button>
            </div> */}
            <p className="text-center text-sm mt-4">
                Already Registered?{' '}
                <Link to="/login" className="text-indigo-400 hover:underline">
                Login
                </Link>
            </p>
            </div>
        </main>
        </div>
  );
};

export default Register;
