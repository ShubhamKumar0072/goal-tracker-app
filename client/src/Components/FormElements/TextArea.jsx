import "./TextArea.css"
export default function TextArea({placeholder,val,handel,name,lable,id,required}){
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
                required = {required}
            >
            </textarea>
        </div>
    )
}