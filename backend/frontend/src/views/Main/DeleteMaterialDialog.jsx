import React from "react";
import { useContext } from "react";

//Components
import { MainContext } from "./MainContext.jsx";

//Material UI
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { Typography } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import WarningIcon from "@material-ui/icons/Warning";

// Use css via makeStyles
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
}));

// Component DeleteMaterialDialog
const DeleteMaterialDialog = () => {
  // Declare variable for useStyles
  const classes = useStyles();

  // Import global variables via useContext
  const { delete_component_open, bom_updated, delete_material } = useContext(
    MainContext
  );

  // Declare variables imported from MainContext.jsx
  const [deleteComponentOpen, setDeleteComponentOpen] = delete_component_open;
  const [deleteMaterial, setDeleteMaterial] = delete_material;
  const [bomUpdated, setBomUpdated] = bom_updated;

  // Used to handle if delete material dialog is open
  const handleClickOpen = () => {
    setDeleteComponentOpen(true);
  };

  // Used to handle if delete material dialog is closed
  const handleClose = () => {
    setDeleteMaterial([]);
    setDeleteComponentOpen(false);
  };

  // Used to delete bom entry. Using endpoint bom.py
  const deleteBomEntry = (compId) => {
    var requestOptions = {
      method: "DELETE",
      redirect: "follow",
    };
    fetch("/bom/" + compId, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));

    setBomUpdated(true);
  };

  return (
    <div>
      {/* Embedded in TableTree.jsx */}
      <Button className={classes.buttons} onClick={handleClickOpen}>
        <DeleteIcon style={{ marginRight: 5 }}></DeleteIcon>
        Löschen
      </Button>
      <Dialog
        open={deleteComponentOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogActions>
          <HighlightOffIcon
            style={{ color: "#005000" }}
            onClick={handleClose}
          ></HighlightOffIcon>
        </DialogActions>
        <DialogTitle id="form-dialog-title">Komponente löschen</DialogTitle>
        <DialogContent>
          <Typography>Wollen Sie die Komponente wirklich löschen?</Typography>
          <Grid container item xs={12} justify="center">
            <Card className={classes.root_card} variant="outlined">
              <CardContent>
                <Typography
                  className={classes.title}
                  color="textSecondary"
                  gutterBottom
                  align="center"
                >
                  Ausgewähltes Material:
                </Typography>
                <Typography variant="h5" component="h2" align="center">
                  {deleteMaterial}
                </Typography>
              </CardContent>
            </Card>

            {/* Warning if no material is selected */}
            {!deleteMaterial ? (
              <div style={{ color: "red", marginTop: 10, marginBottom: 10 }}>
                <WarningIcon
                  style={{
                    fontSize: "small",
                    marginRight: 10,
                  }}
                ></WarningIcon>{" "}
                Sie müssen ein Unterkomponente auswählen, um diese zu Löschen.
              </div>
            ) : (
              <div />
            )}
          </Grid>

          <Grid container item xs={12}>
            <Grid item xs={6}>
              {/* Button: Cancel deletion*/}
              <Button
                color="primary"
                className={classes.buttons}
                variant="outlined"
                onClick={handleClose}
              >
                Nein
              </Button>
            </Grid>

            <Grid item xs={6}>
              {/* Delete selected material*/}
              <Button
                color="primary"
                className={classes.buttons}
                variant="outlined"
                onClick={() => {
                  deleteBomEntry(deleteMaterial);
                  handleClose();
                }}
              >
                Ja
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default DeleteMaterialDialog;
