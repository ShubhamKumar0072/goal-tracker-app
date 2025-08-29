import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import TinyBarChart from './TinyBarChart';
import useFetch from '../../hooks/useFetch';

export default function GoalCard({ goalId, title, text, img, bc, onClick }) {

  const { data, loading, error } = useFetch(`/goals/${goalId}/piechart`);
  if (loading) return (<h1>Looding ....</h1>);
  if (error) return (<h1>Error : {error.message} </h1>);
  console.log(data);

  // Mapping of old names to new names
  const nameMap = {
    "Completed": "Work Days",
    "Rest Days": "Rest Days",
    "Fail to Complete": "Fail"
  };

  // Transform the array
  const Newdata = data.map(item => ({
    name: nameMap[item.name] || item.name,
    value: item.value
  }));



  return (
    <Card onClick={onClick} sx={{
      width: {
        xs: 350,
        md: 400
      },
      display: "flex",
      borderRadius: 2
    }}>
      <CardActionArea
        sx={{
          display: "flex",
          flexDirection: "row-reverse",
          padding: {
            xs: "5px",
            md: "5px"
          },
          backgroundColor: bc,
          justifyContent: "space-evenly"
        }}>

        <div>
          <TinyBarChart data={Newdata} />
        </div>

        <CardContent>
          <Typography gutterBottom variant="h6" component="div" sx={{
            fontSize: {
              xs: 15, // when screen width is small (e.g., <600px)
              sm: 17, // when screen width is medium
              md: 18 // default height for wider screens
            },
            fontWeight: 500
          }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{
            color: 'text.secondary',
            fontSize: {
              xs: 10, // when screen width is small (e.g., <600px)
              sm: 12, // when screen width is medium
              md: 12 // default height for wider screens
            }
          }}>
            {text}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}