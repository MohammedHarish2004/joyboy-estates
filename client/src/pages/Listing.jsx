import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';
import toast from 'react-hot-toast'

export default function Listing() {

    SwiperCore.use([Navigation, Autoplay]);
    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const { currentUser } = useSelector(state => state.user);
    const [contact, setContact] = useState(false);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listId}`);
                const data = await res.json();
                if (data.success === false) {
                    setLoading(false);
                    setError(true);
                    return;
                }
                setListing(data);
                setLoading(false);
                setError(false);
                
            } catch (error) {
                setLoading(false);
                setError(true);
            }
        }
        fetchListing();
    }, [params.listId] );


return (
    <main>
        {loading && (
            <div className='flex justify-center mt-60 font-bold text-3xl'>Loading <ReactLoading type="bubbles" color="#000" height={100} width={50} /></div>
        )}
        {error && (
            <p className='text-center font-bold mt-60 text-2xl'>Something went wrong!</p>
        )}

{listing && !loading && !error && (
        <div>
          
          <Swiper navigation autoplay={{delay: 3000}} loop={true} speed={1000}>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <img src={url} alt="Estate Photos" className='h-[250px] md:h-[550px] sm:h-[450px] w-full'/>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare 
              className='text-slate-500' 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}/>
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>Link Copied!</p>
          )}

          <div className='flex flex-col max-w-4xl mx-auto p-3 my-6 gap-4'>
              <p className='text-xl sm:text-2xl font-semibold'>{listing.name}</p>
            <div className='text-md sm:text-2xl font-semibold flex items-center whitespace-nowrap'>
              Price:
              {listing.offer ? 
              <div className='flex items-center'>
                <p className='text-red-600 line-through ml-2'>₹ {listing.regularPrice}&nbsp;</p>
                <p className='text-[20px] sm:text-3xl'>&nbsp;₹ {listing.discountPrice}&nbsp;</p> 
              </div> 
              : <p>&nbsp;₹ {listing.regularPrice.toLocaleString('en-US')}</p>}

              {listing.type === 'rent' && '/ month'}
            </div>

            <p className='flex items-center mt-6 gap-6 text-slate-600 my-2'>
              <FaMapMarkerAlt className='text-green-700'/>
              {listing.address}
            </p>

            <div className='flex gap-4'>
              <p className='bg-red-800 w-full max-w-[200px] text-white text-center font-semibold rounded-md p-2 text-sm sm:text-md'>{listing.type === 'rent' ? 'For Rent' : 'For Sale'}</p>

              {listing.offer && (
                <p className='bg-green-800 w-full max-w-[200px] p-2 text-white rounded-md font-semibold text-center text-sm sm:text-md'>₹ {listing.regularPrice - listing.discountPrice}&nbsp;Discount</p>
              )}
            </div>

              <p className='text-slate-800 text-sm sm:text-[15px]'><span className='font-semibold text-black'>Description - </span>{listing.description}</p>

              <ul className='text-green-900 font-semibold text-sm flex items-center gap-4 sm:gap-6 flex-wrap'>
                <li className='flex items-center gap-1 whitespace-nowrap'><FaBed className='text-lg'/>{listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : `${listing.bedrooms} Bed`}</li>
                <li className='flex items-center gap-1 whitespace-nowrap'><FaBath className='text-lg'/>{listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : `${listing.bathrooms} Bath`}</li>
                <li className='flex items-center gap-1 whitespace-nowrap'><FaParking className='text-lg'/>{listing.parking ? 'Parking spot' : 'No Parking'}</li>
                <li className='flex items-center gap-1 whitespace-nowrap'><FaChair className='text-lg'/>{listing.furnished ? 'Furnished' : 'Not Furnished'}</li>
              </ul>

              {!currentUser && 
                <Link to={'/sign-in'} className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3 font-semibold text-center mt-4'>Sign in to Contact landlord</Link>
              }
              {currentUser && listing.userRef !== currentUser._id && !contact && (
                <button onClick={()=>setContact(true)} className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3 font-semibold'>Contact landlord</button>
              )}
              {contact && <Contact listing={listing}/>}
          </div>

        </div>
        )}
        <hr />
    </main>
  );
};
