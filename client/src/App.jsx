import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import { Toaster } from 'react-hot-toast';
import CreateListing from './pages/CreateListing'
import UpdateListing from './pages/UpdateListing'
import Listing from './pages/Listing'
import Search from './pages/Search'

export default function App() {
  return (
    <BrowserRouter>

    <Header />
    <Toaster
      reverseOrder={false}
    />

    <Routes>
      <Route path="/" element={<Home />} />
      
      <Route path="/about" element={<About />} />

      <Route path="/sign-in" element={<SignIn />} />

      <Route path="/sign-up" element={<SignUp />} />

      <Route element={<PrivateRoute />} >
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/update-listing/:listId" element={<UpdateListing />} />
      </Route>

      <Route path="/listing/:listId" element={<Listing />} />
      <Route path='/search' element={<Search />}/>

    </Routes>

    </BrowserRouter>
  )
}
