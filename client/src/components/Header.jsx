import { FaSearch } from 'react-icons/fa';
import { FaHome } from "react-icons/fa";
import { MdMessage, MdOutlineRealEstateAgent } from "react-icons/md";
import { FaSignInAlt } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';


export default function Header() {
  const {currentUser} = useSelector(state => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => { 
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search])

  return (
    <header className='bg-slate-200 shadow-md'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>

          <Link to="/" >
            <h1 className='font-bold text-sm sm:text-xl flex items-center flex-wrap'>
                <span className='text-green-500'>Zoro</span>
                <span className='text-slate-700'>Estate&nbsp;</span>
                <MdOutlineRealEstateAgent className='text-slate-700'/>
            </h1>
          </Link>
          
            <form onSubmit={handleSubmit} className='bg-slate-100 p-2 sm:p-3 rounded-lg flex items-center'>
                <input 
                  type="text" 
                  placeholder='Search...' className='bg-transparent focus:outline-none w-16 sm:w-64'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button>
                  <FaSearch className="text-slate-600" />
                </button>
            </form>

            <ul className='flex gap-7'>
              <Link to="/" className='hidden sm:inline hover:underline font-bold'>
                <li className='text-slate-700 flex items-center gap-1'><FaHome/>Home</li>
              </Link>
              <Link to="about" className='hidden sm:inline hover:underline font-bold'>
                <li className='text-slate-700 flex items-center gap-1'><MdMessage/>About</li>
              </Link>
              <Link to="/profile" className='flex items-center gap-1 whitespace-nowrap text-sm sm:text-[16px]'>
                {currentUser ? (
                    <img src={currentUser.avatar} alt="profile" className='rounded-full h-7 w-7 object-cover'/>
                 ) : (
                  <>
                    <FaSignInAlt  className='text-slate-700'/>
                    <li className='text-slate-700 hover:underline font-bold'>Sign In</li>
                  </>
                 )}
              </Link>
            </ul>

        </div>
    </header>
  )
}
