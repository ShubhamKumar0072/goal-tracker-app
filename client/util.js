import axios from "axios";
const fetchAPI = async(str)=>{
    const response = await axios.get(`http://localhost:3000${str}`);
    return(response.data.fruits);
  }

export default fetchAPI;