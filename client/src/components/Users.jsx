import { Grid, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

const Users = ({ child }) => {

  return (
    <Link style={{textDecoration: 'none'}} to={`/admin/${child._id}`}>
    <Grid
      style={{
        backgroundColor: "#37afe2",
        margin: "10px",
        padding: "15px",
        width: "250px",
        height: "200px",
        cursor: 'pointer'
      }}
      
    >
      <Typography variant="h5" component="div" style={{ color: "#c8d9ea" }}>
        {child.username}
      </Typography>
      <br />
      <Typography variant="body2" style={{ color: "#c8d9ea" }}>
        id: {child._id}
      </Typography>
      <Typography variant="body2" style={{ color: "#c8d9ea" }}>
        role: {child.role}
      </Typography>
      <Typography variant="body2" style={{ color: "#c8d9ea" }}>
        active: {child.active+""}
      </Typography>
    </Grid>
    </Link>
  );
};

export default Users;
