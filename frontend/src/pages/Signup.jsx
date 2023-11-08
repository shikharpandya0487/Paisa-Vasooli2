import React, { useState } from 'react'
import {Link} from 'react-router-dom'
import './SignUp.css'
import axios from "axios"
import { useNavigate } from 'react-router-dom'

function Signup({user,setUser}) {
  const navigate = useNavigate()

  const [password,setPassword]=useState("")
  const [username,setUsername]=useState("")
  const [email,setEmail]=useState("")
  const [confirmpass,setConformpass]=useState("")
  const [entries,setEntries]=useState([])
  const [isPass,isPassValid]=useState(false)
  const [isUsername,isUsernameValid]=useState(false)


  const handlePasswordChange = (event) => {
    event.preventDefault();
    const newPassword = event.target.value;
     if(newPassword.length <8)
     {
      setPassword(false);
     }
     
    setPassword(newPassword);
    isPassValid(newPassword.length >= 8);
  };
  
  const handleEmail=(event)=>{
    const k=event.target.value;
    setEmail(k);
    // setValidemail(emailValidation(k));
 }

  const handleUsernameChange = (event) => {
    event.preventDefault();
    const newUsername = event.target.value;
    setUsername(newUsername);
    isUsernameValid(newUsername.length >= 5);
  };
  
  const confirm=(event)=>{
    event.preventDefault();
    const k=event.target.value
    setConformpass(k)
  }

  const emptyConfirmpass=()=>{
   
    setConformpass("");
  }
  const submitFunction = (event) => {
    event.preventDefault(); // Prevent the form from submitting the traditional way
    if (isPass && isUsername && confirmpass===password){
      const Entry = { username: username, password: password, email: email };
      setEntries([entries, Entry]);
      const reg =async()=>{
        try{
          const res = await axios.post("http://localhost:3001/api/auth/signup",{username,email,password}).catch(function(err){
            console.log(err)})
            console.log(res.data);
            setUser(res.data.newUser)
            console.log(user)
            navigate('/dashboard')
        }catch(err){
            console.log(err);
        }
      }
      reg();
      console.log(Entry);
      // Handle form submission logic here
      //making the credentials empty after submitting
      setEmail("");
      setPassword("")
      setUsername("")
      emptyConfirmpass()
      console.log(confirmpass);
      alert("Logged in successfully")
    }
    else {
      if(confirmpass!== password)
      {
        alert("Password and confirmed pass didn't match")
      } 
      else
      alert("Invalid username or password.Make sure username is>=5 characters and password is >=8 characters");

    }
  };
  
 

  return (
    <form action="" onSubmit={submitFunction}>
      <div className="super-container">
    <div className="container">

          <div className="title">
            Sign Up
          </div>

          <div className="content">
         
            <div className="user-details">

              <div className="input-box">
                <label htmlFor="uname">username</label>
                <input
                  type="text"
                  value={username}
                  placeholder="Enter your username"
                  name="uname"
                  onChange={handleUsernameChange}
                  className="input-signup"
                  required
                />
              </div>

              <div className="input-box">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  className="input-signup"
                  value={email}
                  onChange={handleEmail}
                  required
                />
                 {/* {(!validEmail && email!=="" )? <p style={{color:'red'}}>Invalid Email address</p>:null} */}
              {console.log(email)}
              </div>

              <div className="input-box">
                <label htmlFor="psw">Password</label>
                <input
                  type="password"
                  value={password}
                  placeholder="Enter your password"
                  className="input-signup"
                  onChange={handlePasswordChange}
                  name="psw"
                  required
                />
              </div>

              <div className="input-box">
                <label htmlFor="uname">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmpass}
                  name="password"
                  onChange={confirm}
                  className="input-signup"
                  required
                />
              </div>

            </div>

            <div className="btn">
            <div 
            className="button"
            value="Submit"
            onClick={submitFunction}
            >
              Submit
            </div>

            </div>
            
            <div className="forgotPass">
           <div>Already have an account? </div>
              <div> <Link to="/login">
                Login
            </Link></div>
            </div>
        </div>
      </div>
      </div>
        </form>
  )
}

export default Signup
