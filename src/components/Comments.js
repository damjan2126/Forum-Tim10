import React, { useEffect, useState } from "react";
import {
  Card,
  Stack,
  Typography,
  Avatar,
  Button,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import theme from "../services/themeServices";

const Comments = ({ theme_id }) => {
  const [commentText, setCommentText] = useState("");
  const addComment = () => {
    theme.addComment({ theme_id, commentText }).then((r) => console.log(r));
  };

  const [themePage, setThemePage] = useState();
  useEffect(() => {
    theme.getTheme({ theme_id }).then(({ data }) => setThemePage(data));
  }, [addComment]);

  return (
    <>
      <>
        {themePage &&
          themePage.comments.map(({ user, createdAt, commentText }) => (
            <Card>
              <Box sx={{ p: "5px" }}>
                <Stack spacing={2} direction="row">
                  <Box sx={{ width: "70%" }}>
                    <Stack
                      spacing={2}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Stack spacing={2} direction="row" alignItems="center">
                        {/* <Avatar src={ava}></Avatar> */}
                        <Typography
                          fontWeight="bold"
                          sx={{ color: "neutral.darkBlue" }}
                        >
                          {user.email}
                          {/* </Typography>
               {userName === "juliusomo" && <YouTag />}
               <Typography sx={{ color: "neutral.grayishBlue" }}> */}
                          {createdAt}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Typography
                      sx={{ color: "neutral.grayishBlue", p: "20px 0" }}
                    >
                      {commentText}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Card>
          ))}
      </>
      <>
        <Card>
          <Box sx={{ p: "15px" }}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Avatar
                // src={IMGOBJ.juliusomo}
                variant="rounded"
                alt="user-avatar"
              />
              <TextField
                multiline
                fullWidth
                minRows={4}
                id="outlined-multilined"
                placeholder="Add a comment"
                value={commentText}
                onChange={(e) => {
                  setCommentText(e.target.value);
                }}
              />
              <Button
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
                  setCommentText("");
                }}
              >
                Send
              </Button>
            </Stack>
          </Box>
        </Card>
      </>
    </>
  );
};
export default Comments;
