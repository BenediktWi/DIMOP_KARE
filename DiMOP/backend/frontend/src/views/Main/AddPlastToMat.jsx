// Nicht in Nutzung
import React from "react";
import { useContext, useState, useEffect } from "react";

// Component
import { MainContext } from "./MainContext.jsx";

// Material UI
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

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
    height: 60,
    width: 120,
  },
}));

const AddPlastToMat = () => {
  const classes = useStyles();
  const { add_plast_open, parent_material, bom_updated } = useContext(
    MainContext
  );
  const [addPlastOpen, setAddPlastOpen] = add_plast_open;
  const [parentMaterial, setParentMaterial] = parent_material;
  const [bomUpdated, setBomUpdated] = bom_updated;

  const handleClickPlastOpen = () => {
    setAddPlastOpen(true);
  };

  const handleClickPlastClose = () => {
    setAddPlastOpen(false);
  };

  const [newPlast, setNewPlast] = useState({
    mara_plast_id: "",
  });

  const handleNewPlastInputs = (event) => {
    setNewPlast({ ...newPlast, [event.target.id]: event.target.value });
  };

  const addPlast = () => {
    console.log(newPlast);

    var requestOptions = {
      method: "PUT",
      redirect: "follow",
    };

    fetch(
      "/mat/" + parentMaterial + "?mara_plast_id=" + newPlast.mara_plast_id,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));

    setBomUpdated(true);
  };

  return (
    <div>
      <Button className={classes.buttons} onClick={handleClickPlastOpen}>
        Neuen Kunststoff zuordnen
      </Button>

      <Dialog
        open={addPlastOpen}
        onClose={handleClickPlastClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogActions>
          <HighlightOffIcon
            style={{ color: "#005000" }}
            onClick={handleClickPlastClose}
          ></HighlightOffIcon>
        </DialogActions>
        <DialogContent>
          <Grid container item xs={12}>
            <Grid items xs={6}>
              {" "}
              <Card className={classes.root_card} variant="outlined">
                <CardContent>
                  <Typography
                    className={classes.title}
                    color="textSecondary"
                    gutterBottom
                    align="center"
                  >
                    Parent
                  </Typography>
                  <Typography variant="h5" component="h2" align="center">
                    {parentMaterial}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid items xs={6}>
              {" "}
              <Card className={classes.root_card} variant="outlined">
                <CardContent>
                  <Typography
                    className={classes.title}
                    color="textSecondary"
                    gutterBottom
                    align="center"
                  >
                    Plast
                  </Typography>
                  <Typography variant="h5" component="h2" align="center">
                    {newPlast.mara_plast_id}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid container item xs={12}>
            <form className={classes.root} noValidate autoComplete="off">
              <TextField
                id="mara_plast_id"
                label="Plast.Id."
                value={newPlast.mara_plast_id}
                onChange={handleNewPlastInputs}
                margin="normal"
              />
            </form>
          </Grid>
          <Grid container item xs={12}>
            <Button
              className={classes.buttons}
              onClick={() => {
                addPlast();
                handleClickPlastClose();
              }}
            >
              Zuordnen
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default AddPlastToMat;
