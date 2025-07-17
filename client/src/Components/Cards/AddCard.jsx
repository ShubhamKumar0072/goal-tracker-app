import React from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';

const AddCard = ({ text = "Add New",onClick }) => (
    <Card onClick={onClick} sx={{ backgroundColor: '#e5e5e5ff', borderRadius: 2, width: 150, height: 50,}}>
        <CardActionArea
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: "space-evenly",
                alignItems: 'center'
            }}
        >
            <Box display="flex" alignItems="center" width="100%" justifyContent="space-evenly">
                <AddIcon sx={{ color: '#636363ff', fontSize: 30, mb: 1 }} />
                <Typography variant="h6" color="text.secondary" fontSize={20}>
                    {text}
                </Typography>
            </Box>
        </CardActionArea>
    </Card>
);

export default AddCard;