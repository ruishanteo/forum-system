import React from "react";
import { useNavigate } from "react-router-dom";

import { Box, Button } from "@mui/material";

import CommentIcon from "@mui/icons-material/Comment";

const Comments = ({ numberOfComments, threadId }) => {
  const navigate = useNavigate();

  const handleAddComment = () => {
    navigate(`/${threadId}/replies`);
  };

  return (
    <Box key={threadId}>
      <Button onClick={handleAddComment}>
        <CommentIcon />
      </Button>
      <p style={{ color: "#434242" }}>
        {numberOfComments === 0 ? "" : numberOfComments}
      </p>
    </Box>
  );
};

export default Comments;
