import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Box, Button, TextField, Typography } from "@mui/material";

const Replies = () => {
  const [replyList, setReplyList] = useState([]);
  const [reply, setReply] = useState("");
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchReplies = () => {
      fetch("http://localhost:4000/api/thread/replies", {
        method: "POST",
        body: JSON.stringify({
          id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setReplyList(data.replies);
          setTitle(data.title);
          setName(data.name);
        })
        .catch((err) => console.error(err));
    };
    fetchReplies();
  }, [id]);

  const addReply = () => {
    fetch("http://localhost:4000/api/create/reply", {
      method: "POST",
      body: JSON.stringify({
        id,
        userId: localStorage.getItem("_id"),
        reply,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        navigate("/dashboard");
      })
      .catch((err) => console.error(err));
  };

  const handleSubmitReply = (e) => {
    e.preventDefault();
    addReply();
    setReply("");
  };

  return (
    <Box align="center">
      <Typography sx={{ mt: 5 }}>{title}</Typography>

      <Box display="flex" flexDirection="column" maxWidth="50vw">
        <TextField
          rows={5}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          type="text"
          name="reply"
          className="modalInput"
          placeholder="Enter your reply"
          sx={{ mt: 2 }}
        />

        <Button variant="contained" onClick={handleSubmitReply} sx={{ mt: 5 }}>
          SEND
        </Button>
      </Box>

      <Box>
        {replyList.map((reply) => (
          <Box key={reply.replyId}>
            <p>{reply.text}</p>
            <div className="react__container">
              <p style={{ opacity: "0.5" }}>by {reply.name}</p>
            </div>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Replies;
