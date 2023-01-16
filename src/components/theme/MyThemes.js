import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";

const MyThemes = ({ myThemes }) => {
  return (
    <>
      <Container sx={{ py: 6 }}>
        <Typography
          borderBottom="2px solid rgba(144, 202, 249, 0.5)"
          gutterBottom
          variant="h4"
          component="h2"
        >
          My themes
        </Typography>
        <Grid container spacing={6}>
          {myThemes.map((theme) => {
            if (
              theme.owner_id == localStorage.getItem("user_id").slice(1, -1)
            ) {
              return (
                <Grid item key={theme.id} xs={12} sm={3} md={3}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: "#7c84b936",
                      boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;",
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          marginBottom: "15px",
                        }}
                        gutterBottom
                        variant="h5"
                        component="h2"
                      >
                        {theme.title}
                      </Typography>
                      <Typography component="p">
                        {`${theme.comment_count} comments`}
                      </Typography>
                      <Typography component="p">
                        {`${theme.like_count} likes`}
                      </Typography>
                      <Typography component="p">
                        {`${theme.dislike_count} dislikes`}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button startIcon={<Visibility />}>
                        <Link
                          style={{
                            textDecoration: "none",
                            color: "rgba(144, 202, 249, 0.5)",
                          }}
                          state={{ id: theme.id }}
                          to={`/${theme.title
                            .replace(/ /g, "_")
                            .toLowerCase()}`}
                        >
                          View
                        </Link>
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            }
          })}
        </Grid>
      </Container>
    </>
  );
};

export default MyThemes;
