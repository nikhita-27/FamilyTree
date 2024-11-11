import React , {useState} from "react";
import { useNavigate } from 'react-router-dom';

const Register=({onRegister})=>{

    const[Rform,setRform]=useState({username:'',email:'',password:''});
    const[Texts,setTexts]=useState('');

    const navigate = useNavigate();

    const handleProcess=(e)=>{
            const {name,value}=e.target;
            setRform({...Rform,[name]: value});
          };

    const handleSubmit = (e) => {
            e.preventDefault();
            onRegister(Rform);
            setRform({ email: '', password: '' });
            navigate('/login');
            // API Call
    };
          
    
    return(
    <div className="getStarted" style={{ maxWidth: '400px' }}>

    <h2 className="text-center">Register Here</h2>
    <form onSubmit={handleSubmit}>

      <div className="uname">
        <label className="form-label">Username</label>
        <input
          type="text"
          name="username"
          className="form-control"
          value={Rform.username}
          onChange={handleProcess}
          required
        />
      </div>

      <div className="mail">
        <label className="form-label">Email</label>
        <input
          type="email"
          name="email"
          className="form-control"
          value={Rform.email}
          onChange={handleProcess}
          required
        />
      </div>
      
      <div className="pw">
        <label className="form-label">Password</label>
        <input
          type="password"
          name="password"
          className="form-control"
          value={Rform.password}
          onChange={handleProcess}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary Rbtn">Register</button>

    </form>

    {Texts && <div className="alert alert-success mt-3">{Texts}</div>}
  </div>
);

}

export {Register};