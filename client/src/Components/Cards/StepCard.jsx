import "./StepCard.css"
export default function StepCard({num,text,bc}){
    return(
        <div className="StepCard" style={{backgroundColor: bc}}>
            <div className="step-num">
                {num}
            </div>
            <div className="step-text" style={{backgroundColor: bc}}>
                <p>{text}</p>
            </div>
        </div>
    )
}