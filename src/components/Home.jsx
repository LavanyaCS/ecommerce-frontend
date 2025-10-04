import React from 'react'
import Feautres from '../pages/Home/Feautres'
import Category from '../pages/Home/Category'
import NewProduct from '../pages/Home/NewProduct'
import HeroSection from '../pages/Home/HeroSection'
import LandingReview from '../pages/Home/LandingReview'

function Home() {
  return (
    <>
    <div className='max-w-5xl w-full mx-auto space-y-6'>
      
    <HeroSection /></div>
    <div className='max-w-5xl w-full mx-auto space-y-6'>
  <Feautres />
  <Category />
 <NewProduct /> 
 <LandingReview /> </div>
    </>
  )
}

export default Home
