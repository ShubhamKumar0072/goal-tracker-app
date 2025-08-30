import DayPicker from "../../Components/FormElements/DayPicker"
import MySlider from "../../Components/FormElements/MySlider"
import TextArea from "../../Components/FormElements/TextArea"
import TextBox from "../../Components/FormElements/TextBox"
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./GoalForm.css";
import { useState } from "react";

export default function GoalForm() {

  const navigate = useNavigate();


  async function handleSubmit(e) {
    e.preventDefault();

    // Validation: Start date must be in the future
    const today = new Date();
    const chosenStartDate = new Date(formData.startDate);
    if (chosenStartDate <= today) {
      alert("Start date must be later than today.");
      return;
    }

    //Days should be selected
    if (formData.days.length === 0) {
      alert("Please select at least one working day.");
      return;
    }
    const processedData = {
      ...formData,
      totalDays: Number(formData.totalDays),
      startDate: new Date(formData.startDate),
      isComplete: false
    };

    //console.log("Processed data:", processedData);

    try {
      const response = await axios.post("http://localhost:8080/goals", processedData, { withCredentials: true });
      console.log("Success:", response.data);
      navigate("/goals");
    } catch (err) {
      if (err.response?.status === 401) {
        window.location.href = err.response.data.redirect;
      }
      console.error("Error submitting goal:", err);
    }
  }

  let [formData, setFormData] = useState({
    goalName: "",
    subLine: "",
    desc: "",
    diff: 5,
    totalDays: "",
    startDate: "",
    days: []
  });

  function handel(event) {
    let key = event.target.name;
    let val = event.target.value;
    setFormData((currData) => {
      if (key == "diff") {
        currData[key] = Number(val);
      } else {
        currData[key] = val;
      }
      return { ...currData };
    });
  }

  function handleDays(selectedDays) {
    setFormData(curr => ({
      ...curr,
      days: selectedDays
    }));
  }

  return (
    <div className="GoalForm">
      <div className="main-form">
        <h2>Create Your Goal</h2>
        <form action="" onSubmit={handleSubmit}>
          <div className="goal-form-top">
            <TextBox placeholder="Running" type="text" lable="Goal Name" val={formData.goalName} handel={handel} name="goalName" id="goalName" required />
            <TextBox placeholder="Faster then Ever" type="text" lable="Sub Line" val={formData.subLine} handel={handel} name="subLine" id="subLine" required />
          </div>
          <TextArea placeholder="Add Brief Description" lable="Description" val={formData.desc} handel={handel} name="desc" id="desc" required />
          <MySlider lable="Difficulty Level" name="diff" val={formData.diff} id="diff" handel={handel} required />
          <div className="goal-form-time">
            <TextBox placeholder="30" type="number" lable="Total Days" val={formData.totalDays} handel={handel} id="totalDays" name="totalDays" required />
            <TextBox type="date" lable="Starting Day" val={formData.startDate} handel={handel} name="startDate" id="startDate" required />
          </div>
          <p style={{ fontSize: "23px", marginLeft: "1rem" }}>Select Working Days</p>
          <DayPicker onSelectDays={handleDays} />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              type="submit"
              sx={{
                margin: "1rem",
                display: "flex",
                alignItems: "center",
                backgroundColor: "#1C2A3A",
                width: 100,
                height: 40,
                fontSize: 15,
                borderRadius: 2
              }}
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}