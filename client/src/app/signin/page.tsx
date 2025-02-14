'use client'
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const FormComponent = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    profilePic: null,
  });
  const [worker, setWorker] = useState<Worker | null>(null);
  // creation of router to push on login screen when profile is created
  const router=useRouter();
  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e:any) => {
    setFormData({ ...formData, profilePic: e.target.files[0] });
  };

  const handleSubmit =  async(e:any) => {
    e.preventDefault();
    const {fullName,username,email,password,profilePic}=formData;
    if((fullName||username||email||password)===''){
        alert("every field is required");
    }

    if(profilePic===null){
        alert("profile pic is necessary");
    }
    try {
        const formDataToSend = new FormData();
    formDataToSend.append('fullName', fullName);
    formDataToSend.append('username', username);
    formDataToSend.append('email', email);
    formDataToSend.append('password', password);
    if (profilePic) {
        formDataToSend.append('profilePic', profilePic);
    }else{
        alert("profile pic is necessary");
    }
    
        
        const response=await fetch(`${process.env.NEXT_PUBLIC_ADDRESS}/api/v1/users/register`,{
            method:'POST',
            body:formDataToSend,            
        })
        if(response.ok){           
            router.push('/login');
            alert('user created successfully');
        }
        
    } catch (error) {
        console.log(error)
        
    }
  };

  return (
    <div className='flex flex-col md:flex-row justify-center items-center bg-slate-100 h-screen w-screen p-5'>
      <div className='flex md:w-1/2 md:h-full h-1/3 justify-center items-center w-full relative '>
  <img
    src='/images/signin.jpg'
    alt='image'
    className='absolute inset-0 w-full h-full '
  />
  <div>
  <h1 className='relative text-white font-bold text-5xl md:text-8xl'>LinkNest</h1>
  <h3 className='relative text-white font-bold'>by-Kartikeya Vats</h3>
  </div>
  
</div>

      <div className='flex flex-col  bg-white  md:w-1/2 w-full h-full  p-5 rounded-md'>
        <div className='text-center'>
        <h1 className='md:text-5xl text-3xl font-semibold'>SignUp</h1>

        </div>
        <form className='w-full  flex flex-col md:gap-2 mt-4' onSubmit={handleSubmit}>
          <div className='mb-2 flex justify-center items-center md:gap-10 gap-3'>
            <div>
            <label className='block  mb-2  font-semibold text-slate-500' htmlFor='name'>Fullname</label>
            <input className='w-full md:p-5 p-3 rounded-xl md:text-xl font-semibold  border-2 focus:outline-none' type='text' id='name' name='fullName' placeholder='Kartikeya Vats' value={formData.fullName} onChange={handleChange} required />

            </div>
            <div>
            <label className='block  mb-2  font-semibold text-slate-500' htmlFor='username'>Username</label>
            <input className='w-full p-3 md:p-5 rounded-xl border-2 md:text-xl font-semibold  focus:outline-none' placeholder='coderkartikeya' type='text' id='username' name='username' value={formData.username} onChange={handleChange} required />

            </div>
            
            
          </div>
          <div className='mb-2  md:gap-10 gap-3 md:ml-10 md:mr-10'>
            
            <label className='block  mb-2  font-semibold text-slate-500' htmlFor='email'>Email</label>
            <input className='w-full p-3 md:p-5 rounded-md md:text-xl font-semibold border-2 focus:outline-none' type='email' placeholder='abc@gmail.com' id='email' name='email' value={formData.email} onChange={handleChange} required />

            
            
          </div>
          <div className='mb-2  md:gap-10 gap-3 md:ml-10 md:mr-10'>
            <label className='block  mb-2  font-semibold text-slate-500' htmlFor='password'>Password</label>
            <input className='w-full p-3 md:p-5 rounded-md md:text-xl font-semibold border-2 focus:outline-none' type='password' placeholder='Min,8 characters' id='password' name='password' value={formData.password} onChange={handleChange} required />
          </div>
          <div className='mb-2  md:gap-10 gap-3 md:ml-10 md:mr-10'>
            <label className='block  mb-2  font-semibold text-slate-500' htmlFor='profilePic'>Profile Picture</label>
            <input className='w-full p-3 md:p-5 rounded-md md:text-xl font-semibold border-2 focus:outline-none' type='file' id='profilePic' name='profilePic' onChange={handleFileChange} required />
          </div>
          <button className=' md:ml-10 md:mr-10 bg-blue-500 text-white p-3 rounded-xl ' type='submit'>Submit</button>
        </form>
        <div className='mb-2  md:gap-10 gap-3 md:ml-10 md:mr-10 mt-4 text-center'>
            <h1 >Already have account ? <Link href='/login' className='text-sky-900'> Login</Link></h1>
        </div>
      </div>
    </div>
  );
};

export default FormComponent;
