import React, { useContext, useState } from "react";

import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import { ConstructionContext } from "../../views/Construction/ConstructionContext";
import { APIContext } from "../../APIContext";

// css theme
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(3),
  },
}));

export default function EditUser() {
  // get debugging API variable
  const { use_API, API_Host } = useContext(APIContext);
  const [useAPI, setUseAPI] = use_API;
  const [APIHost, setAPIHost] = API_Host;

  // get managed states from context
  const {
    open_edit_user,
    edited_user,
    selected_user,
    need_refresh_project_team,
    loaded_cons,
  } = useContext(ConstructionContext);
  const [openEditUser, setOpenEditUser] = open_edit_user;
  const [editedUser, setEditedUser] = edited_user;
  const [selectedUser, setSelectedUser] = selected_user;
  const [
    needRefreshProjectTeam,
    setNeedRefreshProjectTeam,
  ] = need_refresh_project_team;
  const [loadedCons, setLoadedCons] = loaded_cons;
  // states
  const classes = useStyles();
  const [labelEditUser, setLabelEditUser] = useState();

  // handle closing || valid values
  const handleCloseEditUser = () => {
    if (
      (editedUser.name !== "") &
      (editedUser.funktion !== "") &
      (editedUser.organization !== "") &
      (editedUser.email !== "")
    ) {
      setOpenEditUser(false);
      handleEditingUser();
      resetEditUserInputs();
    } else {
      setLabelEditUser("Bitte überprüfen Sie ihre Angaben.");
    }
  };

  const transformBoolean = (x) => {
    if (x) {
      return 1;
    } else return 0;
  };

  const handleEditingUser = () => {
    setNeedRefreshProjectTeam(!needRefreshProjectTeam);
    if (useAPI) {
      const req = {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auth_write: transformBoolean(editedUser.user_write),
          auth_read: transformBoolean(editedUser.user_read),
          auth_delete: transformBoolean(editedUser.user_delete),
        }),
      };
      fetch(APIHost + "/perp/" + editedUser.id, req)
        .then((res) => {
          res.json();
        })
        .then((result) => console.log(result));
    }
  };

  const handleCloseEditUserBreak = () => {
    setOpenEditUser(false);
    resetEditUserInputs();
  };

  // change user state with inputs
  const handleEditUser = (e) => {
    setEditedUser({ ...editedUser, [e.target.id]: e.target.value });
  };

  const handleChangeCheck = (e) => {
    setEditedUser({
      ...editedUser,
      [e.target.name]: e.target.checked,
    });
  };

  // reset
  const resetEditUserInputs = () => {
    setSelectedUser([]);
    setEditedUser({});
  };

  return (
    <Dialog
      open={openEditUser}
      onClose={handleCloseEditUserBreak}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Ändern</DialogTitle>
      {Object.keys(loadedCons).length === 0 ? (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bitte laden oder erstellen Sie zuvor eine Konstruktion.
          </DialogContentText>
        </DialogContent>
      ) : selectedUser.length !== 1 ? (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Kein änderbares Element selektiert.
          </DialogContentText>
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogContentText style={{ color: "black" }}>
            Geben Sie die Daten des zu ändernden Benutzers ein.
          </DialogContentText>
          <Grid container>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Name"
                type="name"
                onChange={handleEditUser}
                value={editedUser.name || ""}
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="funktion"
                label="Funktion"
                type="function"
                onChange={handleEditUser}
                value={editedUser.funktion || ""}
                disabled
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="organization"
                label="Organisation"
                type="organization"
                onChange={handleEditUser}
                value={editedUser.organization || ""}
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="email"
                label="E-Mail"
                type="email"
                onChange={handleEditUser}
                value={editedUser.email || ""}
                disabled
              />
            </Grid>
          </Grid>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend" style={{ color: "black" }}>
              Rechteverwaltung
            </FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editedUser.user_read || false}
                    onChange={handleChangeCheck}
                    name="user_read"
                  />
                }
                label="Lesen"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editedUser.user_write || false}
                    onChange={handleChangeCheck}
                    name="user_write"
                  />
                }
                label="Schreiben"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editedUser.user_delete || false}
                    onChange={handleChangeCheck}
                    name="user_delete"
                  />
                }
                label="Löschen"
              />
            </FormGroup>
            <div>{labelEditUser}</div>
          </FormControl>
        </DialogContent>
      )}
      {Object.keys(loadedCons).length === 0 || selectedUser.length !== 1 ? (
        <DialogActions>
          <Button
            variant="outlined"
            onClick={handleCloseEditUserBreak}
            autoFocus
          >
            Ok
          </Button>
        </DialogActions>
      ) : (
        <DialogActions>
          <Button
            onClick={handleCloseEditUserBreak}
            variant="outlined"
            style={{ marginLeft: 10 }}
          >
            Abbrechen
          </Button>
          <Button
            onClick={handleCloseEditUser}
            variant="outlined"
            style={{ marginLeft: 10 }}
          >
            Ändern
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
