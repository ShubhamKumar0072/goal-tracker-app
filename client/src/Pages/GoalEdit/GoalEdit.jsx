import TextBox from "../../Components/FormElements/TextBox";
import TextArea from "../../Components/FormElements/TextArea";
import Button from "@mui/material/Button";
import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function GoalEdit() {
    const navigate = useNavigate();
    const { goalId } = useParams();
    const { data, loading, error } = useFetch(`/goals/${goalId}`);

    const [formData, setFormData] = useState({
        goalName: "",
        subLine: "",
        desc: "",
    });

    // Update formData once data is fetched
    useEffect(() => {
        if (data) {
            setFormData({
                goalName: data.goalName || "",
                subLine: data.subLine || "",
                desc: data.desc || "",
            });
        }
    }, [data]);

    // Handle input changes
    function handleChange(event) {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    // Handle form submission
    async function handleSubmit(event) {
        event.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8080/goals/${goalId}`, formData);
            //console.log("Update response:", response.data);
            navigate("/one-goal", { state: { goalId: goalId } })
        } catch (err) {
            console.error("Update error:", err);
        }
    }

    // Loading and error states
    if (loading) return <h1>Loading...</h1>;
    if (error) return <h1>Error: {error.message}</h1>;

    return (
        <div className="GoalForm">
            <div className="main-form">
                <h2>Edit Data Of Goal:</h2>
                <form onSubmit={handleSubmit}>
                    <div className="goal-form-top">
                        <TextBox
                            placeholder="Running"
                            type="text"
                            lable="Goal Name"
                            val={formData.goalName}
                            handel={handleChange}
                            name="goalName"
                            id="goalName"
                            required
                        />
                        <TextBox
                            placeholder="Faster than Ever"
                            type="text"
                            lable="Sub Line"
                            val={formData.subLine}
                            handel={handleChange}
                            name="subLine"
                            id="subLine"
                            required
                        />
                    </div>
                    <TextArea
                        placeholder="Add Brief Description"
                        lable="Description"
                        val={formData.desc}
                        handel={handleChange}
                        name="desc"
                        id="desc"
                        required
                    />
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
                                borderRadius: 2,
                            }}
                        >
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}