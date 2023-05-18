import React from "react";

import { Box, Button } from "@mui/material";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";

const Likes = ({ numberOfLikes, threadId }) => {
  const handleLikeFunction = () => {
    fetch("http://localhost:4000/api/thread/like", {
      method: "POST",
      body: JSON.stringify({
        threadId,
        userId: localStorage.getItem("_id"),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error_message) {
          alert(data.error_message);
        } else {
          alert(data.message);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <Box className="likes__container">
      <Button onClick={handleLikeFunction}>
        <ThumbUpIcon />
      </Button>

      <p style={{ color: "#434242" }}>
        {numberOfLikes === 0 ? "" : numberOfLikes}
      </p>
    </Box>
  );
};

export default Likes;
