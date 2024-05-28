import { MdOutlineRealEstateAgent } from "react-icons/md";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Footer() {
    const { currentUser } = useSelector(state => state.user);
  return (
    <footer className="bg-slate-200 pb-2">
        <div className="max-w-6xl mx-auto  flex flex-col lg:flex-row items-start lg:justify-between p-5">
            <div className="max-w-xl">
                <h1 className='font-bold text-2xl text-slate-700 flex items-center'><span className='text-green-500'>Zoro</span>Estate <MdOutlineRealEstateAgent className='text-slate-700'/></h1>

                <p className="text-slate-500 indent-10 text-justify my-4 ">ZoroEstate, we're dedicated to helping you find your perfect home. Whether you're looking to buy, sell, or rent, our team of experienced real estate professionals is here to guide you every step of the way.</p>
            </div>
            <div className="flex flex-col lg:text-right gap-3 pb-3">
                <h1 className="text-xl font-semibold text-slate-700">Links to </h1>
                <Link to={'/'} className="text-slate-600 hover:underline">Home</Link>
                <Link to={'/about'} className="text-slate-600 hover:underline">About</Link>
                {currentUser && <Link to={'/profile'} className="text-slate-600 hover:underline">Profile</Link>}
                <Link to={'/search'} className="text-slate-600 hover:underline">Search</Link>
            </div>
        </div>
        <div className="text-center border-t-2 border-t-slate-300">
            <p className="font-semibold pt-3">Copyrights&copy;2024 <span className="text-green-600">Zoro</span>Estate.com</p>
        </div>
    </footer>
  )
}
