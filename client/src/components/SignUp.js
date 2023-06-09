import React from 'react'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const SignUp = (props) => {
  const [creadentials, setCreadentials] = useState({ name: "", email: "", username: "", phone: "", password: "", cpassword: "" })
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault()
    const { name, email, username, phone, password } = creadentials;
    const response = await fetch("http://localhost:5000/api/auth/createuser", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, username, phone, password })
    });
    const json = await response.json();
    console.log(json);

    if (json.success) {
      // save the auth token and redirect
      localStorage.setItem('name', json.username);
      localStorage.setItem('token', json.authToken);
      navigate("/")
      props.showAlert("Account created successfully", "success")
    } else {
      props.showAlert("Invalid details", "danger")
    }
  }
  const onChange = (e) => {
    setCreadentials({ ...creadentials, [e.target.name]: e.target.value })
  }
  return (
    <div className='container'>
      <h3>Create an account to use myNotebook</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Your Name</label>
          <input type="text" className="form-control" id="name" name='name' placeholder='Enter your Name' onChange={onChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input type="text" className="form-control" id="email" name='email' aria-describedby="emailHelp" placeholder='Enter your Email' onChange={onChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input type="text" className="form-control" id="username" name='username' placeholder='Enter a unique Username' onChange={onChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Mobile Number</label>
          <input type="text" className="form-control" id="phone" name='phone' placeholder='Enter your Mobile Number' onChange={onChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name='password' placeholder='Enter a strong Password' onChange={onChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">Confirm Password</label>
          <input type="password" className="form-control" id="cpassword" name='cpassword' placeholder='Repeat your Password' onChange={onChange} />
        </div>
        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" id="exampleCheck1" />
          <label className="form-check-label" htmlFor="exampleCheck1" >Creating an account means you’re okay with our <a href='/' style={{ textDecoration: "none" }}>Terms of Service</a>, <a href='/' style={{ textDecoration: "none" }}>Privacy Policy</a>.</label>
        </div>
        <button type="submit" className="btn btn-secondary" disabled={creadentials.username.length < 8 || creadentials.password.length < 8 || creadentials.cpassword !== creadentials.password}>Sign Up</button>
      </form>
      <div className="container my-2 mx-2">
        <Link to='/login' style={{textDecoration: 'none'}}>Existing User? Log in</Link>
      </div>
    </div>
  )
}

export default SignUp
