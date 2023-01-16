import React, { useEffect, useState } from "react";
import { Card, Stack, Typography, Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import theme from "../../services/themeServices";
import { Send } from "@mui/icons-material";
import Comment from "./Comment";

const Comments = ({ theme_id, opened }) => {
  const [newCommentText, setNewCommentText] = useState("");

  const [toggle, setToggle] = useState();

  const [newCommentAdded, setNewCommentAdded] = useState(0);
  const addComment = () => {
    theme
      .addComment({ theme_id, commentText: newCommentText })
      .then(() => setNewCommentAdded((prevState) => prevState + 1));
  };

  const [themePage, setThemePage] = useState();
  useEffect(() => {
    theme.getTheme({ theme_id }).then(({ data }) => setThemePage(data));
  }, [newCommentAdded, toggle]);

  return (
    <>
      <>
        <Typography marginLeft="30px" variant="h6" component="h6">
          Comments:
        </Typography>
        {themePage &&
          themePage.comments.map(
            ({
              user,
              createdAt,
              commentText,
              id,
              authorId,
              rating,
              like_count,
              dislike_count,
              toggle,
              setToggle,
            }) => (
              <Comment
                key={id}
                user={user}
                createdAt={createdAt}
                commentText={commentText}
                id={id}
                authorId={authorId}
                setNewCommentAdded={setNewCommentAdded}
                rating={rating}
                like_count={like_count}
                dislike_count={dislike_count}
                toggle={rating}
                setToggle={setToggle}
              />
            )
          )}
      </>
      <>
        {opened && (
          <Card>
            <Box sx={{ p: "15px" }}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <TextField
                  multiline
                  fullWidth
                  minRows={4}
                  id="outlined-multilined"
                  placeholder="Add a comment"
                  value={newCommentText}
                  onChange={(e) => {
                    setNewCommentText(e.target.value);
                  }}
                />
                <Button
                  startIcon={<Send />}
                  size="large"
                  sx={{
                    bgcolor: "custom.moderateBlue",
                    color: "neutral.white",
                    p: "8px 25px",
                    "&:hover": {
                      bgcolor: "custom.lightGrayishBlue",
                    },
                  }}
                  onClick={() => {
                    addComment();
                    setNewCommentText("");
                  }}
                ></Button>
              </Stack>
            </Box>
          </Card>
        )}
      </>
    </>
  );
};
export default Comments;
