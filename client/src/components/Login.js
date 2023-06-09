import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'


const Login = (props) => {
    const [creadentials, setCreadentials] = useState({ username: "", password: "" })

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: creadentials.username, password: creadentials.password })
        });
        const json = await response.json();
        console.log(json);

        if (json.success) {
            // save the auth token and redirect
            localStorage.setItem('token', json.authToken);
            props.showAlert("logged in successfully", "success")
            navigate("/")
        } else {
            props.showAlert("Invalid Credentials", "danger")
        }
    }
    const onChange = (e) => {
        setCreadentials({ ...creadentials, [e.target.name]: e.target.value })
    }
    return (
        <div className='mt-5.5'>
            <h3>Login to Continue to myNotebook</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="Username" className="form-label">Username</label>
                    <input type="text" className="form-control" value={creadentials.username} onChange={onChange} placeholder="Username" name='username' id='username' style={{ width: "20rem" }} />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" value={creadentials.password} onChange={onChange} name='password' id="password" placeholder="Password" style={{ width: "20rem" }} />
                </div>
                <button type="submit" className="btn btn-secondary" disabled={creadentials.username.length<8 || creadentials.password.length<8}>Submit</button>
            </form>
            <div className="container my-3 mx-3"><Link to="/signup" style={{textDecoration: 'none'}}>New to myNotebook? Create an account</Link></div>
        </div>
    )
}

export default Login
