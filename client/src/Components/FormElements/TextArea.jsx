import "./TextArea.css"
export default function TextArea({placeholder,val,handel,name,lable,id}){
    return(
        <div className="TextArea">
            <label className="area-lab" htmlFor={id}>{lable}</label>
            <textarea 
                className="area-inp"
                name={name} 
                id={id} 
                placeholder={placeholder} 
                value={val} 
                onChange={handel}
            >
            </textarea>
        </div>
    )
}