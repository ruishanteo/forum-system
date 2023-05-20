import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";

import Likes from "../utils/Likes.js";
import Comments from "../utils/Comments.js";

import CreateIcon from "@mui/icons-material/Create";

const Home = () => {
  const [thread, setThread] = useState("");
  const [title, setTitle] = useState("");
  const [threadList, setThreadList] = useState([]);
  const navigate = useNavigate();

  const createThread = () => {
    fetch("http://localhost:4000/api/create/thread", {
      method: "POST",
      body: JSON.stringify({
        title,
        thread,
        userId: localStorage.getItem("_id"),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        window.location.reload();
      })
      .catch((err) => console.error(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTitle("");
    setThread("");
    createThread();
  };

  useEffect(() => {
    const checkUser = () => {
      if (!localStorage.getItem("_id")) {
        navigate("/");
      }
    };
    checkUser();
  }, [navigate]);

  useEffect(() => {
    const checkUser = () => {
      if (!localStorage.getItem("_id")) {
        navigate("/");
      } else {
        fetch("http://localhost:4000/api/all/threads")
          .then((res) => res.json())
          .then((data) => setThreadList(data.threads))
          .catch((err) => console.error(err));
      }
    };
    checkUser();
  }, [navigate]);

  return (
    <Box className="home" align="center">
      <Typography variant="h2" sx={{ mt: 2, mb: 2 }}>
        Welcome
      </Typography>

      <Box display="flex" flexDirection="column" maxWidth="50vw">
        <Box align="left" sx={{ mt: 2 }}>
          <Typography sx={{ mb: 2 }}>
            Write something! <CreateIcon />
          </Typography>
        </Box>
        <TextField
          type="text"
          name="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title here."
        />
        <TextField
          type="text"
          name="thread"
          required
          value={thread}
          onChange={(e) => setThread(e.target.value)}
          placeholder="Enter text here."
          sx={{ mt: 2 }}
          multiline
          rows={5}
        />
        <Button
          variant="contained"
          sx={{ mt: 5, mb: 5 }}
          onClick={handleSubmit}
        >
          SUBMIT
        </Button>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h2">Posts</Typography>
        <Box sx={{ mx: 2, px: 20 }}>
          <List>
            {threadList.map((thread) => (
              <Box key={thread.threadId}>
                <Grid container spacing={3} sx={{ mt: 4 }}>
                  <ListItem>
                    <Grid item xs={8}>
                      <Typography variant={"h5"}>{thread.title}</Typography>
                      <Typography variant={"body1"}>{thread.text}</Typography>
                    </Grid>
                    <Grid item xs>
                      <Box align="right" mr={10}>
                        <Box
                          className="react__container"
                          maxWidth="5vw"
                          display="flex"
                          flexDirection="row"
                        >
                          <Likes
                            numberOfLikes={thread.likesCount}
                            threadId={thread.threadId}
                          />

                          <Comments
                            numberOfComments={thread.repliesCount}
                            threadId={thread.threadId}
                            title={thread.title}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  </ListItem>
                </Grid>
                <Divider />
              </Box>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
