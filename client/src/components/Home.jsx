import { Container, Button } from "@material-ui/core";
import { Link } from "react-router-dom";

function Home() {
  return (
    <Container
      maxWidth="md"
      style={{
        backgroundColor: "#37afe2",
        color: "#c8d9ea",
        fontFamily: "Roboto",
        marginTop: "30px",
      }}
    >
      <br />
      <h1>Authentication implemented in MERN Stack</h1>
      <br />
      <br />
      <p>To go to the Signup page click below</p>
      <Link to="/signup" style={{ textDecoration: "none" }}>
        <Button style={{ backgroundColor: "#dfd8cb", color: "#1b92d1" }}>
          Sign Up
        </Button>
      </Link>
      <br />
      <br />
    </Container>
  );
}

export default Home;
