import "./TextBox.css"
export default function TextBox({type,placeholder,val,handel,id,lable,name}){
    return(
        <div className="TextBox">
            <label className="box-lab" htmlFor={id}>{lable}</label>
            <input 
                className="box-inp"
                type={type} 
                placeholder={placeholder}
                value={val}
                onChange={handel}
                id={id}
                name={name}
            />
        </div>
    )
}