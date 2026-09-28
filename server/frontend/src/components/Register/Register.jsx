import React, { useState } from "react";
import AuthLayout from "../Auth/AuthLayout";

// Small input icons, drawn inline so they follow the text colour
const icons = {
  user: <path d="M20 21a8 8 0 1 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"/>,
  email: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
  password: <><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 1 1 8 0v4"/></>,
};

const IconInput = ({ icon, label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="form-label">{label}</label>
    <div className="relative">
      <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[icon]}</svg>
      <input id={id} className="form-input pl-10" {...props}/>
    </div>
  </div>
);

const Register = () => {
// State variables for form inputs
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setlastName] = useState("");

// Redirect to home
  const gohome = ()=> {
    window.location.href = window.location.origin;
  }

// Handle form submission
  const register = async (e) => {
    e.preventDefault();

    let register_url = window.location.origin+"/djangoapp/register";

// Send POST request to register endpoint
    const res = await fetch(register_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "userName": userName,
            "password": password,
            "firstName":firstName,
            "lastName":lastName,
            "email":email
        }),
    });

    const json = await res.json();
    if (json.status) {
	// Save username in session and reload home
        sessionStorage.setItem('username', json.userName);
        window.location.href = window.location.origin;
    }
    else if (json.error === "Already Registered") {
      alert("The user with same username is already registered");
      window.location.href = window.location.origin;
    }
};

  return(
    <AuthLayout eyebrow="Get started" title="Create your account" subtitle="Sign up to review dealerships and help other drivers buy with confidence.">
      <form onSubmit={register} className="space-y-5">
        <IconInput icon="user" label="Username" id="username" type="text" name="username" placeholder="Choose a username" autoComplete="username" onChange={(e) => setUserName(e.target.value)}/>
        <div className="grid gap-5 sm:grid-cols-2">
          <IconInput icon="user" label="First Name" id="first_name" type="text" name="first_name" placeholder="First name" autoComplete="given-name" onChange={(e) => setFirstName(e.target.value)}/>
          <IconInput icon="user" label="Last Name" id="last_name" type="text" name="last_name" placeholder="Last name" autoComplete="family-name" onChange={(e) => setlastName(e.target.value)}/>
        </div>
        <IconInput icon="email" label="Email" id="email" type="email" name="email" placeholder="you@example.com" autoComplete="email" onChange={(e) => setEmail(e.target.value)}/>
        <IconInput icon="password" label="Password" id="psw" type="password" name="psw" placeholder="Create a password" autoComplete="new-password" onChange={(e) => setPassword(e.target.value)}/>
        <div className="flex gap-3 pt-1">
          <input className="btn-primary flex-1 cursor-pointer" type="submit" value="Register"/>
          <a href="/" onClick={()=>{gohome()}} className="btn-secondary">Cancel</a>
        </div>
        <p className="text-center text-sm text-slate-600">
          Already have an account? <a className="font-semibold text-brand-600 hover:text-brand-700" href="/login">Sign in</a>
        </p>
      </form>
    </AuthLayout>
  )
}

export default Register;
