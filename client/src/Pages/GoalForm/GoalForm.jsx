import DayPicker from "../../Components/FormElements/DayPicker"
import MySlider from "../../Components/FormElements/MySlider"
import TextArea from "../../Components/FormElements/TextArea"
import TextBox from "../../Components/FormElements/TextBox"
import Button from '@mui/material/Button';
import "./GoalForm.css"
import { useState } from "react";
export default function GoalForm() {

  let [formData,setFormData] = useState({
    goalName:"",
    subLine:"",
    desc:"",
    diff:5,
    totalDays:"",
    strDate:""
  });

  function handel(event){
    let key = event.target.name;
    let val = event.target.value;
    setFormData((currData)=>{
      if(key=="diff"){
        currData[key] = Number(val);
      }else{
        currData[key] = val;
      }
      return {...currData};
    });
  }
  
  return (
    <div className="GoalForm">
      <div className="main-form">
        <h2>Create Your Gole</h2>
        <form action="">
          <div className="goal-form-top">
            <TextBox placeholder="Running" type="text" lable="Goal Name" val={formData.goalName} handel={handel}  name="goalName" id="goalName" />
            <TextBox placeholder="Faster then Ever" type="text" lable="Sub Line" val={formData.subLine} handel={handel} name="subLine" id="subLine" />
          </div>
          <TextArea placeholder="Add Brief Description" lable="Description" val={formData.desc} handel={handel} name="desc" id = "desc" />
          <MySlider lable="Difficulty Level" name="diff" val={formData.diff} id="diff" handel={handel} />
          <div className="goal-form-time">
            <TextBox placeholder="30" type="number" lable="Total Days" val={formData.totalDays} handel={handel} id="totalDays" name="totalDays" />
            <TextBox type="date" lable="Starting Day" val={formData.strDate} handel={handel} name="strDate" id ="strDate" />
          </div>
          <p style={{ fontSize: "23px", marginLeft: "1rem" }}>Select Working Days</p>
          <DayPicker />
          <div style={{display:"flex",justifyContent:"center"}}>
          <Button
            variant="contained"
            sx={{
              margin:"1rem",
              display: "flex",
              alignItems: "center",
              backgroundColor: "#1C2A3A",
              width: 100,
              height: 40,
              fontSize: 15,
              borderRadius: 2
            }}
          >
            Subbmit
          </Button>
          </div>
        </form>
      </div>
    </div>
  )
}