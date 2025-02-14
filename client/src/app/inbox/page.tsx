import React from 'react'
import ResponsiveTabBar from '../components/TabBar'

const page = () => {
    
  return (
    <div className='h-screen flex flex-row bg-slate-200'>
        <div>

        <ResponsiveTabBar/>
        </div>
        <div className='md:m-5 m-3 md:p-5 p-3 rounded-xl w-full bg-white flex'>

        </div>
    </div>
  )
}

export default page