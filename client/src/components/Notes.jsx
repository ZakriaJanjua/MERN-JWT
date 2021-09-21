import { Grid, Typography } from "@material-ui/core";

const Notes = ({ note }) => {
  return (
    <Grid
      style={{
        backgroundColor: "#37afe2",
        margin: "10px",
        padding: "15px",
        width: "250px",
        height: "200px",
      }}
      
    >
      <Typography variant="h5" component="div" style={{ color: "#c8d9ea" }}>
        {note.title}
      </Typography>
      <br />
      <Typography variant="body2" style={{ color: "#c8d9ea" }}>
        {note.note}
      </Typography>
    </Grid>
  );
};

export default Notes;
