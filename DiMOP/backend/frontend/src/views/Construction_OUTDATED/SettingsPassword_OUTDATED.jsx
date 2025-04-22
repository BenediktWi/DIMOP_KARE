import React, { useContext, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

import { ConstructionContext } from "./ConstructionContext";
import { APIContext } from "../../APIContext";

const useStyles = makeStyles((theme) => ({
  textbox: {
    //textAlign: "center",
    //justifyContent: "center",
  },
}));

export default function SettingsPassword() {
  // get debugging API variable
  const { use_API, API_Host, API_User } = useContext(APIContext);
  const [useAPI, setUseAPI] = use_API;
  const [APIHost, setAPIHost] = API_Host;
  const [APIUser, setAPIUser] = API_User;

  // construction context states
  const { open_settings_password, loaded_cons } = useContext(
    ConstructionContext
  );
  const [
    openSettingsPassword,
    setOpenSettingsPassword,
  ] = open_settings_password;
  const [loadedCons, setLoadedCons] = loaded_cons;

  const classes = useStyles();

  const [newPassword, setNewPassword] = useState({
    password: "",
    password_confirm: "",
  });

  const [labelSettingsPassword, setLabelSettingsPassword] = useState("");

  const handleCloseSettingsPassword = () => {
    if (
      newPassword.password !== null &&
      newPassword.password !== "" &&
      newPassword.password_confirm !== null &&
      newPassword.password_confirm !== "" &&
      newPassword.password === newPassword.password_confirm
    ) {
      setLabelSettingsPassword("");
      addPassword(newPassword);
      setOpenSettingsPassword(false);
      resetPassword();
    } else {
      setLabelSettingsPassword("Überprüfen Sie ihre Eingaben.");
      setOpenSettingsPassword(true);
    }
  };

  const handleCloseSettingsPasswordBreak = () => {
    setOpenSettingsPassword(false);
    resetPassword();
  };

  const resetPassword = () => {
    setNewPassword({
      password: "",
      password_confirm: "",
    });
  };

  const addPassword = (pw) => {
    console.log("Neues Passwort: " + pw.password);
    if (useAPI) {
      const req = {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: pw.password,
        }),
      };
      fetch(APIHost + "/password/" + APIUser, req)
        .then((res) => {
          res.json();
        })
        .then((result) => console.log(result));
    }
  };

  const handlePasswordInputs = (event) => {
    setNewPassword({ ...newPassword, [event.target.id]: event.target.value });
  };

  return (
    <Dialog
      open={openSettingsPassword}
      onClose={handleCloseSettingsPasswordBreak}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Passwort ändern</DialogTitle>
      <DialogContent>
        <DialogContentText style={{ color: "black" }}>
          Ändern Sie ihr Passwort.
        </DialogContentText>
        <Grid container className={classes.textbox}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              margin="dense"
              id="password"
              label="Passwort"
              type="name"
              onChange={handlePasswordInputs}
              value={newPassword.password}
            />
          </Grid>
        </Grid>
        <Grid container className={classes.textbox}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              margin="dense"
              id="password_confirm"
              label="Passwort wiederholen"
              type="name"
              onChange={handlePasswordInputs}
              value={newPassword.password_confirm}
            />
          </Grid>
        </Grid>
        <div>{labelSettingsPassword}</div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCloseSettingsPasswordBreak}
          variant="outlined"
          style={{ marginLeft: 10 }}
        >
          Abbrechen
        </Button>
        <Button
          onClick={handleCloseSettingsPassword}
          variant="outlined"
          style={{ marginLeft: 10 }}
        >
          Ändern
        </Button>
      </DialogActions>
    </Dialog>
  );
}
