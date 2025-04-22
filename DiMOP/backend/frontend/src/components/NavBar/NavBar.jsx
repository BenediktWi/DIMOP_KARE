import { Button, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import logo from "../../assets/img/header_dimop.svg";
import { authenticationService } from "../../services/authenticationService";
import colors from "../../variables/colors";

const useStyles = makeStyles((theme) => ({
  buttons: {
    color: "white",
    border: 0,
    "&:hover": {
      backgroundColor: colors.lightGreen,
      color: colors.primaryGreen,
    },
  },
  text: {
    color: "white",
  },
  logo: {
    height: 64,
    padding: 16,
  },
}));

export default function NavBar() {
  const classes = useStyles();

  // const { use_API } = useContext(APIContext);
  // const [useAPI, setUseAPI] = use_API;

  const user = localStorage.getItem("currentUser");

  return (
    <div>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        style={{
          // background: useAPI ? "#007F3D" : "red",
          background: "#007F3D",
          marginBottom: 16,
        }}
      >
        <Grid item xs={6}>
          <Grid container direction="row" alignItems="center">
            <Grid item>
              <a href="/construction">
                <img src={logo} alt="logo" className={classes.logo}></img>
              </a>
            </Grid>
            <Grid item>
              <a href="/construction">
                <Typography variant="h6" noWrap className={classes.text}>
                  DIMOP
                </Typography>
              </a>
            </Grid>

            {/*}
            <Grid item>
                            <Button
                                variant="outlined"
                                className={classes.buttons}
                                href="/login"
                            >
                                Registrieren
                            </Button>
                        </Grid>
            <Grid item style={{ marginLeft: 32 }}>
                            <span>useAPI: </span>
                            <span>{useAPI ? "true" : "false"}</span>
                        </Grid>
                          */}
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={2} justify="space-evenly">
            {user !== null ? (
              <Grid item>
                <Button
                  variant="outlined"
                  className={classes.buttons}
                  href="/main"
                >
                  Main
                </Button>
              </Grid>
            ) : (
              ""
            )}

            <Grid item>
              <Button
                variant="outlined"
                className={classes.buttons}
                href="/home"
              >
                Startseite
              </Button>
            </Grid>
            <Grid item>
              {user !== null ? (
                <Button
                  variant="outlined"
                  className={classes.buttons}
                  onClick={() => {
                    authenticationService.logout();
                  }}
                >
                  Abmelden
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  className={classes.buttons}
                  href="/login"
                >
                  Anmelden
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
