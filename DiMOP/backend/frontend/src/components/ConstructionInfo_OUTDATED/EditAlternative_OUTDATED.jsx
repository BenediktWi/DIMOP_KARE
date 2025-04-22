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
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import { ConstructionContext } from "../../views/Construction/ConstructionContext";
import { APIContext } from "../../APIContext";

// css theme
const useStyles = makeStyles((theme) => ({
  Button: {
    marginLeft: 10,
  },
}));

export default function EditAlternative() {
  // get debugging API variable
  const { use_API, API_Host, API_User } = useContext(APIContext);
  const [useAPI, setUseAPI] = use_API;
  const [APIHost, setAPIHost] = API_Host;
  const [APIUser, setAPIUser] = API_User;

  const classes = useStyles();
  const [labelEditAlternative, setLabelEditAlternative] = useState();

  // get managed states from context
  const {
    open_edit_alternative,
    edited_alternative,
    selected_alternative,
    need_refresh_project_info,
    loaded_cons,
  } = useContext(ConstructionContext);
  const [openEditAlternative, setOpenEditAlternative] = open_edit_alternative;
  const [editedAlternative, setEditedAlternative] = edited_alternative;
  const [selectedAlternative, setSelectedAlternative] = selected_alternative;
  const [
    needRefreshProjectInfo,
    setNeedRefreshProjectInfo,
  ] = need_refresh_project_info;
  const [loadedCons, setLoadedCons] = loaded_cons;

  // handle closing || valid values
  const handleCloseEdit = () => {
    if (
      (editedAlternative.mara_nr !== "") &
      (editedAlternative.mat_desc !== "") &
      (editedAlternative.bom_al !== "") &
      (editedAlternative.creator !== "") &
      (editedAlternative.created_at !== "") &
      (editedAlternative.updated_at !== "") &
      (editedAlternative.cad_nr !== "")
    ) {
      setOpenEditAlternative(false);
      handleEditingAlternative();
      resetEditAlternativeInputs();
    } else {
      setLabelEditAlternative("Bitte überprüfen Sie ihre Angaben.");
    }
  };

  const transformBoolean = (x) => {
    if (x) {
      return "1";
    } else return "0";
  };

  const handleEditingAlternative = () => {
    console.log(editedAlternative);
    setNeedRefreshProjectInfo(!needRefreshProjectInfo);
    if (useAPI) {
      const req = {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bom_desc: editedAlternative.bom_desc,
          bom_al: editedAlternative.bom_al,
          bom_al_desc: editedAlternative.bom_al_desc,
          user_id: APIUser,
          kons_id: loadedCons.id,
          mara_id: editedAlternative.mara_id,
          fav: transformBoolean(editedAlternative.fav),
          cad_nr: editedAlternative.cad_nr,
          auth_read: transformBoolean(editedAlternative.auth_read),
          auth_write: transformBoolean(editedAlternative.auth_write),
          auth_delete: transformBoolean(editedAlternative.auth_delete),
        }),
      };
      fetch(APIHost + "/bomal/" + editedAlternative.id, req)
        .then((res) => {
          res.json();
        })
        .then((result) => console.log(result));
    }
  };

  const handleCloseEditBreak = () => {
    setOpenEditAlternative(false);
    resetEditAlternativeInputs();
  };

  // change alternatives state with inputs
  const handleEditAlternative = (e) => {
    setEditedAlternative({
      ...editedAlternative,
      [e.target.id]: e.target.value,
    });
  };

  const handleChangeCheck = (e) => {
    setEditedAlternative({
      ...editedAlternative,
      [e.target.name]: e.target.checked,
    });
  };

  // reset
  const resetEditAlternativeInputs = () => {
    setSelectedAlternative([]);
    setEditedAlternative({});
  };

  return (
    <Dialog
      open={openEditAlternative}
      onClose={handleCloseEditBreak}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Ändern</DialogTitle>
      {Object.keys(loadedCons).length === 0 ? (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bitte laden oder erstellen Sie zuvor eine Konstruktion.
          </DialogContentText>
        </DialogContent>
      ) : selectedAlternative.length !== 1 ? (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Kein änderbares Element selektiert.
          </DialogContentText>
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogContentText style={{ color: "black" }}>
            Geben Sie die Daten der zu ändernden Stücklistenalternative ein.
          </DialogContentText>
          <Grid container>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="bom_al_desc"
                label="Beschreibung Stücklistenalternative"
                type="name"
                onChange={handleEditAlternative}
                value={editedAlternative.bom_al_desc || ""}
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="bom_desc"
                label="Bom DESC????"
                type="function"
                onChange={handleEditAlternative}
                value={editedAlternative.bom_desc || ""}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="cad_nr"
                label="CAD"
                type="organization"
                onChange={handleEditAlternative}
                value={editedAlternative.cad_nr || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="mara_id"
                label="Mara ID"
                type="organization"
                onChange={handleEditAlternative}
                value={editedAlternative.mara_id || ""}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={5}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editedAlternative.auth_read || false}
                      onChange={handleChangeCheck}
                      name="auth_read"
                    />
                  }
                  label="Lesen"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editedAlternative.auth_write || false}
                      onChange={handleChangeCheck}
                      name="auth_write"
                    />
                  }
                  label="Schreiben"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editedAlternative.auth_delete || false}
                      onChange={handleChangeCheck}
                      name="auth_delete"
                    />
                  }
                  label="Löschen"
                />
              </FormGroup>
            </Grid>
            <Grid item xs={5}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editedAlternative.fav || false}
                      onChange={handleChangeCheck}
                      name="fav"
                    />
                  }
                  label="Favoriten"
                />
              </FormGroup>
            </Grid>
          </Grid>
          <div>{labelEditAlternative}</div>
        </DialogContent>
      )}
      {Object.keys(loadedCons).length === 0 ||
      selectedAlternative.length !== 1 ? (
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseEditBreak} autoFocus>
            Ok
          </Button>
        </DialogActions>
      ) : (
        <DialogActions>
          <Button
            onClick={handleCloseEditBreak}
            variant="outlined"
            className={classes.Button}
          >
            Abbrechen
          </Button>
          <Button
            onClick={handleCloseEdit}
            variant="outlined"
            className={classes.Button}
          >
            Ändern
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
