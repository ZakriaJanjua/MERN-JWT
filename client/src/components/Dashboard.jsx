import { Button, Typography } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { TextField, Box, Container, Grid } from "@material-ui/core";
import Notes from "./Notes";
import Users from "./Users";
import file from "../assets/Infinity.svg";

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", note: "" });
  const [notes, setNotes] = useState([]);
  const [isAdmin, setAdmin] = useState();
  const [showUsers, setShowUsers] = useState(false);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUsers = () => {
    axios
      .get("http://localhost:5000/api/v1/users", {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((res) => {
        setChildren(res.data);
        setShowUsers(true);
        console.log(children);
      });
  };

  const mounted = () => {
    axios
      .get("http://localhost:5000/", {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((res) => {
        if (res.data.user) {
          setUser(res.data.user);
          setAdmin(res.data.user.role === "admin");
          getNotes();
        } else {
          logout();
        }
      });
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload(false);
  };

  const addNote = () => {
    axios
      .post("http://localhost:5000/api/v1/notes/", newNote, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((res) => {
        setNewNote({ title: "", note: "" });
        setShowForm(false);
        window.location.reload(false);
      });
  };

  const getNotes = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/v1/notes", {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((res) => {
        setLoading(false);
        setNotes(res.data);
      });
  };

  useEffect(() => {
    mounted();
  }, []);

  return (
    <React.Fragment>
      <Typography component="h1" variant="h2" style={{ color: "#c8d9ea" }}>
        Dashboard {user.username}
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        style={{
          backgroundColor: "#dfd8cb",
          color: "#37afe2",
        }}
        onClick={() => logout()}
      >
        Logout
      </Button>

      {!isAdmin ? (
        <Button
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          style={{
            backgroundColor: "#dfd8cb",
            color: "#37afe2",
            float: "right",
          }}
          onClick={() => setShowForm(!showForm)}
        >
          Toggle Form
        </Button>
      ) : (
        <Button
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          style={{
            backgroundColor: "#dfd8cb",
            color: "#37afe2",
            float: "right",
          }}
          onClick={getUsers}
        >
          Show users
        </Button>
      )}

      {showUsers && (
        <Grid container style={{ marginTop: "3%" }}>
          {children.map((child, i) => (
            <Users key={i} child={child} />
          ))}
        </Grid>
      )}

      {showForm && (
        <Container component="main" maxWidth="xs" style={{ marginTop: "5%" }}>
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                fullWidth
                label="Title"
                autoFocus
                value={newNote.title}
                onChange={(e) =>
                  setNewNote({ ...newNote, title: e.target.value })
                }
              />
              <TextField
                id="standard-multiline-static"
                label="Note"
                multiline
                margin="normal"
                fullWidth
                rows={4}
                variant="standard"
                value={newNote.note}
                onChange={(e) =>
                  setNewNote({ ...newNote, note: e.target.value })
                }
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                style={{
                  backgroundColor: "#dfd8cb",
                  color: "#37afe2",
                  marginTop: "7%",
                }}
                onClick={addNote}
              >
                Add Note
              </Button>
            </Box>
          </Box>
        </Container>
      )}
      {loading ? (
        <img
          src={file}
          alt="loader"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "43%",
            marginTop: "7%",
          }}
        />
      ) : (
        <Grid container style={{ marginTop: "3%" }}>
          {notes.map((note, i) => (
            <Notes key={i} note={note} />
          ))}
        </Grid>
      )}
    </React.Fragment>
  );
};

export default Dashboard;
