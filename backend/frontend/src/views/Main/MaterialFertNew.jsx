// Contains the component that  allows to add components that are new materials which are created 

// Import react components
import React, { useContext, useState } from "react";

// Import own components
import { MainContext } from "./MainContext.jsx";

// Import material ui components
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import HelpIcon from "@material-ui/icons/Help";

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
    height: 60,
    width: 120,
  },
}));

// Component MaterialFertNew
const MaterialFertNew = () => {

  // Declare variable for useStyles
  const classes = useStyles();

  // Import global variables via useContext
  const {
    add_component_open,
    selected_construction_id,
    new_bom_created,
    orga_id,
    add_component_mode,
    active_step,
    material_created,
  } = useContext(MainContext);

  // Declare variables imported from MainContext.jsx
  const [materialCreated, setMaterialCreated] = material_created;
  const [activeStep, setActiveStep] = active_step;
  const [
    selectedConstructionId,
    setSelectedConstructionId,
  ] = selected_construction_id;
  const [newBomCreated, setNewBomCreated] = new_bom_created;
  const [orgaId, setOrgaId] = orga_id;
  const [addComponentMode, setAddComponentMode] = add_component_mode;

  // Declare variables
  const [newMaterial, setNewMaterial] = useState({
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

  const [isAtomic, setIsAtomic] = useState("1");
  const [showErrorText1, setShowErrorText1] = useState(false);
  const [showErrorText2, setShowErrorText2] = useState(false);

  // Used to set newMaterial values
  const handleNewMaterialInputs = (event) => {
    setNewMaterial({ ...newMaterial, [event.target.id]: event.target.value });
  };

  // Used to set isAtomic
  const handleRadioChange = (event) => {
    setIsAtomic(event.target.value);
  };

  // Used to validate if input for new material is correct
  const validateNewMat = () => {
    var weightIsFloat = /^\d+\.\d+$/.test(newMaterial.weight);
    var weightIsNumeric = /^\d+$/.test(newMaterial.weight);
    var heightIsFloat = /^\d+\.\d+$/.test(newMaterial.height);
    var heightIsNumeric = /^\d+$/.test(newMaterial.height);
    var widthIsFloat = /^\d+\.\d+$/.test(newMaterial.width);
    var widthIsNumeric = /^\d+$/.test(newMaterial.width);
    var depthIsFloat = /^\d+\.\d+$/.test(newMaterial.depth);
    var depthIsNumeric = /^\d+$/.test(newMaterial.depth);
    var volumeIsFloat = /^\d+\.\d+$/.test(newMaterial.volume);
    var volumeIsNumeric = /^\d+$/.test(newMaterial.volume);

    if (newMaterial.mat_desc == "" || newMaterial.weight == "") {
      setShowErrorText1(true);
    } else if (
      (!weightIsFloat && !weightIsNumeric) ||
      (newMaterial.height != "" && !heightIsFloat && !heightIsNumeric) ||
      (newMaterial.width != "" && !widthIsFloat && !widthIsNumeric) ||
      (newMaterial.depth != "" && !depthIsFloat && !depthIsNumeric) ||
      (newMaterial.volume != "" && !volumeIsFloat && !volumeIsNumeric)
    ) {
      setShowErrorText2(true);
    } else {
      setShowErrorText1(false);
      setShowErrorText2(false);
      addMaterial();
      setMaterialCreated(!materialCreated);
      setAddComponentMode("new");
      setActiveStep(2);
    }
  };

  // Used to save new material using mat.py
  const addMaterial = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mat_desc: newMaterial.mat_desc,
        mat_desc_int: newMaterial.mat_desc_int,
        mat_id_int: newMaterial.mat_id_int,
        cad_id: newMaterial.cad_id,
        mara_plast_id: parseInt(newMaterial.mara_plast_id),
        mat_rw: parseFloat(newMaterial.mat_rw),
        height: parseFloat(newMaterial.height),
        width: parseFloat(newMaterial.width),
        depth: parseFloat(newMaterial.depth),
        unit: newMaterial.unit,
        weight: parseFloat(newMaterial.weight),
        weight_unit: newMaterial.weight_unit,
        volume: parseFloat(newMaterial.volume),
        volume_unit: newMaterial.volume_unit,
        is_atomic: parseInt(isAtomic),
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
      {/* Form for new material input */}
      <form className={classes.root} noValidate autoComplete="off">
        <TextField
          error={showErrorText1}
          helperText={showErrorText1 ? "Bitte füllen Sie dieses Feld aus." : ""}
          required
          id="mat_desc"
          label="Mat.Bez."
          value={newMaterial.mat_desc}
          onChange={handleNewMaterialInputs}
          margin="normal"
        />
        <TextField
          id="mat_desc_int"
          label="ERP Mat.Bez."
          value={newMaterial.mat_desc_int}
          onChange={handleNewMaterialInputs}
          margin="normal"
        />
        <TextField
          id="mat_id_int"
          label="ERP Mat.Nr."
          value={newMaterial.mat_id_int}
          onChange={handleNewMaterialInputs}
          margin="normal"
        />
        <TextField
          id="cad_id"
          label="CAD Nr."
          value={newMaterial.cad_id}
          onChange={handleNewMaterialInputs}
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
          value={newMaterial.height}
          onChange={handleNewMaterialInputs}
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
          value={newMaterial.width}
          onChange={handleNewMaterialInputs}
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
          value={newMaterial.depth}
          onChange={handleNewMaterialInputs}
          margin="normal"
        />

        <TextField
          id="unit"
          label="Einheit"
          value={newMaterial.unit}
          onChange={handleNewMaterialInputs}
          margin="normal"
          disabled
        />

        <TextField
          id="weight"
          label="Gewicht"
          value={newMaterial.weight}
          onChange={handleNewMaterialInputs}
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
          value={newMaterial.weight_unit}
          onChange={handleNewMaterialInputs}
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
          value={newMaterial.volume}
          onChange={handleNewMaterialInputs}
          margin="normal"
        />

        <TextField
          id="volume_unit"
          label="V. Einheit"
          value={newMaterial.volume_unit}
          onChange={handleNewMaterialInputs}
          margin="normal"
          disabled
        />

        <FormControl component="fieldset">
          <FormLabel component="legend">
            {" "}
            Anlage als Stückliste?
            <Tooltip
              title={
                <Typography variant="body1">
                  Wird ein Material als Stückliste angelegt, können dem Material
                  Komponenten hinzugefügt werden, dafür kann kein Rohstoff bzw.
                  Kunststoff zugeordnet werden.
                </Typography>
              }
            >
              <HelpIcon style={{ marginLeft: 10 }} fontSize="small"></HelpIcon>
            </Tooltip>
          </FormLabel>
          <RadioGroup
            aria-label="atomic"
            value={isAtomic}
            onChange={handleRadioChange}
          >
            <FormControlLabel value="0" control={<Radio />} label="Ja" />
            <FormControlLabel value="1" control={<Radio />} label="Nein" />
          </RadioGroup>
        </FormControl>
      </form>

      <Grid container item xs={12} justify="center">
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
          {/* Button: Validate and create material */}
          <Button
            className={classes.buttons}
            onClick={() => {
              validateNewMat();
            }}
          >
            Material anlegen
          </Button>
          {materialCreated ? <div>Neues Material angelegt!</div> : <div />}
        </Grid>
        <Grid item xs={4}></Grid>
      </Grid>
    </div>
  );
};

export default MaterialFertNew;
