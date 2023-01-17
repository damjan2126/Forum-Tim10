import React, { useState } from "react";
import {
  Card,
  Stack,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import theme from "../../services/themeServices";
import { Done, Edit, ThumbDown, ThumbUp } from "@mui/icons-material";

const Comment = ({
  user,
  createdAt,
  commentText,
  id,
  authorId,
  setNewCommentAdded,
  rating,
  like_count,
  dislike_count,
}) => {
  const [comment, setComment] = useState(commentText);

  const handleEditComment = ({ commentText, comment_id }) => {
    theme
      .editComment({ commentText, comment_id })
      .then(() => setNewCommentAdded((prevState) => prevState + 1));
  };

  const handleDate = (createdAt) => {
    const date = new Date(createdAt);
    return date.toDateString();
  };
  

  const [editComment, setEditComment] = useState(false);

  const handleCommentEditButton = () => {
    setEditComment(true);
  };

  const handleLikeThumbDisable = () => {
    if (rating == true) {
      return "secondary";
    } else if (rating == false) {
      return "primary";
    } else if (rating == null) {
      return "primary";
    }
  };

  const handleDislikeThumbDisable = () => {
    if (rating == true) {
      return "primary";
    } else if (rating == false) {
      return "secondary";
    } else if (rating == null) {
      return "primary";
    }
  };

  const rateComment = (rating) => {
    theme.rateComment({ rating: rating, comment_id: id }).then((r) => {
      setNewCommentAdded((prevState) => prevState + 1);
    });
  };
  const [commentId, setCommentId] = useState();

  return authorId == localStorage.getItem("user_id").slice(1, -1) ? (
    <Card sx={{ margin: 4 }}>
      <Box sx={{ padding: 2 }}>
        <Stack spacing={2} direction="row">
          <Box sx={{ width: "100%" }}>
            <Stack
              spacing={2}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack spacing={2} direction="row" alignItems="center">
                <Typography sx={{ color: "neutral.grayishBlue" }}>
                  {handleDate(createdAt)}
                </Typography>
                <Typography
                  fontWeight="bold"
                  sx={{ color: "neutral.darkBlue" }}
                >
                  {`${user.firstName} ${user.lastName} :`}
                </Typography>
              </Stack>
              <Stack direction="row">
                <Stack direction="row">
                  <Button disabled startIcon={<ThumbUp />}>
                    {like_count}
                  </Button>
                  <Button disabled startIcon={<ThumbDown />}>
                    {dislike_count}
                  </Button>
                </Stack>
                <Button
                  onClick={() => {
                    handleCommentEditButton();
                    setCommentId(id);
                  }}
                  startIcon={<Edit />}
                />
              </Stack>
            </Stack>
            {editComment && commentId == id ? (
              <Stack direction="row" spacing={2} alignItems="flex-end">
                <TextField
                  multiline
                  fullWidth
                  minRows={3}
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                />
                <Button
                  startIcon={
                    <Done
                      onClick={() => {
                        handleEditComment({
                          commentText: comment,
                          comment_id: id,
                        });
                        setEditComment(false);
                      }}
                    />
                  }
                />
              </Stack>
            ) : (
              <Typography sx={{ color: "neutral.grayishBlue", p: "20px 0" }}>
                {commentText}
              </Typography>
            )}
          </Box>
        </Stack>
      </Box>
    </Card>
  ) : (
    <Card sx={{ margin: 4 }}>
      <Box sx={{ padding: 2 }}>
        <Stack spacing={2} direction="row">
          <Box sx={{ width: "100%" }}>
            <Stack
              spacing={2}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack spacing={2} direction="row" alignItems="center">
                <Typography sx={{ color: "neutral.grayishBlue" }}>
                  {handleDate(createdAt)}
                </Typography>
                <Typography
                  fontWeight="bold"
                  sx={{ color: "neutral.darkBlue" }}
                >
                  {`${user.firstName} ${user.lastName} :`}
                </Typography>
              </Stack>
              <Stack direction="row">
                <Button
                  color={handleLikeThumbDisable()}
                  onClick={() => {
                    rateComment(true);
                  }}
                  startIcon={<ThumbUp />}
                >
                  {like_count}
                </Button>
                <Button
                  color={handleDislikeThumbDisable()}
                  onClick={() => {
                    rateComment(false);
                  }}
                  startIcon={<ThumbDown />}
                >
                  {dislike_count}
                </Button>
              </Stack>
            </Stack>
            <Typography sx={{ color: "neutral.grayishBlue", p: "20px 0" }}>
              {commentText}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Card>
  );
};
export default Comment;
