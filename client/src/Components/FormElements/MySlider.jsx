import "./MySlider.css"
export default function MySlider({val,handel,name,id,lable,required}){
    return(
        <div className="MySlider">
            <label className="box-lab" htmlFor={id}>{lable}</label>
            <input 
                min={1}
                max={10}
                className="slid-inp"
                type="range"
                value={val}
                onChange={handel}
                id={id}
                name={name}
                required = {required}
            />
        </div>
    )
}


// import React, { useState } from "react";

// export default function MySlider() {
//   const [value, setValue] = useState(5);

//   return (
//     <div style={{ width: "100%", margin: "1rem 0" }}>
//       <label htmlFor="difficulty-slider" style={{ display: "block", marginBottom: 8 }}>
//         Difficulty Level
//       </label>
//       <input
//         id="difficulty-slider"
//         type="range"
//         min={1}
//         max={10}
//         value={value}
//         onChange={e => setValue(Number(e.target.value))}
//         style={{ width: "100%" }}
//       />
//       <span style={{ marginLeft: 12 }}>{value}</span>
//     </div>
//   );
// }