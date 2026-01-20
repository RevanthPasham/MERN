import React from "react"
import {useState,useEffect} from 'react'
import {getCollections} from "../services/CollectionServices"

const Collectios=()=>
{
 
    const [collectionsData,setCollectiosData]=useState([])
    useEffect((res)=>
    {
        getCollections()
       .then((data)=>
    {
        console.log(data)
        setCollectionsData(data)
    })
    .catch(err=>console.log(err))
    },[]);

    return(
         <div>
            <p> Shop By Collection</p>
            {collectionsData.map((item)=>
            (
               <CollectionsCard  key={item._id}  imageUrl={item.imageUrl} name={item.name}/>
            )
            
            )}

         </div>
    )


}

export default Collectios