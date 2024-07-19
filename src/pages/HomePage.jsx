import { useState } from 'react'

import Navbar from '../components/Riad/Navbar.jsx'
import Footer from '../components/Riad/Footer.jsx'
import RiadList from '../components/Riad/RiadList.jsx'
import Header from '../components/Riad/Header.jsx'
import Incentive from "../components/Riad/Incentive.jsx"
import {Slider} from "../components/Riad/Slider.jsx";

function HomePage() {
    return (
        <>
            <Navbar />
            <Header />
            <Slider />
            <RiadList />
            <Incentive />
            <Footer />
        </>
    )
}

export default HomePage
