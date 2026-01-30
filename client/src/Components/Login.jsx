import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { motion } from "motion/react";
import axios from "axios";
import { toast } from "react-toastify";
import { data } from "react-router-dom";

const Login = () => {

  const {setShowLogin, setToken, token, backendUrl,setUser} = useContext(AppContext)


  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const onSubmitHandler = async (event) => {
  event.preventDefault();
  try {
    if(state === 'login'){
    const { data } =  await axios.post(`${backendUrl}/api/auth/login`, {email, password});
    if(data.success){
      toast.success(data.message);
      setToken(data.token);
      console.log("token sucessfully set  login : " , data.token);
      
      setUser(data.user);
      localStorage.setItem('token', data.token);
      setShowLogin(false);
    }
    else{
       toast.error(data.message);
    }
  }
  else{
    const {data} = await axios.post(`${backendUrl}/api/auth/register` , {name, email,password});
    if(data.success){
      toast.success(data.message);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token)
      setShowLogin(false);
    }
    else{
      toast.error(data.message);
    }
  }
  } catch (error) {
    toast.error(error.message);
  }
 }


  useEffect(()=> {
    document.body.style.overflow = 'hidden';

    return ()=> {
      document.body.style.overflow = 'unset';
    }
  })


  return (
    <div className=" fixed inset-0 z-10 backdrop-blur-sm bg-black/40 flex justify-center items-center">

      {/* Form Box */}
      <motion.form  onSubmit={onSubmitHandler}
      initial={{opacity:0.2, y:50}}
    transition={{duration:0.5}}
    whileInView={{opacity:1, y:0}}
    viewport={{once:true}}
      className="relative bg-white p-10 rounded-2xl shadow-xl w-[420px] text-slate-600">

        {/* Cross Icon */}
        <img onClick={()=> setShowLogin(false)}
          src={assets.cross_icon}
          className="absolute w-6 top-4 right-4 cursor-pointer"
          alt="close"
        />

        {/* Title */}
        <h1 className="text-center text-3xl font-semibold text-neutral-800 mb-2">
          {state === "login" ? "Login" : "Sign Up"}
        </h1>

        {state === "register" ? (
          <p className="text-center text-sm text-slate-500 mb-8">
            Welcome! Please create your account
          </p>
        ) : (
          <p className="text-center text-sm text-slate-500 mb-8">
            Welcome! Please login to your account
          </p>
        )}

        {/* Input - Full Name */}
        {state === "register" && (
          <div className="flex items-center gap-3 border rounded-xl px-5 py-2.5 hover:border-blue-500 transition">
            <img width={27} src={assets.profile_icon} alt="profile" />
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Full Name"
              required
              className="w-full outline-none text-sm"
            />
          </div>
        )}

        {/* Email */}
        <div className="flex items-center gap-3 border rounded-xl px-5 py-3 mt-4 hover:border-blue-500 transition">
          <img width={26} src={assets.email_icon} alt="email" />
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Enter Email..."
            required
            className="w-full outline-none text-sm"
          />
        </div>

        {/* Password */}
        <div className="flex items-center gap-3 border rounded-xl px-5 py-2.5 mt-4 hover:border-blue-500 transition">
          <img width={20} src={assets.lock_icon} alt="password" />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Password"
            required
            className="w-full outline-none text-sm"
          />
        </div>

        <p className="text-sm py-2 cursor-pointer">Forgot password?</p>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2.5 rounded-xl mt-4 text-xl hover:bg-blue-700 transition active:scale-95"
        >
          {state === "login" ? "Login" : "Create Account"}
        </button>

        {/* Toggle Login/Signup */}
        {state === "register" ? (
          <p className="pt-2">
            Already have an account?{" "}
            <span
              onClick={() => setState("login")}
              className="text-orange-500 cursor-pointer"
            >
              click here
            </span>
          </p>
        ) : (
          <p className="pt-2">
            Create an account?{" "}
            <span
              onClick={() => setState("register")}
              className="text-orange-500 cursor-pointer"
            >
              click here
            </span>
          </p>
        )}
      </motion.form>
    </div>
  );
};

export default Login;
