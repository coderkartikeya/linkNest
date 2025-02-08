import React from 'react'
import ResponsiveTabBar from '../components/TabBar'
import GoogleMapComponent from '../components/GoogleMap'

const page = () => {
  return (
    <div className='flex flex-row md:h-screen bg-slate-100'>
        <div>
            <ResponsiveTabBar/>
        </div>
        <div className=' flex flex-col bg-white w-full md:w-full m-3 p-3 md:m-5 md:p-5 rounded-lg '>
            <div className='rounded-lg drop-shadow-lg'>

            <GoogleMapComponent/>
            </div>
            <div>
                
            </div>

            
        </div>
    </div>
  )
}

export default page