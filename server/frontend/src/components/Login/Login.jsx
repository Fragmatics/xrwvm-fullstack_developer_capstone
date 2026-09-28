import React, { useState } from 'react';

import AuthLayout from '../Auth/AuthLayout';

const Login = ({ onClose }) => {

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [open,setOpen] = useState(true)

  let login_url = window.location.origin+"/djangoapp/login";

  const login = async (e) => {
    e.preventDefault();

    const res = await fetch(login_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "userName": userName,
            "password": password
        }),
    });
    
    const json = await res.json();
    if (json.status != null && json.status === "Authenticated") {
        sessionStorage.setItem('username', json.userName);
        setOpen(false);        
    }
    else {
      alert("The user could not be authenticated.")
    }
};

  if (!open) {
    window.location.href = "/";
  };
  

  return (
    <AuthLayout eyebrow="Welcome back" title="Sign in to your account" subtitle="Log in to post reviews and share your dealership experience.">
    <div onClick={onClose}>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className='modalContainer'
      >
          <form className="space-y-5" onSubmit={login}>
              <div>
              <label htmlFor="username" className="form-label">Username</label>
              <input type="text" id="username" name="username" placeholder="Enter your username" className="form-input" autoComplete="username" onChange={(e) => setUserName(e.target.value)}/>
              </div>
              <div>
              <label htmlFor="psw" className="form-label">Password</label>
              <input id="psw" name="psw" type="password" placeholder="Enter your password" className="form-input" autoComplete="current-password" onChange={(e) => setPassword(e.target.value)}/>
              </div>
              <div className="flex gap-3 pt-1">
              <input className="btn-primary flex-1 cursor-pointer" type="submit" value="Login"/>
              <input className="btn-secondary cursor-pointer" type="button" value="Cancel" onClick={()=>setOpen(false)}/>
              </div>
              <p className="text-center text-sm text-slate-600">
                Don&apos;t have an account? <a className="font-semibold text-brand-600 hover:text-brand-700" href="/register">Register Now</a>
              </p>
          </form>
      </div>
    </div>
    </AuthLayout>
  );
};

export default Login;
