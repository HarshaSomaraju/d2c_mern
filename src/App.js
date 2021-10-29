import './App.css';
import React, {useState, useEffect} from 'react'
import axios from 'axios';
import {Box, Button, Container, Divider, FormControl, Grid, Paper, Typography} from "@mui/material";
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    minWidth: theme.spacing(2),
    minHeight: theme.spacing(2),
    marginBottom: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function App() {
  const [seats, setSeats] = useState("");
    const [num, setNum] = useState();
    const [err, setErr] = useState(false);
    const [booked, setBooked] = useState("");
    const handleSave = () => {
        setBooked("");
        setErr(false);
        if(num<1 || num>7){
            setErr(true);
            return;
        }
      axios
          .post("/api/seat/",{
              num: num
          })
          .then((res)=>{
              if(res.data === -1)
                  setErr(true);
              else
                  setBooked(res.data);
          })
          .catch((err) => console.log(err));
  }
  useEffect(() => {
    axios
        .get("/api/seat/")
        .then((ses) => setSeats(ses.data[0].allseats))
        // .then((ses) => console.log(ses.data[0].allseats))
        .catch((err) => console.log(err));
  }, [booked]);
  return (
      <Container maxWidth="sm">
        <Typography variant="h2" gutterBottom component="div">Seats</Typography>
          <Grid container spacing={6}>
              <Grid item xs={0.5}><Item style={{backgroundColor: 'red'}}></Item></Grid>
              <Grid item xs><Typography>Booked</Typography></Grid>
              <Grid item xs={0.5}><Item style={{backgroundColor: 'green'}}></Item></Grid>
              <Grid item xs><Typography>Available</Typography></Grid>
          </Grid>
          <Divider style={{marginBottom: '10px'}}/>
          <Grid container>
              <Grid item xs={8}>
                  <Box >
                      { seats &&
                      seats.map((seati, i) => (
                          <Grid container spacing={2} columns={seati.length}>
                              {
                                  seati.map((seatj, j) => (
                                      <Grid item xs="auto">
                                          <Item style={{
                                              backgroundColor: seatj ? 'red' : 'green'
                                          }}>{(i)*7+(j+1)}</Item>
                                      </Grid>
                                  ))
                              }
                          </Grid>
                      ))
                      }
                  </Box>
              </Grid>
              <Grid item xs>
                  <FormControl  >
                      <TextField label="No of seats" color="secondary" focused
                        value={num}
                        onChange={e=>setNum(e.target.value)}
                      />
                      <Button
                          style = {{marginTop: '10px'}}
                          onClick={handleSave}
                          type="submit"
                          variant="contained"
                      >
                          Book
                      </Button>
                  </FormControl><br/><br/>
                  { booked &&
                      <Typography>Seats booked are<br/>
                          {
                              booked.map((num, idx)=>{
                                  return <>{num}{idx === booked.length-1 ? '': ','}</>
                              })
                          }
                      </Typography>
                  }
                  { err &&
                  <Typography>Cannot book</Typography>
                  }
              </Grid>
          </Grid>

      </Container>
  );
}

export default App;
