import {
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputBase,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  fade,
  makeStyles,
} from "@material-ui/core";
import React, { Fragment, useEffect, useState } from "react";

import Autocomplete from "@material-ui/lab/Autocomplete";
import autocompleteData from "../../files/search_plast_data.json";
import colors from "../../variables/colors";
import materialData from "../../files/plast.json";

const useStyles = makeStyles((theme) => ({
  filterContainer: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  gridContainer: {
    padding: theme.spacing(8),
  },
  inputInput: {
    [theme.breakpoints.up("md")]: {
      width: "100%",
    },
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
  inputRoot: {
    color: "inherit",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  search: {
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    backgroundColor: fade(theme.palette.common.white, 0.15),
    borderRadius: theme.shape.borderRadius,
    marginLeft: 0,
    marginRight: theme.spacing(2),
    position: "relative",
    width: "100%",
  },
  searchIcon: {
    alignItems: "center",
    display: "flex",
    height: "100%",
    justifyContent: "center",
    padding: theme.spacing(0, 2),
    pointerEvents: "none",
    position: "absolute",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Result = (props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data, filter } = props;

  const handleClose = () => {
    setDialogOpen(false);
    console.log(filter);
    console.log(data);
  };

  const setNewMaterial = () => {
    const req = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newMaterial: data,
      }),
    };

    fetch("/results", req)
      .then((res) => res.json())
      .then((json) => console.log(json));
  };

  return (
    <Fragment>
      <Dialog
        open={dialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{data.mat_desc}</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Key</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(filter)
                // .filter((e) => e !== "search")
                .map((e) => {
                  // console.log(e);
                  return (
                    <TableRow>
                      <TableCell>
                        <Typography>{e}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{data[e] ? data[e] : "Nicht verfügbar"}</Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Schließen
          </Button>
        </DialogActions>
      </Dialog>
      <Grid item xs={12} md={6} lg={4} xl={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              {data.id}
            </Typography>
            <Typography variant="body2" component="p">
              {data.mat_desc}
            </Typography>
            <Typography variant="body2" component="p">
              {data.campus_fam}
            </Typography>
            <Typography variant="body2" component="p">
              {data.producer}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" variant="outlined" onClick={() => setDialogOpen(true)}>
              <Typography variant="body2">Mehr erfahren</Typography>
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={setNewMaterial}
              style={{ backgroundColor: colors.lightGreen, color: colors.lightGrey }}
            >
              <Typography variant="body">Auswählen</Typography>
            </Button>
          </CardActions>
        </Card>
      </Grid>{" "}
    </Fragment>
  );
};

const SearchField = (props) => {
  return (
    <Grid item xs={12}>
      {/* <Autocomplete
        id="combo-box-demo"
        options={top100Films}
        getOptionLabel={(option) => option}
        style={{ width: 300 }}
        renderInput={(params) => (
          <TextField
            id="filled-name"
            label={props.placeholder}
            // value={props.value}
            // onChange={props.onChange}
            variant="filled"
            fullWidth
          />
        )}
      /> */}

      <Autocomplete
        options={props.options}
        getOptionLabel={(option) => option}
        value={props.value}
        onChange={(event, newValue) => {
          props.onChange(newValue);
        }}
        renderInput={(params) => <TextField {...params} label={props.placeholder} margin="normal" />}
      />

      {/* <TextField label={props.placeholder} margin="normal" value={props.value} onChange={props.onChange} /> */}
    </Grid>
  );
};

const Filter = (props) => {
  const [dropdownKeys, setDropdownKeys] = useState([]);
  const [sliderValue, setSliderValue] = useState([0, 10]);
  const [sliderRange, setSliderRange] = useState([0, 10]);
  const [dropdownSelection, setDropdownSelection] = useState("");
  const [data, setData] = useState({});
  const [loaded, setLoaded] = useState(false);


  useEffect(() => {
    // get dropdown options and slider range
    fetch(`/search/${props.suffix.toLowerCase()}`)
      .then((res) => res.json())
      .then((json) => {
        setDropdownKeys(Object.keys(json).map((elem) => elem));
        setData(json);
      })
      .then(() => setLoaded(true));
  }, []);

  // selecting first element by default
  // useEffect(() => {
  //   setDropdownSelection(dropdownKeys[0]);
  // }, [dropdownKeys]);

  useEffect(() => {
    if (loaded) {
      setSliderRange([data[dropdownSelection].min, data[dropdownSelection].max]);
      setSliderValue([data[dropdownSelection].min, data[dropdownSelection].max]);
    }
  }, [dropdownSelection]);


  const handleDropdownChange = (e) => {
    setDropdownSelection(e.target.value);
    props.handleDropdownChange(e.target.value);
  };

  const handleSliderChange = (e, newValue) => {
    setSliderValue(newValue);
    props.handleSliderChange(newValue); // makes the component really laggy
  };

  // const getSliderRange = () => {
  //   // There's no real number bigger than plus Infinity
  //   let lowest = Number.POSITIVE_INFINITY;
  //   let highest = Number.NEGATIVE_INFINITY;
  //   let tmp;
  //   for (let i = props.data.length - 1; i >= 0; i--) {
  //     tmp = props.data[i].Zugmodul_MPa_trocken;
  //     if (!tmp) continue;
  //     if (tmp < lowest) lowest = tmp;
  //     if (tmp > highest) highest = tmp;
  //   }
  //   return [lowest, highest];
  // };

  return (
    <Grid container spacing={2} item xs={12} direction="row" justify="center" alignItems="flex-end">
      <Grid item xs={12} sm={8}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">{props.suffix || ""}</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={dropdownSelection}
            onChange={handleDropdownChange}
          >
            {dropdownKeys.map((key) => (
              <MenuItem value={key} key={key}>
                {key}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Slider
          value={sliderValue}
          onChange={handleSliderChange}
          min={sliderRange[0]} //getMin
          max={sliderRange[1]} //getMax
          step={1}
          marks
          valueLabelDisplay="auto"
        ></Slider>
      </Grid>
    </Grid>
  );
};

export const Search = () => {

  const classes = useStyles();

  const [data, setData] = useState(materialData);

  const [filterActive, setFilterActive] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [sliderIdValue, setSliderIdValue] = useState(10);
  const [sliderFamValue, setSliderFamValue] = useState(10);

  const INITIAL_FILTER = {
    search: "",
    mat_desc: "",
    campus_fam: "",
    producer: "",
    verarbeitungsmethode: "",
  };
  const [filter, setFilter] = useState(INITIAL_FILTER);

  const [resultData, setResultData] = useState([]);



  const handleSearch = () => {
    // searchurl: /search?id=123&mat_desc=najksd&...&...&...&..&..&..
    // concatenate all params
    let params = [`producer=${filter.producer}`];
    params.push(`&mat_desc=${filter.mat_desc}`)
    params.push(`&campus_fam=${filter.campus_fam}`)
    console.log(params)
    for (let e in filter) {
      if (filter[e].dropdown) {
        params.push(`&${filter[e].dropdown}=${filter[e].min}`);
        params.push(`&${filter[e].dropdown}=${filter[e].max}`);
      }
    }

    fetch("/results?" + params.join(""))
      .then((res) => res.json())
      .then((json) => {
        console.log(json);

        //handle results and update display
        // updateResultData();
        setResultData(json);
      });
  };


















  const resetFilter = () => {
    // define default values/object for reset
    setFilter(INITIAL_FILTER);
  };

  // real time updating resulting in huge performance issues
  // useEffect(() => {
  //   getResultData();
  // }, [filter]);

  useEffect(() => {
    console.log("Result Data updated");
    console.log(filter);
  }, [resultData]);

  const updateResultData = () => {
    setResultData(
      data.filter((elem) => {
        return elem.mat_desc.toLowerCase().includes(filter.search.toLowerCase());
      })
    );
  };

  return (
    <Fragment>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid container item xs={12} md={6} spacing={1} className={classes.filterContainer}>
          <SearchField
            options={autocompleteData.mat_desc}
            value={filter.mat_desc}
            onChange={(newValue) => setFilter({ ...filter, mat_desc: newValue })}
            placeholder={"Materialbezeichnung"}
          />

          <SearchField
            options={autocompleteData.campus_fam}
            value={filter.campus_fam}
            onChange={(newValue) => setFilter({ ...filter, campus_fam: newValue })}
            placeholder={"Materialfamilie"}
          />
          <SearchField
            options={autocompleteData.producer}
            value={filter.producer}
            onChange={(newValue) => setFilter({ ...filter, producer: newValue })}
            placeholder={"Hersteller"}
          />
          <SearchField
            options={autocompleteData.verarbeitungsmethode}
            value={filter.verarbeitungsmethode}
            onChange={(newValue) => setFilter({ ...filter, verarbeitungsmethode: newValue })}
            placeholder={"Verarbeitungsmethode"}
          />
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleSearch}
              fullWidth
              style={{ backgroundColor: colors.lightGreen, color: colors.lightGrey }}
            >
              Suchen
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={resetFilter}
              fullWidth
              style={{ backgroundColor: colors.red, color: colors.lightGrey }}
            >
              Suche zurücksetzen
            </Button>
          </Grid>
        </Grid>
        <Grid container item xs={12} md={6} spacing={1} className={classes.filterContainer}>
          <Grid item xs={12}>
            <Divider variant="fullWidth" orientation="horizontal" />
          </Grid>

          <Filter
            data={data}
            suffix="Zugmodul"
            value={filter.zugmodul}
            handleDropdownChange={(val) => setFilter({ ...filter, zugmodul: { ...filter.zugmodul, dropdown: val } })}
            handleSliderChange={(val) =>
              setFilter({ ...filter, zugmodul: { ...filter.zugmodul, min: val[0], max: val[1] } })
            }
          ></Filter>
    

          <Grid item xs={12}>
            <Divider variant="fullWidth" orientation="horizontal" />
          </Grid>
          <Filter
            data={data}
            suffix="Bruchdehnung"
            value={filter.bruchdehnung}
            handleDropdownChange={(val) =>
              setFilter({ ...filter, bruchdehnung: { ...filter.bruchdehnung, dropdown: val } })
            }
            handleSliderChange={(val) =>
              setFilter({ ...filter, bruchdehnung: { ...filter.bruchdehnung, min: val[0], max: val[1] } })
            }
          ></Filter>{" "}
          <Grid item xs={12}>
            <Divider variant="fullWidth" orientation="horizontal" />
          </Grid>
          <Filter
            data={data}
            suffix="Bruchspannung"
            value={filter.bruchspannung}
            handleDropdownChange={(val) =>
              setFilter({ ...filter, bruchspannung: { ...filter.bruchspannung, dropdown: val } })
            }
            handleSliderChange={(val) =>
              setFilter({ ...filter, bruchspannung: { ...filter.bruchspannung, min: val[0], max: val[1] } })
            }
          ></Filter>{" "}
          <Grid item xs={12}>
            <Divider variant="fullWidth" orientation="horizontal" />
          </Grid>
          <Filter
            data={data}
            suffix="Belastung"
            value={filter.belastung}
            handleDropdownChange={(val) => setFilter({ ...filter, belastung: { ...filter.belastung, dropdown: val } })}
            handleSliderChange={(val) =>
              setFilter({ ...filter, belastung: { ...filter.belastung, min: val[0], max: val[1] } })
            }
          ></Filter>{" "}
          <Grid item xs={12}>
            <Divider variant="fullWidth" orientation="horizontal" />
          </Grid>
          <Filter
            data={data}
            suffix="Temperatur"
            value={filter.temperatur}
            handleDropdownChange={(val) =>
              setFilter({ ...filter, temperatur: { ...filter.temperatur, dropdown: val } })
            }
            handleSliderChange={(val) =>
              setFilter({ ...filter, temperatur: { ...filter.temperatur, min: val[0], max: val[1] } })
            }
          ></Filter>{" "}
          <Grid item xs={12}>
            <Divider variant="fullWidth" orientation="horizontal" />
          </Grid>
          <Filter
            data={data}
            value={filter.dichte}
            suffix="Dichte"
            handleDropdownChange={(val) => setFilter({ ...filter, dichte: { ...filter.dichte, dropdown: val } })}
            handleSliderChange={(val) =>
              setFilter({ ...filter, dichte: { ...filter.dichte, min: val[0], max: val[1] } })
            }
          ></Filter>{" "}
          <Grid item xs={12}>
            <Divider variant="fullWidth" orientation="horizontal" />
          </Grid>
          <Filter
            data={data}
            value={filter.MVR}
            suffix="MVR"
            handleDropdownChange={(val) => setFilter({ ...filter, MVR: { ...filter.MVR, dropdown: val } })}
            handleSliderChange={(val) => setFilter({ ...filter, MVR: { ...filter.MVR, min: val[0], max: val[1] } })}
          ></Filter>{" "}
          <Grid item xs={12}>
            <Divider variant="fullWidth" orientation="horizontal" />
          </Grid>
        </Grid>
      </Grid>

      <Grid container direction="row" justify="flex-start" alignItems="flex-start" spacing={4}>
        <Grid container spacing={4} item xs={12}>
          {resultData.map((result) => {
            return <Result data={result} filter={filter} key={result.id} />;
          })}
        </Grid>
      </Grid>
    </Fragment>
  );
};
