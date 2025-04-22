import React from "react";
import { useContext, useState, useEffect } from "react";

//Components
import { MainContext } from "./MainContext.jsx";
import Tabs from "./AddComponentTabs.jsx";

//Material UI
import Button from "@material-ui/core/Button";
import {
  makeStyles,
  MuiThemeProvider,
  createMuiTheme,
} from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import CreateIcon from "@material-ui/icons/Create";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

// css theme
const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  buttons: {
    borderColor: "#005000",
    color: "#005000",
    textTransform: "none",
    margin: 20,
    height: 30,
    width: 120,
  },
  formControl: {
    minWidth: 200,
    marginBottom: 50,
  },
}));

const AddConstructionDialog = () => {
  const classes = useStyles();
  const {
    add_construction_open,
    constructions_updated,
    new_construction,
  } = useContext(MainContext);
  const [constructionsUpdated, setConstructionsUpdated] = constructions_updated;
  const [addConstructionOpen, setAddConstructionOpen] = add_construction_open;
  const [newConstruction, setNewConstruction] = new_construction;

  const handleClickOpen = () => {
    setAddConstructionOpen(true);
  };

  const handleClose = () => {
    setAddConstructionOpen(false);
  };

  const handleNewConstInput = (event) => {
    setNewConstruction({
      ...newConstruction,
      [event.target.id]: event.target.value,
    });
  };

  const AddConstruction = () => {
    var requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cons_title: newConstruction.cons_title,
        cons_desc: newConstruction.cons_desc,
        orga_id: newConstruction.orga_id,
        del_kz: newConstruction.del_kz,
      }),
      redirect: "follow",
    };

    fetch("/cons", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));

    setConstructionsUpdated(!constructionsUpdated);
  };

  return (
    <div>
      <Button className={classes.buttons} onClick={handleClickOpen}>
        <CreateIcon style={{ marginRight: 5 }}></CreateIcon>
        Erstellen
      </Button>

      <Dialog
        open={addConstructionOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogActions>
          <HighlightOffIcon
            style={{ color: "#005000" }}
            onClick={handleClose}
          ></HighlightOffIcon>
        </DialogActions>
        <DialogTitle id="form-dialog-title">Konstruktion anlegen</DialogTitle>
        <DialogContent>
          <Grid container item xs={12}>
            <form className={classes.root} noValidate autoComplete="off">
              <TextField
                id="cons_title"
                label="Konstr.Titel"
                value={newConstruction.cons_title}
                onChange={handleNewConstInput}
                margin="normal"
              />
              <TextField
                id="cons_desc"
                label="Konstr.Beschreibung"
                value={newConstruction.cons_desc}
                onChange={handleNewConstInput}
                margin="normal"
              />
            </form>
          </Grid>
          <Grid container item xs={12} justify="center">
            <Grid item xs={6}>
              {" "}
              <Button className={classes.buttons} onClick={handleClose}>
                Abbrechen
              </Button>
            </Grid>
            <Grid item xs={6}>
              {" "}
              <Button
                className={classes.buttons}
                onClick={() => {
                  AddConstruction();
                  handleClose();
                }}
              >
                Erstellen
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default AddConstructionDialog;
