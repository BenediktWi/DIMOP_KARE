// Contains UI for materials search

// Import react components
import React, { useContext, useState } from "react";

// Import own components
import { MainContext } from "./MainContext.jsx";

// Import material ui components
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Button, Slider } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import PolymerIcon from "@material-ui/icons/Polymer";
import SearchIcon from "@material-ui/icons/Search";
import LoopIcon from "@material-ui/icons/Loop";

// Import autocomplete data
import autocompleteData from "../../files/search_plast_data.json";

// Import devexpress components
import {
  SelectionState,
  FilteringState,
  IntegratedFiltering,
} from "@devexpress/dx-react-grid";
import {
  Grid as GridDevExpress,
  Table,
  TableSelection,
  TableColumnVisibility,
  ColumnChooser,
  TableHeaderRow,
  TableFilterRow,
  Toolbar,
} from "@devexpress/dx-react-grid-material-ui";

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
    margin: 5,
    height: 60,
    width: 120,
  },
  textfield: { margin: 10, padding: 0, background: "white" },
}));

// Component MaterialSearch
const MaterialSearch = () => {

  // Declare variable for useStyles
  const classes = useStyles();

  // Import global variables via useContext
  const { search_dialog_open, parent_material, bom_updated } = useContext(
    MainContext
  );

  // Declare variables imported from MainContext.jsx
  const [searchDialogOpen, setSearchDialogOpen] = search_dialog_open;
  const [parentMaterial, setParentMaterial] = parent_material;
  const [bomUpdated, setBomUpdated] = bom_updated;

  // Declare variables
  const [matDesc, setMatDesc] = useState("");
  const [campusFam, setCampusFam] = useState("");
  const [producer, setProducer] = useState("");
  const [method, setMethod] = useState("");
  const [resultData, setResultData] = useState([]);
  const [resultCount, setResultCount] = useState(0);
  const [resultsReturned, setResultsReturned] = useState(false);
  const [selection, setSelection] = useState([]);

  // For the following variables I looked up the min/max
  // values in the data base and hardcored these
  const [zugmodul, setZugmodul] = useState("");
  const [zugmodulSliderRange, setZugmodulSliderRange] = useState([0, 110000]);
  const [zugmodulSliderValue, setZugmodulSliderValue] = useState([
    zugmodulSliderRange[0],
    zugmodulSliderRange[1],
  ]);
  const [bruchspannung, setBruchspannung] = useState("");
  const [bruchspannungSliderRange, setBruchspannungSliderRange] = useState([
    6.0,
    1750.0,
  ]);
  const [bruchspannungSliderValue, setBruchspannungSliderValue] = useState([
    bruchspannungSliderRange[0],
    bruchspannungSliderRange[1],
  ]);
  const [bruchdehnung, setBruchdehnung] = useState("");
  const [bruchdehnungSliderRange, setBruchdehnungSliderRange] = useState([
    0.3,
    47000.0,
  ]);
  const [bruchdehnungSliderValue, setBruchdehnungSliderValue] = useState([
    bruchdehnungSliderRange[0],
    bruchdehnungSliderRange[1],
  ]);
  const [mvr, setMvr] = useState("");
  const [mvrSliderRange, setMvrSliderRange] = useState([0.1, 290.0]);
  const [mvrSliderValue, setMvrSliderValue] = useState([
    mvrSliderRange[0],
    mvrSliderRange[1],
  ]);
  const [dichte, setDichte] = useState("");
  const [dichteSliderRange, setDichteSliderRange] = useState([700.0, 3150.0]);
  const [dichteSliderValue, setDichteSliderValue] = useState([
    dichteSliderRange[0],
    dichteSliderRange[1],
  ]);
  const [belastung, setBelastung] = useState("");
  const [belastungSliderRange, setBelastungSliderRange] = useState([1.2, 21.6]);
  const [belastungSliderValue, setBelastungSliderValue] = useState([
    belastungSliderRange[0],
    belastungSliderRange[1],
  ]);
  const [temperatur, setTemperatur] = useState("");
  const [temperaturSliderRange, setTemperaturSliderRange] = useState([
    160.0,
    400.0,
  ]);
  const [temperaturSliderValue, setTemperaturSliderValue] = useState([
    temperaturSliderRange[0],
    temperaturSliderRange[1],
  ]);

  // Assign a plastic to a material
  const addPlast = () => {
    if (selection.length == 1) {
      var requestOptions = {
        method: "PUT",
        redirect: "follow",
      };

      fetch(
        "/mat/" + parentMaterial + "?mara_plast_id=" + resultData[selection].id,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));

      setBomUpdated(true);
    } else {
      console.log("Nope");
    }
  };

  // Handle if search dialog is closed 
  const handleClickPlastClose = () => {
    setSearchDialogOpen(false);
  };

  // Initiates search based on given specification using search.py
  const initiateSearch = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mat_desc: matDesc,
        campus_fam: campusFam,
        producer: producer,
        verarbeitungsmethode: method,
        zugmodul: zugmodul,
        zugmodul_min: zugmodulSliderValue[0],
        zugmodul_max: zugmodulSliderValue[1],
        bruchspannung: bruchspannung,
        bruchspannung_min: bruchspannungSliderValue[0],
        bruchspannung_max: bruchspannungSliderValue[1],
        bruchdehnung: bruchdehnung,
        bruchdehnung_min: bruchdehnungSliderValue[0],
        bruchdehnung_max: bruchdehnungSliderValue[1],
        mvr: mvr,
        mvr_min: mvrSliderValue[0],
        mvr_max: mvrSliderValue[1],
        dichte: dichte,
        dichte_min: dichteSliderValue[0],
        dichte_max: dichteSliderValue[1],
        belastung: belastung,
        belastung_min: belastungSliderValue[0],
        belastung_max: belastungSliderValue[1],
        temperatur: temperatur,
        temperatur_min: temperaturSliderValue[0],
        temperatur_max: temperaturSliderValue[1],
      }),
      redirect: "follow",
    };

    fetch("/search", requestOptions)
      .then((res) => {
        return res.json();
      })
      .then((d) => {
        console.log(d);
        setResultData(d);
        console.log(resultData);
        setResultCount(Object.keys(d).length);
        setResultsReturned(true);
      });
  };

  // Resets search
  const resetSearch = () => {
    setMatDesc("");
    setCampusFam("");
    setProducer("");
    setMethod("");
    setZugmodul("");
    setBruchspannung("");
    setBruchdehnung("");
    setMvr("");
    setDichte("");
    setBelastung("");
    setTemperatur("");
    setZugmodulSliderValue([zugmodulSliderRange[0], zugmodulSliderRange[1]]);
    setBruchspannungSliderValue([
      bruchspannungSliderRange[0],
      bruchspannungSliderRange[1],
    ]);
    setBruchdehnungSliderValue([
      bruchdehnungSliderRange[0],
      bruchdehnungSliderRange[1],
    ]);
    setMvrSliderValue([mvrSliderRange[0], mvrSliderRange[1]]);
    setBelastungSliderValue([belastungSliderRange[0], belastungSliderRange[1]]);
    setDichteSliderValue([dichteSliderRange[0], dichteSliderRange[1]]);
    setTemperaturSliderValue([
      temperaturSliderRange[0],
      temperaturSliderRange[1],
    ]);
    setResultData([]);
    setResultsReturned(false);
  };

  // Define columns for result data
  const [resultColumns] = useState([
    { name: "id", title: "ID" },
    { name: "mat_desc", title: "Mat.Beschreibung" },
    { name: "mat_int_desc", title: "Mat.Beschreibung(Intern)" },
    { name: "campus_fam", title: "Kunstst.Fam." },
    { name: "producer", title: "Hersteller" },
    { name: "Verarbeitungsmethode", title: "Verarbeitungsmeth." },
    { name: "dichte_trocken", title: "Dichte(trocken)" },
    { name: "dichte_konditioniert", title: "Dichte(kond.)" },
    { name: "Belastung_trocken", title: "Belastung(trocken)" },
    { name: "Belastung_konditioniert", title: "Belastung(kond.)" },
    { name: "Temperatur_trocken", title: "Temperatur(trocken)" },
    { name: "Temperatur_konditioniert", title: "Temperatur(kond.)" },
    { name: "MVR_trocken", title: "MVR(trocken)" },
    { name: "MVR_konditioniert", title: "MVR(kond.)" },
    { name: "Bruchdehnung_trocken", title: "Bruchdehn.(trocken)" },
    { name: "Bruchdehnung_konditioniert", title: "Bruchdehn.(kond.)" },
    {
      name: "Bruchdehnung_Nominell_trocken",
      title: "Bruchdehnung.nomin.(trocken)",
    },
    {
      name: "Bruchdehnung_Nominell_konditioniert",
      title: "Bruchdehn.nomin.(kond.)",
    },
    { name: "Bruchdehnung_TPE_trocken", title: "Bruchdehn.TPE(trocken)" },
    { name: "Bruchdehnung_TPE_konditioniert", title: "Bruchdehn.TPE(kond.)" },
    { name: "Bruchdehnung_Parallel_trocken", title: "Bruchdehn.par.(trocken)" },
    {
      name: "Bruchdehnung_Parallel_konditioniert",
      title: "Bruchdehn.par.(kond.)",
    },
    { name: "Bruchspannung_MPa_trocken", title: "Bruchsp.MPa(trocken)" },
    { name: "Bruchspannung_MPa_konditioniert", title: "Bruchsp.MPa(kond.)" },
    {
      name: "Bruchspannung_TPE_MPa_trocken",
      title: "Bruchsp.TPE/MPa(trocken)",
    },
    {
      name: "Bruchspannung_TPE_MPa_konditioniert",
      title: "Bruchsp.TPE/MPa(kond.)",
    },
    {
      name: "Bruchspannung_Parallel_MPa_trocken",
      title: "Bruchsp.par.MPa(trocken)",
    },
    {
      name: "Bruchspannung_Parallel_MPa_konditioniert",
      title: "Bruchsp.par.MPa(kond.)",
    },
    {
      name: "Bruchspannung_Senkrecht_MPa_trocken",
      title: "Bruchsp.senk.MPa(trocken)",
    },
    {
      name: "Bruchspannung_Senkrecht_MPa_konditioniert",
      title: "Bruchsp.senk.MPa(kond.)",
    },
    { name: "Zugmodul_MPa_trocken", title: "Zugmod.MPa(trocken)" },
    { name: "Zugmodul_MPa_konditioniert", title: "Zugmod.MPa(kond.)" },
    {
      name: "Zugmodul_Kriech_1h_MPa_trocken",
      title: "Zugmod.Kriech.1h.MPa(trocken)",
    },
    {
      name: "Zugmodul_Kriech_1h_MPa_konditioniert",
      title: "Zugmod.Kriech.1h.MPa(kond.)",
    },
    {
      name: "Zugmodul_Kriech_1000h_MPa_trocken",
      title: "Zugmod.Kriech.1000h.MPa(trocken)",
    },
    {
      name: "Zugmodul_Kriech_1000h_MPa_konditioniert",
      title: "Zugmod.Kriech.1000h.MPa(kond.)",
    },
    { name: "Zugmodul_Parallel_MPa_trocken", title: "Zugmod.par.MPa(trocken)" },
    {
      name: "Zugmodul_Parallel_MPa_konditioniert",
      title: "Zugmod.par.MPa(kond.)",
    },
    {
      name: "Zugmodul_Senkrecht_MPa_trocken",
      title: "Zugmod.senk.MPa(trocken)",
    },
    {
      name: "Zugmodul_Senkrecht_MPa_konditioniert",
      title: "Zugmod.senk.MPa(kond.)",
    },
  ]);

  return (
    <div>
      <Grid container item xs={12}>
        {/* Contains text fields for search */}
        <Grid item xs={3}>
          <Autocomplete
            id="mat_desc"
            options={autocompleteData.mat_desc}
            getOptionLabel={(option) => option}
            onChange={(event) => setMatDesc(event.target.textContent)}
            value={matDesc}
            renderInput={(params) => (
              <TextField
                {...params}
                className={classes.textfield}
                label="Materialbeschreibung"
                margin="normal"
              />
            )}
          />
          <Autocomplete
            id="campus_fam"
            options={autocompleteData.campus_fam}
            getOptionLabel={(option) => option}
            onChange={(event) => setCampusFam(event.target.textContent)}
            value={campusFam}
            renderInput={(params) => (
              <TextField
                {...params}
                className={classes.textfield}
                label="Kunststofffamilie"
                margin="normal"
              />
            )}
          />
          <Autocomplete
            id="producer"
            options={autocompleteData.producer}
            getOptionLabel={(option) => option}
            onChange={(event) => setProducer(event.target.textContent)}
            value={producer}
            renderInput={(params) => (
              <TextField
                {...params}
                className={classes.textfield}
                label="Hersteller"
                margin="normal"
              />
            )}
          />
          <Autocomplete
            id="method"
            options={autocompleteData.verarbeitungsmethode}
            getOptionLabel={(option) => option}
            onChange={(event) => setMethod(event.target.textContent)}
            value={method}
            renderInput={(params) => (
              <TextField
                {...params}
                className={classes.textfield}
                label="Verarbeitungsmethode"
                margin="normal"
              />
            )}
          />
        </Grid>
        <Grid item xs={1}></Grid>
        {/* Contains property fields (zugmodul etc.) for search */}
        <Grid item xs={8}>
          <Grid container item xs={12}>
            <Grid item xs={5}>
              <Autocomplete
                id="zugmodul"
                options={autocompleteData.zugmodul}
                getOptionLabel={(option) => option}
                onChange={(event) => {
                  setZugmodul(event.target.textContent);
                }}
                value={zugmodul}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className={classes.textfield}
                    label="Zugmodul"
                    margin="normal"
                  />
                )}
              />
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={6}>
              <Typography id="range-slider" gutterBottom>
                Zugmodul
              </Typography>
              <Slider
                value={zugmodulSliderValue}
                onChange={(event, newValue) => {
                  setZugmodulSliderValue(newValue);
                }}
                min={zugmodulSliderRange[0]}
                max={zugmodulSliderRange[1]}
                step={10}
                valueLabelDisplay="auto"
              ></Slider>
            </Grid>
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={5}>
              <Autocomplete
                id="bruchspannung"
                options={autocompleteData.bruchspannung}
                getOptionLabel={(option) => option}
                onChange={(event) => setBruchspannung(event.target.textContent)}
                value={bruchspannung}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className={classes.textfield}
                    label="Bruchspannung"
                    margin="normal"
                  />
                )}
              />
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={6}>
              <Typography id="range-slider" gutterBottom>
                Bruchspannung
              </Typography>
              <Slider
                value={bruchspannungSliderValue}
                onChange={(event, newValue) => {
                  setBruchspannungSliderValue(newValue);
                }}
                min={bruchspannungSliderRange[0]}
                max={bruchspannungSliderRange[1]}
                step={1}
                valueLabelDisplay="auto"
              ></Slider>
            </Grid>
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={5}>
              <Autocomplete
                id="bruchdehnung"
                options={autocompleteData.bruchdehnung}
                getOptionLabel={(option) => option}
                onChange={(event) => setBruchdehnung(event.target.textContent)}
                value={bruchdehnung}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className={classes.textfield}
                    label="Bruchdehnung"
                    margin="normal"
                  />
                )}
              />
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={6}>
              <Typography id="range-slider" gutterBottom>
                Bruchdehnung
              </Typography>
              <Slider
                value={bruchdehnungSliderValue}
                onChange={(event, newValue) => {
                  setBruchdehnungSliderValue(newValue);
                }}
                min={bruchdehnungSliderRange[0]}
                max={bruchdehnungSliderRange[1]}
                step={10}
                valueLabelDisplay="auto"
              ></Slider>
            </Grid>
          </Grid>

          <Grid container item xs={12}>
            <Grid item xs={5}>
              {" "}
              <Autocomplete
                id="mvr"
                options={autocompleteData.mvr}
                getOptionLabel={(option) => option}
                onChange={(event) => setMvr(event.target.textContent)}
                value={mvr}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className={classes.textfield}
                    label="MVR"
                    margin="normal"
                  />
                )}
              />
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={6}>
              {" "}
              <Typography id="range-slider" gutterBottom>
                MVR
              </Typography>
              <Slider
                value={mvrSliderValue}
                onChange={(event, newValue) => {
                  setMvrSliderValue(newValue);
                }}
                min={mvrSliderRange[0]}
                max={mvrSliderRange[1]}
                step={1}
                valueLabelDisplay="auto"
              ></Slider>
            </Grid>
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={5}>
              <Autocomplete
                id="dichte"
                options={autocompleteData.dichte}
                getOptionLabel={(option) => option}
                onChange={(event) => setDichte(event.target.textContent)}
                value={dichte}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className={classes.textfield}
                    label="Dichte"
                    margin="normal"
                  />
                )}
              />
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={6}>
              <Typography id="range-slider" gutterBottom>
                Dichte
              </Typography>
              <Slider
                value={dichteSliderValue}
                onChange={(event, newValue) => {
                  setDichteSliderValue(newValue);
                }}
                min={dichteSliderRange[0]}
                max={dichteSliderRange[1]}
                step={1}
                valueLabelDisplay="auto"
              ></Slider>
            </Grid>
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={5}>
              {" "}
              <Autocomplete
                id="belastung"
                options={autocompleteData.belastung}
                getOptionLabel={(option) => option}
                onChange={(event) => setBelastung(event.target.textContent)}
                value={belastung}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className={classes.textfield}
                    label="Belastung"
                    margin="normal"
                  />
                )}
              />
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={6}>
              {" "}
              <Typography id="range-slider" gutterBottom>
                Belastung
              </Typography>
              <Slider
                value={belastungSliderValue}
                onChange={(event, newValue) => {
                  setBelastungSliderValue(newValue);
                }}
                min={belastungSliderRange[0]}
                max={belastungSliderRange[1]}
                step={1}
                valueLabelDisplay="auto"
              ></Slider>
            </Grid>
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={5}>
              <Autocomplete
                id="temperatur"
                options={autocompleteData.temperatur}
                getOptionLabel={(option) => option}
                onChange={(event) => setTemperatur(event.target.textContent)}
                value={temperatur}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className={classes.textfield}
                    label="Temperatur"
                    margin="normal"
                  />
                )}
              />
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={6}>
              {" "}
              <Typography id="range-slider" gutterBottom>
                Temperatur
              </Typography>
              <Slider
                value={temperaturSliderValue}
                onChange={(event, newValue) => {
                  setTemperaturSliderValue(newValue);
                }}
                min={temperaturSliderRange[0]}
                max={temperaturSliderRange[1]}
                step={1}
                valueLabelDisplay="auto"
              ></Slider>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* Contains buttons to navigate search */}
      <Grid container item xs={12} style={{ marginTop: 40 }}>
        <Grid
          container
          item
          xs={12}
          justify="center"
          alignContent="center"
          alignItems="center"
        >
          {/* Button: Resets specifications */}
          <Button className={classes.buttons} style={{ marginRight: 30 }} onClick={resetSearch}>
            <LoopIcon style={{ marginRight: 5 }}></LoopIcon>
            Zurücksetzen
          </Button>{" "}
          {/* Button: Initiate search */}
          <Button className={classes.buttons} onClick={initiateSearch}>
            <SearchIcon style={{ marginRight: 5 }}></SearchIcon>
            Suche starten
          </Button>{" "}
          {/* Button: Assign selected plastic to material */}
          <Button
            className={classes.buttons}
            style={{ marginLeft: 30 }}
            onClick={() => {
              addPlast();
              handleClickPlastClose();
            }}
          >
            <PolymerIcon style={{ marginRight: 5 }}></PolymerIcon>
            Zuweisen
          </Button>
        </Grid>
      </Grid>
      {/* Shows how many hits were found */}
      <Grid
        container
        item
        xs={12}
        justify="center"
        alignItems="center"
        alignContent="center"
      >
        {resultsReturned == false ? (
          <div></div>
        ) : (
          <div style={{ color: "black", marginTop: 35 }}>
            {" "}
            Es wurden {resultCount} Ergebnisse mit Ihren Spezifikationen
            gefunden.
          </div>
        )}
      </Grid>
      {/* Contains result table */}
      <Grid container item xs={12}>
        <GridDevExpress rows={resultData} columns={resultColumns}>
          <SelectionState
            selection={selection}
            onSelectionChange={setSelection}
          />
          <FilteringState defaultFilters={[]} />
          <IntegratedFiltering />
          <Table />
          <TableSelection />
          <TableColumnVisibility />
          <Toolbar />
          <ColumnChooser />
          <TableFilterRow />
          <TableHeaderRow />
        </GridDevExpress>
      </Grid>
    </div>
  );
};

export default MaterialSearch;
