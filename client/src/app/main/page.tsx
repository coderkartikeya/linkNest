'use client'
import React, { useEffect } from 'react'
import withAuth from '@/Hoc/WithAuth'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

const page = () => {
    const { isAuthenticated } = useAuth()
    const router = useRouter()
    useEffect(()=>{
        if(!isAuthenticated){
            router.push('/login')
        }
    })

  return (
    <div>page</div>
  )
}

export default page