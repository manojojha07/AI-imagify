import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));

    const [credit, setCredit] = useState(false);
   

    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const loadCreaditsData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/auth/credits`, 
                { headers:{token} });
            if(data.success) {
                toast.success(data.message);
                // console.log("user credit success: ", data.credits); // ✅ 5
                setCredit(data.credits); // ✅ 5
                setUser(data.user);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const generateImage = async (prompt) => {
     try {
        const { data } = await axios.post(`${backendUrl}/api/image/generate-image`, 
            {prompt} ,{headers:{token}});
         
        if(data.success){
            loadCreaditsData();
            return data.resultImage
        }
        else{
            toast.error(data.message);
            loadCreaditsData();
            if(data.creditBalance === 0){
                navigate('/buy')
            }
        }
        
     } catch (error) {
        if (error.response && error.response.data) {
      const errData = error.response.data;
      toast.error(errData.message);

      // 6️⃣ Navigate if credit balance is 0 in error response
      if (errData.creditBalance === 0) {
        navigate('/buy');
      }
    } else {
      toast.error(error.message); // generic error fallback
    }
     }
    }

    const logOut = async () => {
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
        toast.success("Logout Success")
    }

    useEffect(() => {
        if (token) {
            loadCreaditsData();
        }
    }, [token]);


    const value = {
        user, setUser, navigate, showLogin, setShowLogin, backendUrl,
        token, setToken, credit, setCredit, loadCreaditsData, logOut, generateImage
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
export default AppContextProvider;