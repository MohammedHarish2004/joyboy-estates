import { BsHouseCheck } from "react-icons/bs";
import { MdSell, MdDelete } from "react-icons/md";
import { FaParking, FaImages, FaChair, FaBed, FaBath } from "react-icons/fa";
import { BiSolidOffer, BiSolidBadgeDollar } from "react-icons/bi";
import { RiDiscountPercentFill } from "react-icons/ri";
import { useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import toast from "react-hot-toast";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css'

export default function CreateListing() {

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector(state => state.user);
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true)
      const promises = [];

      for (let i = 0; i < files.length; i++ ) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises).then((urls) => {
        setFormData({ 
          ...formData, 
          imageUrls: formData.imageUrls.concat(urls) 
        });
        toast.success('Image Uploaded Successfully');
        setUploading(false);
        
      }).catch( (err) => {
        toast.error('Image upload failed (2mb max per image)');
        setUploading(false);
      });

    } else if (files.length == 0){
      toast.error('You must upload atleast one image');
    } else {
      toast.error('You can only upload 6 image per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise( (resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on("state_changed", (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        },

      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter( (_,i) => i !== index ),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    };
    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    };
    if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1 ) return toast.error('You must upload atleast one image');
      if (+formData.discountPrice > +formData.regularPrice) return toast.error('Discount price must be lower than regular price');
      setLoading(true);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        })
      });

      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        toast.error(data.message);
      }
      iziToast.success({
        icon: 'fas fa-check-circle',
        message: '<b>Listing Created successfully!</b>',
        position: 'topRight',
        timeout:1500
      });
      navigate(`/listing/${data._id}`);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  }
  

  return (
    <main className='p-2 max-w-5xl mx-auto'>
      <h1 className='text-3xl font-bold text-center mt-5 mb-6'>Create a Listing</h1>

      <form className='flex flex-col sm:flex-row gap-4' onSubmit={handleSubmit}>

        <div className='flex flex-col gap-4 flex-1'>

          <input type="text" placeholder="Name" className='border-2 border-gray-300 p-3 rounded-lg' id="name" maxLength='62' minLength='10' required onChange={handleChange} value={formData.name} />
          <textarea type="text" placeholder="Description" className='border-2 border-gray-300 p-3 rounded-lg' id="description"  required onChange={handleChange} value={formData.description} />
          <input type="text" placeholder="Address" className='border-2 border-gray-300 p-3 rounded-lg' id="address" required onChange={handleChange} value={formData.address} />

          <div className='flex items-center gap-6 flex-wrap mt-2'>
            <div className='flex gap-2'>
              <input type="checkbox" className='w-5' id="sale" onChange={handleChange} checked={formData.type === 'sale'} />
              <span className="flex items-center">Sell&nbsp;<MdSell className="text-slate-700"/></span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" className='w-5' id="rent" onChange={handleChange} checked={formData.type === 'rent'} />
              <span className="flex items-center">Rent&nbsp;<BsHouseCheck className="text-slate-700"/></span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" className='w-5' id="parking" onChange={handleChange} checked={formData.parking} />
              <span className="flex items-center">Parking Spot&nbsp;<FaParking className="text-slate-700"/></span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" className='w-5' id="furnished" onChange={handleChange} checked={formData.furnished} />
              <span className="flex items-center">Furnished&nbsp;<FaChair className="text-slate-700"/></span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" className='w-5' id="offer" onChange={handleChange} checked={formData.offer} />
              <span className="flex items-center">Offer&nbsp;<BiSolidOffer className="text-slate-700"/></span>
            </div>
          </div>

          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input type="number" id='bedrooms' min='1' max='10' required className='p-3 border-2 border-slate-300 rounded-lg' onChange={handleChange} value={formData.bedrooms} />
              <p className="flex items-center">Beds&nbsp;<FaBed className="text-slate-700"/></p>
            </div>
            <div className='flex items-center gap-2'>
              <input type="number" id='bathrooms' min='1' max='10' required className='p-3 border-2 border-slate-300 rounded-lg' onChange={handleChange} value={formData.bathrooms} />
              <p className="flex items-center">Bathrooms&nbsp;<FaBath className="text-slate-700"/></p>
            </div>
            <div className='flex items-center gap-2'>
              <input type="number" id='regularPrice' min='50' max='100000000' required className='p-3 border-2 border-slate-300 rounded-lg' onChange={handleChange} value={formData.regularPrice}/>
              <div className="flex flex-col items-center">
                <p className="flex items-center"><BiSolidBadgeDollar className="text-slate-700"/>&nbsp;Regular Price</p>
                <span className='text-xs'>($ / months)</span>
              </div>
            </div>
            { formData.offer && (
            <div className='flex items-center gap-2'>
              <input type="number" id='discountPrice' min='0' max='10000000' required className='p-3 border-2 border-gray-300 rounded-lg' onChange={handleChange} value={formData.discountPrice}/>
              <div className="flex flex-col items-center">
                <p className="flex items-center"><RiDiscountPercentFill className="text-slate-700"/>&nbsp;Discount Price</p>
                <span className='text-xs'>($ / months)</span>
              </div>
            </div>
            )}

          </div>

        </div>

        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold flex items-center'><FaImages className="text-slate-700"/>&nbsp;Images:
          <span className='font-normal text-gray-600 ml-2'>The first image will be the cover photo (max 6)</span></p>

          <div className='flex gap-4'>
            <input className='p-3 border border-gray-300 rounded w-full' type="file" id='images' accept='image/*' multiple onChange={(e)=>setFiles(e.target.files)}/>
            <button type="button" disabled={uploading} className='p-3 text-green-700 border border-green-700 rounded uppercase disabled:opacity-80 upload font-semibold hover:shadow-lg' onClick={handleImageSubmit}>{uploading ? 'Uploading...' : 'Upload'}</button>
          </div>
            {uploading && (
              <div className="progress-container">
                <div className="progress-bar" style={{width: `${progress}%`}}></div>
              </div>
            )
            }

          {
            formData.imageUrls.length > 0 && formData.imageUrls.map( (url, index) => (
              <div key={url} className="flex justify-between p-3 border items-center">
                <img src={url} alt="listing image" className="w-20 h-20 object-contain rounded-lg"/>
                <span className="">Image {index + 1}</span>
                <button type="button" onClick={ ()=>handleRemoveImage(index) } className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75 flex items-center">Delete&nbsp;<MdDelete /></button>
              </div>
            ))
          }

          <button disabled={loading || uploading} className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 font-semibold'>{loading ? 'Creating...' : 'Create Listing' }</button>
        </div>

      </form>
    </main>
  )
}
