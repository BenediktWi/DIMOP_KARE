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

export default function AddAlternative() {
  // get debugging API variable
  const { use_API, API_Host, API_User } = useContext(APIContext);
  const [useAPI, setUseAPI] = use_API;
  const [APIHost, setAPIHost] = API_Host;
  const [APIUser, setAPIUser] = API_User;

  const classes = useStyles();
  const [labelAddAlternative, setLabelAddAlternative] = useState();
  const [newAlternative, setNewAlternative] = useState({
    mara_id: "",
    bom_desc: "",
    bom_al_desc: "",
    cad_nr: "",
    auth_write: false,
    auth_delete: false,
    auth_read: false,
    auth_orga: false,
    fav: false,
    del_kz: false,
  });

  // get managed states from context
  const {
    open_add_alternative,
    need_refresh_project_info,
    loaded_cons,
  } = useContext(ConstructionContext);
  const [openAddAlternative, setOpenAddAlternative] = open_add_alternative;
  const [
    needRefreshProjectInfo,
    setNeedRefreshProjectInfo,
  ] = need_refresh_project_info;
  const [loadedCons, setLoadedCons] = loaded_cons;

  const transformBoolean = (x) => {
    if (x) {
      return "1";
    } else return "0";
  };

  const handleAddingAlternative = () => {
    setNeedRefreshProjectInfo(true);
    const req = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bom_desc: newAlternative.bom_desc,
        bom_al: 5,
        bom_al_desc: newAlternative.bom_al_desc,
        user_id: APIUser,
        kons_id: loadedCons.id,
        mara_id: Number(newAlternative.mara_id),
        fav: transformBoolean(newAlternative.fav),
        cad_nr: Number(newAlternative.cad_nr),
        auth_read: transformBoolean(newAlternative.auth_read),
        auth_write: transformBoolean(newAlternative.auth_write),
        auth_delete: transformBoolean(newAlternative.auth_delete),
        auth_orga: transformBoolean(newAlternative.auth_orga),
        del_kz: transformBoolean(newAlternative.del_kz),
      }),
    };
    fetch(APIHost + "/bomal", req)
      .then((res) => {
        res.json();
        console.log(res);
      })
      .then((result) => console.log(result));
  };

  // handle closing || valid values
  const handleCloseAdd = () => {
    if (
      (newAlternative.mara_id !== "") &
      (newAlternative.bom_desc !== "") &
      (newAlternative.bom_desc_al !== "") &
      (newAlternative.cad_nr !== "")
    ) {
      setOpenAddAlternative(false);
      handleAddingAlternative();
      resetAddAlternativeInputs();
    } else {
      setLabelAddAlternative("Bitte überprüfen Sie ihre Angaben.");
    }
  };

  const handleCloseAddBreak = () => {
    setOpenAddAlternative(false);
    resetAddAlternativeInputs();
  };

  // change alternatives state with inputs
  const handleAddAlternative = (e) => {
    setNewAlternative({
      ...newAlternative,
      [e.target.id]: e.target.value,
    });
  };

  const handleChangeCheck = (e) => {
    setNewAlternative({
      ...newAlternative,
      [e.target.name]: e.target.checked,
    });
  };

  // reset
  const resetAddAlternativeInputs = () => {
    setNewAlternative({});
  };

  return (
    <Dialog
      open={openAddAlternative}
      onClose={handleCloseAddBreak}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Hinzufügen</DialogTitle>
      {Object.keys(loadedCons).length === 0 ? (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bitte laden oder erstellen Sie zuvor eine Konstruktion.
          </DialogContentText>
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogContentText style={{ color: "black" }}>
            Geben Sie die Daten der zu erstellenden Stücklistenalternative ein.
          </DialogContentText>
          <Grid container>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="bom_desc"
                label="BOM DESC????"
                type="name"
                onChange={handleAddAlternative}
                value={newAlternative.bom_desc || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="bom_al_desc"
                label="Beschreibung Alternative"
                type="function"
                onChange={handleAddAlternative}
                value={newAlternative.bom_al_desc || ""}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="mara_id"
                label="MaterialID"
                type="organization"
                onChange={handleAddAlternative}
                value={newAlternative.mara_id || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="cad_nr"
                label="CAD"
                type="email"
                onChange={handleAddAlternative}
                value={newAlternative.cad_nr || ""}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={5}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newAlternative.auth_read || false}
                      onChange={handleChangeCheck}
                      name="auth_read"
                    />
                  }
                  label="Lesen"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newAlternative.auth_write || false}
                      onChange={handleChangeCheck}
                      name="auth_write"
                    />
                  }
                  label="Schreiben"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newAlternative.auth_delete || false}
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
                      checked={newAlternative.fav || false}
                      onChange={handleChangeCheck}
                      name="fav"
                    />
                  }
                  label="Favoriten"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newAlternative.del_kz || false}
                      onChange={handleChangeCheck}
                      name="del_kz"
                    />
                  }
                  label="del_kz"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newAlternative.auth_orga || false}
                      onChange={handleChangeCheck}
                      name="auth_orga"
                    />
                  }
                  label="Orga?"
                />
              </FormGroup>
            </Grid>
          </Grid>
          <div>{labelAddAlternative}</div>
        </DialogContent>
      )}
      {Object.keys(loadedCons).length === 0 ? (
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseAddBreak} autoFocus>
            Ok
          </Button>
        </DialogActions>
      ) : (
        <DialogActions>
          <Button
            onClick={handleCloseAddBreak}
            variant="outlined"
            className={classes.Button}
          >
            Abbrechen
          </Button>
          <Button
            onClick={handleCloseAdd}
            variant="outlined"
            className={classes.Button}
          >
            Anlegen
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
