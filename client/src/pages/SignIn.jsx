import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
import toast from 'react-hot-toast';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

export default function SignIp() {

  const [formData, setFormData] = useState({});
  const { loading } = useSelector( (state) => state.user );
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id] : e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json(); // Converting "res" to "json format" store in a variable "data"
      if(data.success === false) {
        dispatch(signInFailure(data.message));
        toast.error(data.message);
        return;
      }
        dispatch(signInSuccess(data));
        iziToast.success({
          icon: 'fas fa-check-circle',
          message: '<b>Signed in successfully!</b>',
          position: 'topRight',
          timeout:1500
        });
        navigate('/');

      } catch (error) {
        dispatch(signInFailure(error.message));
        toast.error(error.message);
      }
  };

  return (
    <div className='mt-5 p-9 max-w-xl mx-auto border-0 sm:border-2 sm:shadow-lg rounded-lg'>

      <h1 className='text-3xl text-center font-bold mb-7 '>Sign In</h1>

      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type="text" placeholder='Enter Username' className='border-2 p-3 rounded-lg' id="username"  onChange={handleChange}/>
        <input type="password" placeholder='Enter Password' className='border-2 p-3 rounded-lg' id="password" onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-700 p-3 text-white rounded-lg uppercase font-semibold hover:opacity-95 disabled:opacity-85'>
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth />
      </form>

      <div className='flex gap-2 mt-5'>
        <p>Didn't Have an Account?</p>
        <Link to="/sign-up">
          <span className='text-blue-700 font-semibold hover:underline'>Sign Up</span>
        </Link>
      </div>

    </div>
  )
}
