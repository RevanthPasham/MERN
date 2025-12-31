import react from 'react'
import Images from '../../assets/images.js'

import { IoSearchOutline } from "react-icons/io5";
import { IoPersonOutline,IoBagOutline  } from "react-icons/io5";


const Navbar=()=>
{
    return (
        <div  className=" h-[50px]  flex justify-between  md:mx-[50px]  mx-[10px] "> 
           <div className='flex items-center gap-[10px] '>
               <div className=" "> 
                <img src={Images.desktopHero} className="h-[25px]  w-[60px] rounded-2xl pl-[10px]" />
                </div>
               <p>Shop All</p>
               <p>Contact Us</p>
                
            
           </div>
           <div className='flex items-center gap-[10px]'>
               <div><IoSearchOutline /></div>
               <div> <IoPersonOutline /></div>
               <div> <IoBagOutline /></div>
           </div>
        </div>
    )
}

export default Navbar