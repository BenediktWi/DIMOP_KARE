// Contains evaluation dialog

// Import react components
import React from "react";
import { useContext, useState } from "react";

// Import own components
import { MainContext } from "./MainContext.jsx";

// Import material ui components
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import Grid from "@material-ui/core/Grid";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Typography from "@material-ui/core/Typography";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme,
} from "@material-ui/core/styles";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

// Use css via makeStyles
const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
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
  buttons2: {
    borderColor: "#005000",
    color: "#005000",
    textTransform: "none",
    margin: 20,
    height: 60,
    width: 140,
  },
  stepdiv: {
    height: 150,
    width: 500,
  },
  stepdiv2: {
    height: 300,
    width: 500,
  },
}));

// Override default material ui theme
const muiTheme = createMuiTheme({
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

// Define radio button styles
const GreenRadio = withStyles({
  root: {
    color: "#005000",
    "&$checked": {
      color: "#005000",
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

// Component EvaluationDialog
const EvaluationDialog = () => {

  // Declare variable for useStyles
  const classes = useStyles();

  // Import global variables via useContext
  const { evaluation_open, data_backend, new_bom_created } = useContext(MainContext);

  // Declare variables imported from MainContext.jsx
  const [dataBackend, setDataBackend] = data_backend;
  const [evaluationOpen, setEvaluationOpen] = evaluation_open;
  const [newBomCreated, setNewBomCreated] = new_bom_created;

  // Declare variables
  const [evaluationData, setEvaluationData] = useState([]);
  const [isDangerous, setIsDangerous] = useState(0);
  const [isImpure, setIsImpure] = useState(0);

  // Send data to backend, evaluate and send results back. Using endpoint evaluation.py
  const initiateEvaluation = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isDangerous,
        dataBackend,
      }),
      redirect: "follow",
    };

    fetch("/evaluation", requestOptions)
      .then((res) => {
        return res.json();
      })
      .then((d) => {
        console.log(d);
        setEvaluationData(d);
        console.log(evaluationData);
      });
  };

  // Save evaluation results. Using endpoint mat.py
  const saveEvaluationResults = () => {
    var requestOptions = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mat_rw: evaluationData.RV,
        price: evaluationData.Price,
        co2_value: evaluationData.GWP,
        resource_use: evaluationData.ADPf,
        recycling_cat: evaluationData.Grade,
        evaluated: 1,
        impure: isImpure,
        dangerous: isDangerous,
      }),
      redirect: "follow",
    };

    fetch("/mat_eval/" + evaluationData.mat_id, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));

      setNewBomCreated(!newBomCreated);


  };

  // Handle setting isDangerous
  const handleChangeDangerous = (event) => {
    setIsDangerous(event.target.value);
  };

  // Handle setting isImpure
  const handleChangeImpurity = (event) => {
    setIsImpure(event.target.value);
  };

  // Get steps for stepper (number of elements in array = number of steps)
  const getSteps = () => {
    return ["", "", "", ""];
  };

// Rendering color of visual recycling value based on recycling grade
  const renderVisualRecyclingValue = () => {
    if (evaluationData.Grade == "A")
      return (
        <span>
          <FiberManualRecordIcon
            style={{ color: "#50d100" }}
            fontSize="large"
          ></FiberManualRecordIcon>
        </span>
      );
    else if (evaluationData.Grade == "B")
      return (
        <span>
          <FiberManualRecordIcon
            style={{ color: "#a0d100" }}
            fontSize="large"
          ></FiberManualRecordIcon>
        </span>
      );
    else if (evaluationData.Grade == "C")
      return (
        <span>
          <FiberManualRecordIcon
            style={{ color: "#d1d100" }}
            fontSize="large"
          ></FiberManualRecordIcon>
        </span>
      );
    else if (evaluationData.Grade == "D")
      return (
        <span>
          <FiberManualRecordIcon
            style={{ color: "#d1a400" }}
            fontSize="large"
          ></FiberManualRecordIcon>
        </span>
      );
    else if (evaluationData.Grade == "E")
      return (
        <span>
          <FiberManualRecordIcon
            style={{ color: "#f73100" }}
            fontSize="large"
          ></FiberManualRecordIcon>
        </span>
      );
    else if (evaluationData.Grade == "F")
      return (
        <span>
          <FiberManualRecordIcon
            style={{ color: "#a10000" }}
            fontSize="large"
          ></FiberManualRecordIcon>
        </span>
      );
    return (
      <span>
        <FiberManualRecordIcon
          style={{ color: "#d1d1d1" }}
          fontSize="large"
        ></FiberManualRecordIcon>
      </span>
    );
  };

  // Used to get step contents
  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <div className={classes.stepdiv}>
            <Grid container item xs={12}>
              Bitte beantworten Sie die nachfolgenden Fragen zu Ihrem geplanten
              Produkt.{" "}
            </Grid>
          </div>
        );
      case 1:
        // Define if product causes environmental damage
        return (
          <div className={classes.stepdiv}>
            <Grid container item xs={12}>
              Enthält Ihr Produkt umwelt- oder gesundheitsgefährdende Stoffe?
            </Grid>
            <Grid container item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend"></FormLabel>
                <RadioGroup
                  aria-label="is-dangerous"
                  value={isDangerous}
                  onChange={handleChangeDangerous}
                >
                  <FormControlLabel
                    value="1"
                    control={<GreenRadio />}
                    label="Ja"
                  />
                  <FormControlLabel
                    value="0"
                    control={<GreenRadio />}
                    label="Nein"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </div>
        );
      case 2:
        // Define if product contains impurities
        return (
          <div className={classes.stepdiv}>
            <Grid container item xs={12}>
              Enthält Ihr Produkt Störstoffe?
            </Grid>
            <Grid container item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend"></FormLabel>
                <RadioGroup
                  aria-label="is-impurity"
                  value={isImpure}
                  onChange={handleChangeImpurity}
                >
                  <FormControlLabel
                    value="1"
                    control={<GreenRadio />}
                    label="Ja"
                  />
                  <FormControlLabel
                    value="0"
                    control={<GreenRadio />}
                    label="Nein"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </div>
        );
      case 3:
        // Here, evaluation can be triggered
        return (
          <div className={classes.stepdiv2}>
            <Grid
              container
              item
              xs={12}
              alignContent="center"
              alignItems="center"
              justify="center"
            >
              <div style={{ marginTop: 30, marginBottom: 30 }}>
                {renderVisualRecyclingValue()}
              </div>
            </Grid>
            <Grid container item xs={12}>
              <table>
                <tr>
                  <td>
                    <b>Produkt: </b>
                  </td>
                  <td>{evaluationData.mat_desc}</td>
                </tr>
                <tr>
                  <td>
                    <b>Recyclingwert: </b>
                  </td>
                  <td>{evaluationData.RV}</td>
                </tr>
                <tr>
                  <td>
                    <b>Recyclingklassifikation (A-F): </b>
                  </td>
                  <td>{evaluationData.Grade}</td>
                </tr>
                <tr>
                  <td>
                    <b>Globales Erwärmungspotential (GWP): </b>
                  </td>
                  <td>{evaluationData.GWP}</td>
                </tr>
                <tr>
                  <td>
                    <b>Abiotischer-Ressourcen-Verbrauch (ADPf): </b>
                  </td>
                  <td>{evaluationData.ADPf}</td>
                </tr>
                <tr>
                  <td>
                    <b>Preis (Euro): </b>
                  </td>
                  <td>{evaluationData.Price}</td>
                </tr>
              </table>
            </Grid>
            <Grid
              container
              item
              xs={12}
              alignContent="center"
              alignItems="center"
              justify="center"
            >
              {/* Button: Triggers evaluation using endpoint evaluation.py */}
              <Button onClick={initiateEvaluation} className={classes.buttons}>
                Bewerten
              </Button>
            </Grid>
          </div>
        );
      default:
        return (
          <div className={classes.stepdiv}>
            <Grid container item xs={12}></Grid>
          </div>
        );
    }
  }

  // Used to handle if evaluation dialog is open
  const handleClickOpen = () => {
    setEvaluationOpen(true);
  };

  // Used to handle if evaluation dialog is closed
  const handleClose = () => {
    setEvaluationOpen(false);
    setEvaluationData([]);
    setActiveStep(0);
  };

  // Set active steps and define getSteps
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  // Increase step
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  // Decrease step
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Reset steps to 1
  const handleReset = () => {
    setActiveStep(1);
  };

  return (
    <div>
      {/* Embedded in TableTree.jsx */}
      <Button className={classes.buttons} onClick={handleClickOpen}>
        <PlayCircleOutlineIcon
          style={{ marginRight: 5 }}
        ></PlayCircleOutlineIcon>
        Bewerten
      </Button>
      <Dialog
        open={evaluationOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogActions>
          <HighlightOffIcon
            style={{ color: "#005000" }}
            onClick={handleClose}
          ></HighlightOffIcon>
        </DialogActions>
        <DialogTitle id="form-dialog-title">Stückliste bewerten</DialogTitle>

        <DialogContent>
          <MuiThemeProvider theme={muiTheme}>
            {/* Filters data backend, and if conditions are met,
            the evaluation stepper is rendered */}
            {dataBackend
              .map((row) => row.is_atomic)
              .filter((element) => element == 1).length ==
              dataBackend
                .map((row) => row.plast_fam)
                .filter((element) => element != null).length &&
            dataBackend
              .map((row) => row.is_atomic)
              .filter((element) => element == 1).length != 0 ? (
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
                        Vielen Dank für Ihre Eingaben. Sie können Ihre
                        Ergebnisse jetzt speichern, indem Sie die Bewertung
                        "Abschließen".
                      </Typography>

                      <Grid container item xs={12} justify="center">
                        {/* Button: Reset input */}
                        <Button
                          onClick={handleReset}
                          className={classes.buttons2}
                        >
                          Eingaben ändern
                        </Button>
                        {/* Button: Cancel dialog */}
                        <Button
                          onClick={() => {
                            handleReset();
                            handleClose();
                          }}
                          className={classes.buttons2}
                        >
                          Abbrechen
                        </Button>
                        {/* Button: Safe evaluation results */}
                        <Button
                          onClick={() => {
                            saveEvaluationResults();
                            handleReset();
                            handleClose();
                          }}
                          className={classes.buttons2}
                        >
                          Evaluationsergebnisse speichern
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
                          {/* Button: Decrease step */}
                          <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            className={classes.buttons}
                          >
                            Zurück
                          </Button>
                          {/* Button: Increase step */}
                          <Button
                            onClick={handleNext}
                            className={classes.buttons}
                          >
                            Weiter
                          </Button>
                        </Grid>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                {/* If conditions are not met (e.g. if not every atomic component is
                  assigned to a plastic type),  */}
                <Grid container item xs={12} justify="center">
                  <Typography className={classes.instructions}>
                    Bitte ordnen Sie zuerst jeder atomaren Komponente einen
                    Rohstoff zu.
                  </Typography>
                  <Button onClick={handleClose} className={classes.buttons}>
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
export default EvaluationDialog;
