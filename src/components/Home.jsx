import React from 'react'
import Carousel from '../pages/Home/Carousel'
import Feautres from '../pages/Home/Feautres'
import Category from '../pages/Home/Category'

function Home() {
  return (
    <>
    <div className='max-w-6xl w-full mx-auto space-y-6'>
      
    <Carousel /></div>
    <div className='max-w-4xl w-full mx-auto space-y-6'>
  <Feautres />
  <Category /></div>
    </>
  )
}

export default Home
