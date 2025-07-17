import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import TinyBarChart from './TinyBarChart';

export default function GoalCard({title,text,img,bc, onClick}) {
  return (
    <Card onClick={onClick} sx={{ 
      width:{
        xs:350,
        md:400
      }, 
      height:130, 
      display: "flex", 
      borderRadius:2 
    }}>
      <CardActionArea 
        sx={{
            display: "flex",
            flexDirection :"row-reverse",
            padding: "15px",
            backgroundColor: bc,
            justifyContent:"space-evenly"
        }}>

        <div>
            <TinyBarChart/>
        </div>

        <CardContent>
          <Typography gutterBottom variant="h6" component="div" sx={{
                fontSize: {
                xs: 18, // when screen width is small (e.g., <600px)
                sm: 20, // when screen width is medium
                md: 22 // default height for wider screens
                },
                fontWeight:500
            }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ 
            color: 'text.secondary',
            fontSize: {
                xs: 12, // when screen width is small (e.g., <600px)
                sm: 15, // when screen width is medium
                md: 15 // default height for wider screens
                }
          }}>
            {text}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}