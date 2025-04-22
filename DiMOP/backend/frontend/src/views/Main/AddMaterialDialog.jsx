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
import AddIcon from "@material-ui/icons/Add";
import Grid from "@material-ui/core/Grid";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import WarningIcon from "@material-ui/icons/Warning";

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
    width: 220,
  },
  buttons2: {
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
  root_card: {
    marginLeft: 50,
    marginRight: 50,
    marginTop: 20,
    marginBottom: 20,
    height: 100,
    width: 200,
  },
}));

const muiTheme = createMuiTheme({
  palette: {
    action: {
      disabled: "white",
    },
  },
  overrides: {
    MuiStepIcon: {
      root: {
        color: "lightgrey",
        "&$active": {
          color: "grey",
        },
        "&$completed": {
          color: "#005000",
        },
      },
    },
  },
});

const AddMaterialDialog = () => {
  const classes = useStyles();
  const {
    add_component_open,
    selected_material,
    parent_material,
    data_backend,
    highest_level_id,
    add_component_mode,
    bom_updated,
    active_step,
    selection_atomic,
    material_created,
  } = useContext(MainContext);

  const [materialCreated, setMaterialCreated] = material_created;
  const [activeStep, setActiveStep] = active_step;
  const [addComponentOpen, setAddComponentOpen] = add_component_open;
  const [dataBackend, setDataBackend] = data_backend;
  const [selectedMaterial, setSelectedMaterial] = selected_material;
  const [parentMaterial, setParentMaterial] = parent_material;
  const [highestLevelId, setHighestLevelId] = highest_level_id;
  const [relations, setRelations] = useState({});
  const [addComponentMode, setAddComponentMode] = add_component_mode;
  const [bomUpdated, setBomUpdated] = bom_updated;

  const [selectionAtomic, setSelectionAtomic] = selection_atomic;

  const handleClickOpen = () => {
    setAddComponentOpen(true);
  };

  const handleClose = () => {
    setRelationError(false);
    setAddComponentOpen(false);
  };

  const handleDropdownChange = (event, id) => {
    console.log(id);
    console.log(event.target.value);
    setRelations({ ...relations, [id]: event.target.value });
  };

  //To filter backend for unique mat_id
  var setObj = new Set();

  const [relationError, setRelationError] = useState(false);

  useEffect(() => {
    if (addComponentMode === "new") {
      fetch("/mat/newest")
        .then((res) => {
          return res.json();
        })
        .then((d) => {
          console.log(d);
          setSelectedMaterial(d);
        });
    } else {
    }
  }, [materialCreated]);

  const addComponentAndRelations = () => {
    if ((addComponentMode === "new") | (addComponentMode === "existing")) {
      const siblings = [];

      dataBackend
        .filter((dataBackend) => dataBackend.parent_id == highestLevelId)
        .map((dataBackend) => siblings.push(dataBackend.mat_id));

      const siblings_unique = [...new Set(siblings)];

      if (siblings_unique.length == Object.keys(relations).length) {
        siblings_unique.map((s) => {
          //Hier kommt rel hin
          const requestOptionsRel = {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              p_id: parseInt(parentMaterial),
              m1_id: parseInt(selectedMaterial),
              m2_id: parseInt(s),
              rel_type: parseInt(relations[s]),
            }),
            redirect: "follow",
          };

          fetch("/rel", requestOptionsRel)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.log("error", error));
        });

        const requestOptionsBom = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mat_id: selectedMaterial,
            parent_mat_id: parentMaterial,
          }),
          redirect: "follow",
        };

        fetch("/bom", requestOptionsBom)
          .then((response) => response.text())
          .then((result) => console.log(result))
          .catch((error) => console.log("error", error));

        setBomUpdated(true);
        setRelationError(false);
        setActiveStep(steps.length);
      } else {
        setRelationError(true);
      }
    }
    //Wenn nicht's ausgewählt wurde (kein Modus)
  };

  function getSteps() {
    return ["Start", "Material wählen", "Beziehungen festlegen"];
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <div>
            <Grid container item xs={12}>
              Bitte wählen Sie zuerst ein Material und legen Sie anschließend
              die Beziehungen zu seinen Geschwistern fest.
            </Grid>
          </div>
        );
      case 1:
        return (
          <div>
            <Grid container item xs={12}>
              <Tabs></Tabs>
            </Grid>
          </div>
        );
      case 2:
        return (
          <div>
            <Grid container item xs={12} justify="center">
              <Card className={classes.root_card} variant="outlined">
                <CardContent>
                  <Typography
                    className={classes.title}
                    color="textSecondary"
                    gutterBottom
                    align="center"
                  >
                    Parent Material:
                  </Typography>
                  <Typography variant="h5" component="h2" align="center">
                    {parentMaterial}
                  </Typography>
                </CardContent>
              </Card>
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
                    {selectedMaterial}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Typography style={{ marginTop: 20, marginBottom: 20 }}>
              Bitte legen Sie nachfolgend fest, wie das neue Material mit seinen
              Geschwistermaterialien verbunden sein soll.
            </Typography>
            <Grid container item xs={12} direction="column">
              {dataBackend
                .filter(
                  (dataBackend) => dataBackend.parent_id == highestLevelId
                )
                .reduce((acc, item) => {
                  if (!setObj.has(item.mat_id)) {
                    setObj.add(item.mat_id, item);
                    acc.push(item);
                  }
                  return acc;
                }, [])

                .map((dataBackend) => (
                  <div>
                    <Grid container item xs={12} direction="r0w">
                      <Grid item xs={6}>
                        <Typography>
                          {dataBackend.mat_id} {dataBackend.mat_desc}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl className={classes.formControl}>
                          <InputLabel id="demo-simple-select-label">
                            Verbindungsart
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id={dataBackend.mat_id}
                            value={relations[dataBackend.mat_id]}
                            onChange={(e) => {
                              handleDropdownChange(e, dataBackend.mat_id);
                            }}
                          >
                            <MenuItem value={1}>Direkt und löslich</MenuItem>
                            <MenuItem value={2}>Indirekt und löslich</MenuItem>
                            <MenuItem value={3}>
                              Direkt und nicht löslich
                            </MenuItem>
                            <MenuItem value={4}>
                              Indirekt und nicht löslich
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </div>
                ))}
            </Grid>
            <Grid container item xs={12} justify="center">
              <Button
                className={classes.buttons}
                onClick={() => {
                  addComponentAndRelations();
                }}
              >
                Beziehungen anlegen
              </Button>
            </Grid>
            <Grid container item xs={12} justify="center">
              {relationError ? (
                <div style={{ color: "red" }}>
                  <WarningIcon
                    style={{
                      fontSize: "small",
                      marginRight: 10,
                    }}
                  ></WarningIcon>{" "}
                  Bitte Relationen vollständig eingeben
                </div>
              ) : (
                <div />
              )}
            </Grid>
          </div>
        );
      default:
        return <div></div>;
    }
  }

  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div>
      <Button className={classes.buttons2} onClick={handleClickOpen}>
        <AddIcon style={{ marginRight: 5 }}></AddIcon>
        Hinzufügen
      </Button>
      <Dialog
        open={addComponentOpen}
        onClose={() => {
          handleClose();
          handleReset();
        }}
        aria-labelledby="form-dialog-title"
      >
        <DialogActions>
          <HighlightOffIcon
            style={{ color: "#005000" }}
            onClick={() => {
              handleClose();
              handleReset();
            }}
          ></HighlightOffIcon>
        </DialogActions>
        <DialogTitle id="form-dialog-title">Komponente hinzufügen</DialogTitle>
        <DialogContent>
          <MuiThemeProvider theme={muiTheme}>
            {selectionAtomic == 0 ? (
              <div>
                <Stepper activeStep={activeStep}>
                  {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};

                    return (
                      <Step key={label} {...stepProps}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
                <div>
                  {activeStep === steps.length ? (
                    <div>
                      <Typography className={classes.instructions}>
                        Vielen Dank für Ihre Eingaben. Sie können den Dialog
                        jetzt schließen.
                      </Typography>

                      <Grid container item xs={12} justify="center">
                        <Button
                          onClick={() => {
                            handleReset();
                            handleClose();
                          }}
                          className={classes.buttons2}
                        >
                          Abschließen
                        </Button>
                      </Grid>
                    </div>
                  ) : (
                    <div>
                      <Typography className={classes.instructions}>
                        {getStepContent(activeStep)}
                      </Typography>
                      <div>
                        <Grid container item xs={12} justify="center">
                          <Grid item xs={3}>
                            {" "}
                            <Button
                              disabled={activeStep === 0}
                              onClick={handleBack}
                              className={classes.buttons2}
                            >
                              Zurück
                            </Button>
                          </Grid>
                          <Grid item xs={6}></Grid>
                          <Grid item xs={3}>
                            {" "}
                            <Button
                              onClick={handleNext}
                              className={classes.buttons2}
                              disabled={activeStep >= steps.length - 2}
                            >
                              Weiter
                            </Button>
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <Grid container item xs={12} justify="center">
                  <Typography className={classes.instructions}>
                    Diese Komponente ist atomar. Ihr können nur Rohmaterialien
                    jedoch keine weiteren Komponenten zugeordnet werden.
                  </Typography>
                  <Button onClick={handleClose} className={classes.buttons2}>
                    Ok
                  </Button>
                </Grid>
              </div>
            )}
          </MuiThemeProvider>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default AddMaterialDialog;