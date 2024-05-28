import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import {Swiper, SwiperSlide} from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import 'swiper/swiper-bundle.css';
import Footer from '../components/Footer';

export default function Home() {

  SwiperCore.use([Navigation, Autoplay ])
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);


  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    }

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error)
      }
    }

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error)
      }
    }

    fetchOfferListings();
  }, [])

  return (
    <div>
      {/* Top Starts */}
      <div className="flex flex-col gap-6 p-28 px-4 max-w-6xl mx-auto">
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>Find your next <span className='text-slate-500'>Perfect</span><br /> place with ease</h1>
        <div className="text-gray-500 text-xs sm:text-sm">
          JoyBoy Estate is the best place to find your next perfect place to live. <br />We have a wide range of properties for you to choose from.
        </div>
        <Link to={'/search'} className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'>
          Let's get Started...
        </Link>
      </div>
      {/* Top Ends */}

      {/* swiper Starts */}
      <Swiper navigation autoplay={{ delay: 3000 }} loop={true} speed={1000}>
        {offerListings && offerListings.length > 0 && offerListings.map((listing) => (
          <SwiperSlide key={listing._id}>
            <div>
              <img src={listing.imageUrls[0]} alt="offer listing" className='h-[200px] md:h-[300px] lg:h-[450px] object-cover w-full'/>
            </div>
          </SwiperSlide>
        ))
        }
      </Swiper>
      {/* swiper Ends */}

      {/* Listing Starts */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
              <Link to='/search?offer=true' className='text-sm text-blue-800 hover:underline'>
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-3">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
              <Link to='/search?type=rent' className='text-sm text-blue-800 hover:underline'>
                Show more places for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-3">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
              <Link to='/search?type=sale' className='text-sm text-blue-800 hover:underline'>
                Show more places for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-3">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Listing Ends */}
      <hr />
      <Footer />
    </div>
  )
}
