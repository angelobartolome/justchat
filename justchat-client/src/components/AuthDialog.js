import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import { DialogContent, TextField, Grid } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  submit: {
    marginTop: 16,
  },
  form: {
    margin: 16,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

function SignIn({ onAuthenticated }) {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  function doSignIn() {
    setIsSigningIn(true);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    var requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ email, password }),
      redirect: "follow",
    };

    fetch("http://localhost:3000/auth", requestOptions)
      .then((c) => c.json())
      .then((c) => {
        if (c.token) {
          onAuthenticated(c.token);
        }

        setIsSigningIn(false);
      })
      .catch(() => {
        alert("Error, please check your credentials");
        setIsSigningIn(false);
      });
  }

  return (
    <div className={classes.paper}>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <form className={classes.form} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="password"
              value={password}
              label="Password"
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              id="password"
              autoComplete="current-password"
            />
          </Grid>
        </Grid>
        <Button
          onClick={doSignIn}
          fullWidth
          variant="contained"
          color="secondary"
          className={classes.submit}
          disabled={isSigningIn}
        >
          Sign In
        </Button>
      </form>
    </div>
  );
}

export function AuthDialog({ onAuthenticated, token }) {
  const classes = useStyles();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  useEffect(() => {
    if (token && !isAuthenticated) setIsAuthenticated(true);
    if (!token && isAuthenticated) setIsAuthenticated(false);
  }, [token]);

  return (
    <Dialog open={!isAuthenticated} maxWidth="lg">
      <DialogContent>
        <Grid container spacing={3} xl>
          <Grid item xs={6}>
            <div className={classes.paper}>
              <Typography component="h1" variant="h5">
                Sign up
              </Typography>
              <form className={classes.form} noValidate>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      name="name"
                      variant="outlined"
                      required
                      fullWidth
                      id="name"
                      label="Your name"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={isSigningUp}
                >
                  Sign Up
                </Button>
              </form>
            </div>
          </Grid>
          <Grid item xs={6}>
            <SignIn
              onAuthenticated={(token) => {
                setIsAuthenticated(true);
                onAuthenticated(token);
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
