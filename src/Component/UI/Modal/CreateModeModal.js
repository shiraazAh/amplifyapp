import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  button: {
    marginTop: '10px',
    marginLeft: '10px'
  },
  modal : {
    margin: 'auto',
  }
}));

const SimpleModal = (props) => {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <Typography variant="h4" gutterBottom>
        Create Lesson Plan
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Please type the Title of you Lesson plan below
      </Typography>
      <form className={classes.root} noValidate autoComplete="off">
        <TextField id="outlined-basic" label="Lesson Plan" variant="outlined" onChange={props.changed} required/>
      </form>
      <Typography variant="body2" color="error"> 
      (You can change it later as well)
      </Typography>
      <div>
        <Button variant="contained" color="primary" className={classes.button} onClick={props.clicked}>Continue</Button>
        <Button variant="contained" color="secondary" className={classes.button}>Cancel</Button>
      </div>
    </div>
  );

  return (
    <div>
      <Modal
        open={props.open}
        onClose={props.clicked}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}

export default SimpleModal;