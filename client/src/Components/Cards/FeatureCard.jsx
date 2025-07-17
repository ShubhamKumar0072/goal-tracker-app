import "./FeatureCard.css"
export function FeatureCard({tital,desc,img,rev=true}){
    return(
        <div className="FeatureCard" style={{ flexDirection: rev ? "row-reverse" : "row"}} >
            <div className="feture-text">
                <h1>{tital}</h1>
                <p>{desc}</p>
            </div>
            <div className="feture-image">
                <img height="300px" className="feture-img" src={img} alt="image"/>
            </div>
        </div>
    )
}