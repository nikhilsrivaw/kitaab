import { createContext , useState , useEffect } from "react";
  import {authAPI} from "../services/api";

  export const AuthContext = createContext();

  export const AuthProvider = ({children}) => {
      const [user , setUser] = useState(null);
      const [token , setToken ] = useState(null);
      const [loading , setLoading] = useState(true);

      useEffect(()=>{
          const storedToken = localStorage.getItem('token');
          const storedUser = localStorage.getItem('user');

          if(storedToken && storedUser){
              setToken(storedToken);
              setUser(JSON.parse(storedUser));
          }
          setLoading(false);
      },[]);

      const login = async (credentials) =>{
          try {
              const response = await authAPI.login(credentials);
              const {token , user} = response.data;

              setToken(token);
              setUser(user);

              localStorage.setItem('token' , token);
              localStorage.setItem('user' , JSON.stringify(user));
              return {success:true};
          } catch (error) {
              return {
                  success: false,
                  error: error.response?.data?.error || 'login failed'
              }
          }
      };

      const register = async (userData) =>{
          try {
              const response = await authAPI.register(userData);
              return {success: true , data:response.data};
          } catch (error) {
              return {
                  success: false,
                  error: error.response?.data?.error || 'Registration failed'
              };
          }
      };

      const logout = () =>{
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
      };

      const value ={
          user,
          token,
          login,
          register,
          logout,
          isAuthenticated: !!token
      };

      if(loading){
          return <div>Loading ...</div>
      }

      return (
          <AuthContext.Provider value={value}>
              {children}
          </AuthContext.Provider>
      );
  };