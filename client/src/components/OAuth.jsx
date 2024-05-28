import {  GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { FcGoogle } from "react-icons/fc";
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)

            const result = await signInWithPopup(auth, provider)

            const res = await fetch('/api/auth/google', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: result.user.displayName, email: result.user.email, photo: result.user.photoURL }),
            })
            const data = await res.json();
            dispatch(signInSuccess(data));
            iziToast.success({
                icon: 'fas fa-check-circle',
                message: '<b>Signed in successfully!</b>',
                position: 'topRight',
                timeout:1500
              });
            navigate('/');

        } catch (error) {
            console.log('could not sign in with google', error);
        }
    };

  return (
    <button onClick={handleGoogleClick} type='button' className='bg-white border-2 p-3 rounded-lg uppercase flex items-center justify-center font-semibold hover:opacity-80'>continue with Google &nbsp;<FcGoogle /></button>
  )
}
