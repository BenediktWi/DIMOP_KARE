import React, { useState, useContext, useEffect } from "react";

import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { CircularProgress } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";

import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { withStyles } from "@material-ui/core/styles";

import listAlternatives_JSON from "../../files/table_projektinfos.json";

import { ConstructionContext } from "../../views/Construction/ConstructionContext";
import { APIContext } from "../../APIContext";

const StyledRating = withStyles({
  iconFilled: {
    color: "#ff6d75",
  },
  iconHover: {
    color: "#ff3d47",
  },
})(Rating);

const useStyles = makeStyles((theme) => ({
  mainwindow: {
    padding: 20,
    minHeight: "calc(100vh - 115px - 100px)",
    height: "100%",
    paddingBottom: 0,
    textAlign: "left",
  },
  divider: {
    margin: 0,
    marginTop: 15,
  },
  progress: {
    textAlign: "center",
    justifyContent: "center",
    padding: 15,
  },
  buttons: {
    borderColor: "#005000",
    color: "#005000",
    textTransform: "none",
    marginLeft: 20,
  },
  label: { marginTop: 10 },
  formControl: {
    marginBottom: theme.spacing(1),
    minWidth: 300,
    maxWidth: 500,
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 500,
    },
  },
};

export default function ConstructionEvaluation() {
  // get debugging API variable
  const { use_API, API_Host } = useContext(APIContext);
  const [useAPI, setUseAPI] = use_API;
  const [APIHost, setAPIHost] = API_Host;

  // get managed states from context
  const { loaded_cons } = useContext(ConstructionContext);
  const [loadedCons, setLoadedCons] = loaded_cons;

  // states for ratings
  const classes = useStyles();

  const [listAlternatives, setListAlternatives] = useState([]);
  const [dropdownDataSource, setDropdownDataSource] = useState();
  const [labelEvaluation, setLabelEvaluation] = useState("");
  const [apiDataLoadedDropdown, setApiDataLoadedDropdown] = useState(false);
  const [listDropdownData, setListDropdownData] = useState([]);
  const [evaluationRatings, setEvaluationRatings] = useState({
    recycling: 2,
    co2: 2,
    preis: 2,
  });

  // transform user data for dropdown
  const transformDropdownData = (data) => {
    if (data !== null && data.length !== 0) {
      // get key/text/value as keys for using in dropdown
      const source = data.map(
        (item) =>
          item.bom_al + " - " + item.mat_desc + " (" + item.mara_nr + ")"
      );
      setListDropdownData(source);
      setDropdownDataSource(data);
      setLabelEvaluation("");
    } else setListDropdownData();
  };

  // useEffect for API Connection
  useEffect(() => {
    if (Object.keys(loadedCons).length !== 0) {
      if (useAPI) {
        fetch(APIHost + "/bomal/" + loadedCons.id)
          .then((res) => res.json())
          .then((data) => {
            transformDropdownData(data);
            const timer = setTimeout(() => {
              // console.log('This will run after 1 second!')
              setApiDataLoadedDropdown(true);
            }, 1000);
            return () => clearTimeout(timer);
          })
          .catch(console.log);
      } else {
        // if no api, use json
        transformDropdownData(listAlternatives_JSON.Table_Projekt_Info_Data);
        setApiDataLoadedDropdown(true);
      }
    } else {
      setLabelEvaluation("Bitte wählen Sie zuvor eine Konstruktion.");
      setApiDataLoadedDropdown(true);
    }
  }, [loadedCons]);

  // manage checkbox clicking
  const handleChange = (event) => {
    setListAlternatives(event.target.value);
  };

  // click button evaluate
  const handleClickEvaluate = () => {
    console.log(listAlternatives);
    console.log(evaluationRatings);
  };

  // construction evaluation html code
  return (
    <div className={classes.mainwindow}>
      {!apiDataLoadedDropdown & useAPI ? (
        <div className={classes.progress}>
          <CircularProgress />
          <br />
        </div>
      ) : (
        <div>
          <Grid container>
            <Grid item xs={8}>
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-mutiple-checkbox-label">
                  Alternativen
                </InputLabel>
                <Select
                  labelId="demo-mutiple-checkbox-label"
                  id="demo-mutiple-checkbox"
                  multiple
                  value={listAlternatives}
                  onChange={handleChange}
                  input={<Input />}
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                >
                  {listDropdownData.map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={listAlternatives.indexOf(name) > -1} />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid
              item
              xs={2}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                variant="outlined"
                className={classes.buttons}
                onClick={handleClickEvaluate}
              >
                Vergleichen
              </Button>
            </Grid>
          </Grid>
          <p
            className={classes.label}
            style={{
              margin: 0,
              paddingBottom: 15,
            }}
          >
            {labelEvaluation}
          </p>
          <Grid container>
            <Grid item xs={6}>
              <Box
                component="fieldset"
                mb={3}
                borderColor="transparent"
                style={{ margin: 0, padding: 0 }}
              >
                <Typography component="legend">Recycling-Wert</Typography>
                <StyledRating
                  name="recycling"
                  value={evaluationRatings.recycling}
                  onChange={(event, newValue) => {
                    setEvaluationRatings({
                      ...evaluationRatings,
                      ["recycling"]: newValue,
                    });
                  }}
                  precision={1}
                  icon={<FiberManualRecordIcon fontSize="inherit" />}
                />
              </Box>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <Box
                component="fieldset"
                mb={3}
                borderColor="transparent"
                style={{ margin: 0, padding: 0 }}
              >
                <Typography component="legend">CO2-Wert</Typography>
                <StyledRating
                  name="co2"
                  value={evaluationRatings.co2}
                  onChange={(event, newValue) => {
                    setEvaluationRatings({
                      ...evaluationRatings,
                      ["co2"]: newValue,
                    });
                  }}
                  precision={1}
                  icon={<FiberManualRecordIcon fontSize="inherit" />}
                />
              </Box>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <Box
                component="fieldset"
                mb={3}
                borderColor="transparent"
                style={{ margin: 0, padding: 0 }}
              >
                <Typography component="legend">Preis</Typography>
                <StyledRating
                  name="preis"
                  value={evaluationRatings.preis}
                  onChange={(event, newValue) => {
                    setEvaluationRatings({
                      ...evaluationRatings,
                      ["preis"]: newValue,
                    });
                  }}
                  precision={1}
                  icon={<FiberManualRecordIcon fontSize="inherit" />}
                />
              </Box>
            </Grid>
          </Grid>
        </div>
      )}
      <Divider variant="middle" className={classes.divider} />
    </div>
  );
}
