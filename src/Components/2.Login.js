import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login=({onLogin}) => {
    
    const [Lform, setLform] = useState({email: '',password: ''});
    const [Msg, setMsg] = useState('');
    
    const navigate = useNavigate();

    const handleChange = (e) => {
    const { name, value } = e.target;
    setLform({...Lform,[name]: value});
  };
  
   const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(Lform.email, Lform.password);
    setLform({ email: '', password: '' }); 
    navigate('/Data');
  };

  return (
    <div className="login" style={{ maxWidth: '400px' }}>

      <h2 className="text-center">Login</h2>
      <form onSubmit={handleSubmit}>

        <div className="mail">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={Lform.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="pwd">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={Lform.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Login</button>

      </form>

      {Msg && <div className="alert alert-success mt-3">{Msg}</div>}
    </div>
  );
};

export {Login};
