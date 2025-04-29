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
import CreateIcon from "@material-ui/icons/Create";

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
}));

const AddBomDialog = () => {
  const classes = useStyles();

  const {
    add_bom_open,
    orga_id,
    selected_construction_id,
    new_bom_created,
  } = useContext(MainContext);

  const [addBomOpen, setAddBomOpen] = add_bom_open;
  const [orgaId, setOrgaId] = orga_id;
  const [
    selectedConstructionId,
    setSelectedConstructionId,
  ] = selected_construction_id;
  const [newBomCreated, setNewBomCreated] = new_bom_created;

  const handleClickBomOpen = () => {
    setAddBomOpen(true);
  };

  const handleClickBomClose = () => {
    setAddBomOpen(false);
  };

  const [newBom, setNewBom] = useState({
    mat_desc: "",
    mat_desc_int: "",
    mat_id_int: "",
    cad_id: "",
    mara_plast_id: "",
    mat_rw: "",
    height: "",
    width: "",
    depth: "",
    unit: "mm",
    weight: "",
    weight_unit: "g",
    volume: "",
    volume_unit: "mm^3",
  });

  const handleNewBomInputs = (event) => {
    setNewBom({ ...newBom, [event.target.id]: event.target.value });
  };

  const [showErrorText1, setShowErrorText1] = useState(false);
  const [showErrorText2, setShowErrorText2] = useState(false);

  const validateBom = () => {
    var weightIsFloat = /^\d+\.\d+$/.test(newBom.weight);
    var weightIsNumeric = /^\d+$/.test(newBom.weight);
    var heightIsFloat = /^\d+\.\d+$/.test(newBom.height);
    var heightIsNumeric = /^\d+$/.test(newBom.height);
    var widthIsFloat = /^\d+\.\d+$/.test(newBom.width);
    var widthIsNumeric = /^\d+$/.test(newBom.width);
    var depthIsFloat = /^\d+\.\d+$/.test(newBom.depth);
    var depthIsNumeric = /^\d+$/.test(newBom.depth);
    var volumeIsFloat = /^\d+\.\d+$/.test(newBom.volume);
    var volumeIsNumeric = /^\d+$/.test(newBom.volume);

    if (newBom.mat_desc == "" || newBom.weight == "") {
      setShowErrorText1(true);
    } else if (
      (!weightIsFloat && !weightIsNumeric) ||
      (newBom.height != "" && !heightIsFloat && !heightIsNumeric) ||
      (newBom.width != "" && !widthIsFloat && !widthIsNumeric) ||
      (newBom.depth != "" && !depthIsFloat && !depthIsNumeric) ||
      (newBom.volume != "" && !volumeIsFloat && !volumeIsNumeric)
    ) {
      setShowErrorText2(true);
    } else {
      setShowErrorText1(false);
      setShowErrorText2(false);
      addBom();
      handleClickBomClose();
    }
  };

  const addBom = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mat_desc: newBom.mat_desc,
        mat_desc_int: newBom.mat_desc_int,
        mat_id_int: newBom.mat_id_int,
        cad_id: newBom.cad_id,
        mara_plast_id: parseInt(newBom.mara_plast_id),
        mat_rw: parseFloat(newBom.mat_rw),
        height: parseFloat(newBom.height),
        width: parseFloat(newBom.width),
        depth: parseFloat(newBom.depth),
        unit: newBom.unit,
        weight: parseFloat(newBom.weight),
        weight_unit: newBom.weight_unit,
        volume: parseFloat(newBom.volume),
        volume_unit: newBom.volume_unit,
        is_atomic: 0,
        orga_id: orgaId,
        cons_id: selectedConstructionId,
        del_kz: 0,
      }),
      redirect: "follow",
    };

    fetch("/mat", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));

    setNewBomCreated(!newBomCreated);
  };

  return (
    <div>
      <Button className={classes.buttons} onClick={handleClickBomOpen}>
        <CreateIcon style={{ marginRight: 5 }}></CreateIcon>
        Erstellen
      </Button>
      <Dialog
        open={addBomOpen}
        onClose={handleClickBomClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogActions>
          <HighlightOffIcon
            style={{ color: "#005000" }}
            onClick={handleClickBomClose}
          ></HighlightOffIcon>
        </DialogActions>
        <DialogTitle id="form-dialog-title">
          Neue Stückliste erstellen
        </DialogTitle>
        <DialogContent>
          <Grid container item xs={12} justify="center">
            <form className={classes.root} noValidate autoComplete="off">
              <TextField
                error={showErrorText1}
                helperText={
                  showErrorText1 ? "Bitte füllen Sie dieses Feld aus." : ""
                }
                required
                id="mat_desc"
                label="Mat.Bez."
                value={newBom.mat_desc}
                onChange={handleNewBomInputs}
                margin="normal"
              />
              <TextField
                id="mat_desc_int"
                label="ERP Mat.Bez."
                value={newBom.mat_desc_int}
                onChange={handleNewBomInputs}
                margin="normal"
              />
              <TextField
                id="mat_id_int"
                label="ERP Mat.Nr."
                value={newBom.mat_id_int}
                onChange={handleNewBomInputs}
                margin="normal"
              />
              <TextField
                id="cad_id"
                label="CAD Nr."
                value={newBom.cad_id}
                onChange={handleNewBomInputs}
                margin="normal"
              />
              <TextField
                error={showErrorText2}
                helperText={
                  showErrorText2
                    ? "Bitte geben Sie nur numerische Werte oder Gleitkommazahlen an."
                    : ""
                }
                id="height"
                label="Höhe"
                value={newBom.height}
                onChange={handleNewBomInputs}
                margin="normal"
              />
              <TextField
                error={showErrorText2}
                helperText={
                  showErrorText2
                    ? "Bitte geben Sie nur numerische Werte oder Gleitkommazahlen an."
                    : ""
                }
                id="width"
                label="Breite"
                value={newBom.width}
                onChange={handleNewBomInputs}
                margin="normal"
              />
              <TextField
                error={showErrorText2}
                helperText={
                  showErrorText2
                    ? "Bitte geben Sie nur numerische Werte oder Gleitkommazahlen an."
                    : ""
                }
                id="depth"
                label="Tiefe"
                value={newBom.depth}
                onChange={handleNewBomInputs}
                margin="normal"
              />

              <TextField
                id="unit"
                label="Einheit"
                value={newBom.unit}
                onChange={handleNewBomInputs}
                margin="normal"
                disabled
              />

              <TextField
                id="weight"
                label="Gewicht"
                value={newBom.weight}
                onChange={handleNewBomInputs}
                margin="normal"
                error={showErrorText1}
                helperText={
                  showErrorText1
                    ? "Bitte füllen Sie dieses Feld mit numerischen Werten oder Gleitkommazahlen aus."
                    : ""
                }
                required
              />

              <TextField
                id="weight_unit"
                label="G. Einheit"
                value={newBom.weight_unit}
                onChange={handleNewBomInputs}
                margin="normal"
                disabled
              />

              <TextField
                error={showErrorText2}
                helperText={
                  showErrorText2
                    ? "Bitte geben Sie nur numerische Werte oder Gleitkommazahlen an."
                    : ""
                }
                id="volume"
                label="Volumen"
                value={newBom.volume}
                onChange={handleNewBomInputs}
                margin="normal"
              />

              <TextField
                id="volume_unit"
                label="V. Einheit"
                value={newBom.volume_unit}
                onChange={handleNewBomInputs}
                margin="normal"
                disabled
              />
            </form>
          </Grid>
          <Grid container item xs={12} justify="center">
            <Grid item xs={4}></Grid>
            <Grid item xs={2}>
              {" "}
              <Button className={classes.buttons} onClick={handleClickBomClose}>
                Abbrechen
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button className={classes.buttons} onClick={validateBom}>
                Erstellen
              </Button>
            </Grid>
            <Grid item xs={4}></Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default AddBomDialog;
