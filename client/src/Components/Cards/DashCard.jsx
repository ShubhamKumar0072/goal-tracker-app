import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

export default function DashCard({title,text,img,bc, onClick}) {
  return (
    <Card onClick={onClick} sx={{ maxWidth: 550, minWidth: 300, display: "flex", borderRadius:"25px" }}>
      <CardActionArea 
        sx={{
            display: "flex",
            flexDirection :"row-reverse",
            padding: "15px",
            backgroundColor: bc,
            
        }}>
        <CardMedia
          component="img"
          image={img}
          alt="green iguana"
            sx={{
                width: {
                xs: 140, // when screen width is small (e.g., <600px)
                sm: 140, // when screen width is medium
                md: 180 // default height for wider screens
                }
            }}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" sx={{
                fontSize: {
                xs: 18, // when screen width is small (e.g., <600px)
                sm: 20, // when screen width is medium
                md: 20 // default height for wider screens
                }
            }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {text}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}