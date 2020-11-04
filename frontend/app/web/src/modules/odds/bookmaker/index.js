import React from 'react'


export default function Bookmaker({src}) {
    return(
        <img src={src} style={{
            height: '24px', 
            width: '78px'
            
        }} alt={src}></img>
    )
}