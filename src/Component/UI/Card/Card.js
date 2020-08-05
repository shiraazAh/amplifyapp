import React from 'react';
import { makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import image from '../../../assets/Pink-tower.jpg'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: '600px',
    marginBottom: '10px',
    background: 'rgb(255, 199, 175)',
    border: 'solid 2px #ec936d'
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
    color: '#333847'
  },
  cover: {
    width: 300,
  },
  align: {
    alignItems: 'unset',
    display: 'inline-flex'
  }
}));

export default function MediaControlCard() {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea className={classes.align}>    
        <CardMedia
            className={classes.cover}
            image={image}
            title="Live from space album cover"
        />
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h5" variant="h5">
            Pink Tower
          </Typography>
          <Typography variant="subtitle1" >
          Series of 10 wooden, from 1 cubic centimetre to 1000 cubic centimetres. The activity requires the child to stack the cubes in the order of size.
          </Typography>
        </CardContent>
      </div>
      </CardActionArea>
    </Card>
  );
}
