import React, { useState, useContext, useEffect } from "react";

import Button from "@material-ui/core/Button";
import { Grid } from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Slider from "@material-ui/core/Slider";
import Paper from "@material-ui/core/Paper";
import { CircularProgress } from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";

import { APIContext } from "../../APIContext";
import { ConstructionContext } from "../../views/Construction/ConstructionContext";

import SearchMaterial_JSON from "../../files/searchmaterial.json";
import FilterColumns from "./FilterColumns_OUTDATED";
import TableMaterialSearch from "./Table_MaterialSearch_OUTDATED";

import moment from "moment";

const useStyles = makeStyles((theme) => ({
  mainwindow: {
    padding: 20,
    minHeight: "calc(100vh - 115px - 100px)",
    height: "100%",
    paddingBottom: 0,
    textAlign: "left",
    color: "white",
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },
  container_paper: {
    textAlign: "center",
    margin: 0,
    padding: 0,
    alignItems: "end",
    display: "flex",
  },
  container_papercontent: {
    background: "white",
    height: "100%",
  },
  paper: {
    width: "100%",
    height: "70%",
  },
  divider: {
    margin: 0,
    marginTop: 15,
    marginBottom: 15,
  },
  buttons: {
    borderColor: "#005000",
    color: "#005000",
    background: "white",
    textTransform: "none",
    marginLeft: 20,
    marginTop: 20,
  },
  text: {
    color: "white",
    textAlign: "left",
    paddingBottom: 0,
  },
  autocomplete: {
    color: "black",
    "& .MuiOutlinedInput-notchedOutline": {
      border: 0,
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      border: 0,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: 0,
    },
  },
  textfield: { margin: 0, padding: 0, background: "white" },
  autocomplete_value: {
    color: "black",
    paddingLeft: 10,
    "& .MuiOutlinedInput-notchedOutline": {
      border: 0,
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      border: 0,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: 0,
    },
  },
  textfield_value: { margin: 0, padding: 0, background: "white" },
  progress: {
    textAlign: "center",
    justifyContent: "center",
    padding: 5,
  },
  filterIcon: {
    textAlign: "right",
    paddingBottom: 15,
  },
}));

export default function MaterialSearch() {
  // get debugging API variable
  const { use_API, API_Host, API_User } = useContext(APIContext);
  const [useAPI, setUseAPI] = use_API;
  const [APIHost, setAPIHost] = API_Host;
  const [APIUser, setAPIUser] = API_User;

  // get managed states from context
  const {
    selected_material,
    search_material_columns,
    search_material_rows,
    need_refresh_search_material,
    search_material_api_loaded,
    open_filter_columns,
    filter_columns_show_columns,
    filter_columns_selected,
    search_material_columns_source,
    open_add_component,
    open_edit_component,
    open_search_material,
    use_selected_material,
    jump_to_material_search,
    open_add_cons,
  } = useContext(ConstructionContext);

  const [selectedMaterial, setSelectedMaterial] = selected_material;
  const [
    searchMaterialColumns,
    setSearchMaterialColumns,
  ] = search_material_columns;
  const [searchMaterialRows, setSearchMaterialRows] = search_material_rows;
  const [
    needRefreshSearchMaterial,
    setNeedRefreshSearchMaterial,
  ] = need_refresh_search_material;
  const [
    searchMaterialApiLoaded,
    setSearchMaterialApiLoaded,
  ] = search_material_api_loaded;
  const [openFilterColumns, setOpenFilterColumns] = open_filter_columns;
  const [
    filterColumnsShowColumns,
    setFilterColumnsShowColumns,
  ] = filter_columns_show_columns;
  const [
    filterColumnsSelected,
    setFilterColumnsSelected,
  ] = filter_columns_selected;
  const [
    searchMaterialColumnsSource,
    setSearchMaterialColumnsSource,
  ] = search_material_columns_source;
  const [openAddComponent, setOpenAddComponent] = open_add_component;
  const [openEditComponent, setOpenEditComponent] = open_edit_component;
  const [openSearchMaterial, setOpenSearchMaterial] = open_search_material;
  const [useSelectedMaterial, setUseSelectedMaterial] = use_selected_material;
  const [
    jumpToMaterialSearch,
    setJumpToMaterialSearch,
  ] = jump_to_material_search;
  const [openAddCons, setOpenAddCons] = open_add_cons;

  // states for search material
  const classes = useStyles();
  const [searchInput, setSearchInput] = useState({
    mat_desc: null,
    campus_fam: null,
    producer: null,
    Verarbeitungsmethode: null,
    art: null,
    Zugmodul: { cat: null, value: null, range: [0, 1] },
    Bruchdehnung: { cat: null, value: null, range: [0, 1] },
    MVR: { cat: null, value: null, range: [0, 1] },
    Bruchspannung: { cat: null, value: null, range: [0, 1] },
  });

  ////////////////////////////////// get json/api data & col for filters & table

  // get data from json /// for usage without api
  const rows_json = SearchMaterial_JSON.SearchMaterialData;
  const col_json = SearchMaterial_JSON.SearchMaterialColumns;
  const [apidataloaded, setapidataloaded] = useState(false);
  const [rowDataBackup, setRowDataBackup] = useState([]);

  // transform unix timestamp // not used yet
  const changeDt = (dt) => {
    if (dt !== null) {
      var newDate = moment(dt).format("DD.MM.YYYY HH:MM");
      return newDate;
    } else return dt;
  };

  // transform JSON/API Data
  const transformTableData = (data) => {
    if (data !== null) {
      setRowDataBackup(data);
      /* const source = data.map((item) => {
        return {
          mara_nr: item.mara_nr,
          mat_desc: item.mat_desc,
          bom_al: item.bom_al,
          creator: item.firstname + " " + item.surname,
          created_at: changeDt(item.created_at),
          updated_at: changeDt(item.updated_at),
          cad_nr: item.cad_nr,
        };
      }); */
      setSearchMaterialRows(data);
    } else setSearchMaterialRows([]);
  };

  // useEffect for managing rows
  useEffect(() => {
    setSelectedMaterial([]);
    if (useAPI) {
      fetch(APIHost + "/mara/" + APIUser)
        .then((res) => res.json())
        .then((data) => {
          //getColumns(data);
          getColumns(col_json);
          transformTableData(data);
          const timer = setTimeout(() => {
            setapidataloaded(true);
            // console.log('This will run after 1 second!')
          }, 1000);
          setapidataloaded(false);
          return () => clearTimeout(timer);
        })
        .catch(console.log);
    } else {
      getColumns(col_json);
      transformTableData(rows_json);
      setapidataloaded(true);
    }
  }, []);

  // get columns from api or json // replace "_" // set state for filter box & source array
  const getColumns = (data) => {
    let colLabels = [];
    let colNames = [];
    if (data.length !== 0 && Object.keys(data[0]).length !== 0) {
      /* if (useAPI) {
        let keys = Object.keys(data[0]);
        colNames = keys.map((key) => {
          const container = {};
          container["col_id"] = key;
          container.label = key.replaceAll("_", " ");
          return container;
        });
        console.log(colNames);
        for (var col = 0; col < colNames.length; col++) {
          colLabels = [...colLabels, colNames[col].label];
        }
      } else { */
      for (var col = 0; col < data.length; col++) {
        colLabels = [...colLabels, data[col].label];
      }
      colNames = data;
      //  }
    }
    setFilterColumnsShowColumns(colLabels);
    setSearchMaterialColumnsSource(colNames);
  };

  ///////////////////////////////////////// filter columns

  // open dialog filter columns & take defaults // checkbox-filter-dialog
  const handleFilterColumns = () => {
    setFilterColumnsSelected(filterColumnsShowColumns);
    setOpenFilterColumns(true);
  };

  // useEffect for refresh after closing dialog
  useEffect(() => {
    if (!openFilterColumns && searchMaterialColumnsSource.length !== 0) {
      filterColumns();
    }
  }, [openFilterColumns, searchMaterialColumnsSource]);

  // filter columns diff list columns & dialog checkbox list
  const filterColumns = () => {
    let filteredColumns = searchMaterialColumnsSource;
    for (var col = 0; col < searchMaterialColumnsSource.length; col++) {
      if (
        filterColumnsShowColumns.includes(
          searchMaterialColumnsSource[col].label
        )
      ) {
      } else {
        filteredColumns = filteredColumns.filter(
          (column) => column.label != searchMaterialColumnsSource[col].label
        );
      }
    }
    setSearchMaterialColumns(filteredColumns);
  };

  /////////////////////////////////////// manage autocomplete inputs

  // get Values from leftside text inputs || check if typed text or clicked option
  const handleTextInputs = (e) => {
    if (e.target.value === "" || e.target.value === 0) {
      setSearchInput({
        ...searchInput,
        [e.target.id.split("-")[0]]: e.target.textContent,
      });
    } else {
      setSearchInput({ ...searchInput, [e.target.id]: e.target.value });
    }
  };

  // get Values from mid dropdown inputs // trigger related value/slider with update state
  const handleDropdownInputs = (e) => {
    if (e.target.value === "" || e.target.value === 0) {
      const filter = e.target.id.split("-")[0].split("_")[0];
      const cat = e.target.id.split("-")[0].split("_")[1];
      setSearchInput({
        ...searchInput,
        [filter]: { ...searchInput[filter], [cat]: e.target.textContent },
      });
      if (filter === "Zugmodul") {
        setUpdateFilterZugmodul(true);
      } else if (filter === "Bruchdehnung") {
        setUpdateFilterBruchdehnung(true);
      } else if (filter === "MVR") {
        setUpdateFilterMVR(true);
      } else if (filter === "Bruchspannung") {
        setUpdateFilterBruchspannung(true);
      }
    } else {
      const filter = e.target.id.split("-")[0].split("_")[0];
      const cat = e.target.id.split("-")[0].split("_")[1];
      setSearchInput({
        ...searchInput,
        [filter]: { ...searchInput[filter], [cat]: e.target.value },
      });
      if (filter === "Zugmodul") {
        setUpdateFilterZugmodul(true);
      } else if (filter === "Bruchdehnung") {
        setUpdateFilterBruchdehnung(true);
      } else if (filter === "MVR") {
        setUpdateFilterMVR(true);
      } else if (filter === "Bruchspannung") {
        setUpdateFilterBruchspannung(true);
      }
    }
  };

  // get Values from value dropdown // list created by trigger state
  const handleDropdownInputsValue = (e) => {
    if (
      (e.target.value === "" || e.target.value === 0) &&
      e.target.textContent !== "" &&
      e.target.textContent !== 0
    ) {
      const filter = e.target.id.split("-")[0].split("_")[0];
      const cat = e.target.id.split("-")[0].split("_")[1];
      setSearchInput({
        ...searchInput,
        [filter]: {
          ...searchInput[filter],
          [cat]: Number(e.target.textContent),
        },
      });
    } else if (
      (e.target.value === null || e.target.value === "") &&
      (e.target.textContent === null || e.target.textContent === "")
    ) {
      const filter = e.target.id.split("-")[0].split("_")[0];
      const cat = e.target.id.split("-")[0].split("_")[1];
      setSearchInput({
        ...searchInput,
        [filter]: { ...searchInput[filter], [cat]: null },
      });
    } else {
      const filter = e.target.id.split("-")[0].split("_")[0];
      const cat = e.target.id.split("-")[0].split("_")[1];
      setSearchInput({
        ...searchInput,
        [filter]: { ...searchInput[filter], [cat]: Number(e.target.value) },
      });
    }
  };

  // get Values from slider
  const handleSliderChange = (e, value) => {
    if (e.target.attributes.id !== undefined) {
      if (e.target.attributes.id.nodeValue.includes("slider")) {
        if (e.target.attributes.id.nodeValue === "slider1") {
          setSearchInput({
            ...searchInput,
            Zugmodul: { ...searchInput.Zugmodul, range: value },
          });
        } else if (e.target.attributes.id.nodeValue === "slider2") {
          setSearchInput({
            ...searchInput,
            Bruchdehnung: { ...searchInput.Bruchdehnung, range: value },
          });
        } else if (e.target.attributes.id.nodeValue === "slider3") {
          setSearchInput({
            ...searchInput,
            MVR: { ...searchInput.MVR, range: value },
          });
        } else if (e.target.attributes.id.nodeValue === "slider4") {
          setSearchInput({
            ...searchInput,
            Bruchspannung: { ...searchInput.Bruchspannung, range: value },
          });
        }
      }
    } else {
      if (
        e.target.attributes[5] !== undefined &&
        e.target.attributes[5] !== null
      ) {
        if (e.target.attributes[5].nodeValue === "slider1") {
          setSearchInput({
            ...searchInput,
            Zugmodul: {
              ...searchInput.Zugmodul,
              [e.target.attributes[5].nodeValue]: value,
            },
          });
        } else if (e.target.attributes[5].nodeValue === "slider2") {
          setSearchInput({
            ...searchInput,
            Bruchdehnung: {
              ...searchInput.Bruchdehnung,
              [e.target.attributes[5].nodeValue]: value,
            },
          });
        } else if (e.target.attributes[5].nodeValue === "slider3") {
          setSearchInput({
            ...searchInput,
            MVR: {
              ...searchInput.MVR,
              [e.target.attributes[5].nodeValue]: value,
            },
          });
        } else if (e.target.attributes[5].nodeValue === "slider4") {
          setSearchInput({
            ...searchInput,
            Bruchspannung: {
              ...searchInput.Bruchspannung,
              [e.target.attributes[5].nodeValue]: value,
            },
          });
        }
      }
    }
  };

  // reset inputs, states & table rows on click RESET button
  const resetInputs = () => {
    setSearchInput({
      mat_desc: null,
      campus_fam: null,
      Verarbeitungsmethode: null,
      producer: null,
      art: null,
      Zugmodul: { cat: null, value: null, range: [0, 1] },
      Bruchdehnung: { cat: null, value: null, range: [0, 1] },
      MVR: { cat: null, value: null, range: [0, 1] },
      Bruchspannung: { cat: null, value: null, range: [0, 1] },
    });
    setSearchMaterialRows(rowDataBackup);
    setNumericFilterProps({
      Zugmodul: [[], 0, 1],
      Bruchdehnung: [[], 0, 1],
      MVR: [[], 0, 1],
      Bruchspannung: [[], 0, 1],
    });
  };

  const onClickReset = () => {
    resetInputs();
  };

  /////// transform data for dropdown / slider inputs
  // check string data for null
  const getColValues = (colname) => {
    let colvalues = rowDataBackup
      .filter(
        (option) => option[colname] !== null && option[colname] !== undefined
      )
      .map((option) => option[colname]);
    colvalues = [...new Set(colvalues)];
    return colvalues;
  };

  // get Numeric ColNamesOptions for dropdown
  const getColNamesOptions = (colname) => {
    const colnames = searchMaterialColumnsSource
      .filter(
        (option) => option.col_id !== null && option["col_id"].includes(colname)
      )
      .map((option) => String(option.col_id));
    return colnames;
  };

  // get values and min/max for slider filter & dropdown
  const [updateFilterZugmodul, setUpdateFilterZugmodul] = useState(false);
  const [updateFilterBruchdehnung, setUpdateFilterBruchdehnung] = useState(
    false
  );
  const [updateFilterMVR, setUpdateFilterMVR] = useState(false);
  const [updateFilterBruchspannung, setUpdateFilterBruchspannung] = useState(
    false
  );
  const [numericFilterProps, setNumericFilterProps] = useState({
    Zugmodul: [],
    Bruchdehnung: [],
    MVR: [],
    Bruchspannung: [],
  });

  const getNumericFilterProps = (column) => {
    const filter = searchInput[column].cat;
    if (filter !== null && filter !== undefined) {
      const values = rowDataBackup
        .filter((row) => row[filter] !== null)
        .map((row) => String(row[filter]));
      let min = 0;
      let max = 0;
      if (values.length === 1) {
        max = Math.max(...values);
      } else if (values.length > 1) {
        min = Math.min(...values);
        max = Math.max(...values);
      }
      const filterProp = [values, min, max];
      setNumericFilterProps({ ...numericFilterProps, [column]: filterProp });
      setSearchInput({
        ...searchInput,
        [column]: { ...searchInput[column], range: [min, max] },
      });
      console.log(filterProp);
    }
  };

  // useEffect for check dropdowns
  useEffect(() => {
    if (updateFilterZugmodul) {
      getNumericFilterProps("Zugmodul");
      setUpdateFilterZugmodul(false);
    }
  }, [updateFilterZugmodul]);

  useEffect(() => {
    if (updateFilterBruchdehnung) {
      getNumericFilterProps("Bruchdehnung");
      setUpdateFilterBruchdehnung(false);
    }
  }, [updateFilterBruchdehnung]);

  useEffect(() => {
    if (updateFilterMVR) {
      getNumericFilterProps("MVR");
      setUpdateFilterMVR(false);
    }
  }, [updateFilterMVR]);

  useEffect(() => {
    if (updateFilterBruchspannung) {
      getNumericFilterProps("Bruchspannung");
      setUpdateFilterBruchspannung(false);
    }
  }, [updateFilterBruchspannung]);

  /////////////////////////////////////////// FILTER
  // filter props
  const filterProp = (obj, key, filterProps) => {
    let x = [];

    if (typeof filterProps[0][key] === "object") {
      const newkey = filterProps[0][key]["cat"];

      // filter property // if no value, filtering range
      if (obj[newkey] !== null) {
        if (
          filterProps[0][key].value !== null &&
          filterProps[0][key].value !== ""
        ) {
          if (obj[newkey] === filterProps[0][key].value) {
            x.push(obj);
            return x;
          }
        } else if (
          filterProps[0][key].range !== null &&
          filterProps[0][key].range !== []
        ) {
          if (obj[newkey] <= filterProps[0][key].range[1]) {
            if (obj[newkey] >= filterProps[0][key].range[0]) {
              x.push(obj);
              return x;
            }
          }
        }
      }
    } else {
      // filter property
      if (obj[key] !== null) {
        // if string
        if (typeof obj[key] === "string") {
          if (
            obj[key].toUpperCase().includes(filterProps[0][key].toUpperCase())
          ) {
            x.push(obj);
            return x;
          }
        }

        // if number
        if (typeof obj[key] === "number") {
          if (String(obj[key]).indexOf(filterProps[0][key]) > -1) {
            x.push(obj);
            return x;
          }
        }
      }
    }
  };

  const filterRows = () => {
    if (
      rowDataBackup !== null &&
      rowDataBackup.length !== 0 &&
      searchInput !== null &&
      searchInput.length !== 0
    ) {
      const filterProps = [searchInput];
      let filterKeys = Object.keys(filterProps[0]);
      let filteredRows = [];

      // check if every filter is empty -> set all rows
      let countEmpties = 0;
      for (var filter = 0; filter < filterKeys.length; filter++) {
        if (typeof filterProps[0][filterKeys[filter]] === "object") {
          if (
            filterProps[0][filterKeys[filter]] === null ||
            filterProps[0][filterKeys[filter]] === undefined ||
            filterProps[0][filterKeys[filter]] === ""
          ) {
            countEmpties++;
          } else if (
            filterProps[0][filterKeys[filter]].cat === null ||
            filterProps[0][filterKeys[filter]].cat === undefined ||
            filterProps[0][filterKeys[filter]].cat === ""
          ) {
            countEmpties++;
          }
        } else {
          if (
            filterProps[0][filterKeys[filter]] === null ||
            filterProps[0][filterKeys[filter]] === undefined ||
            filterProps[0][filterKeys[filter]] === ""
          ) {
            countEmpties++;
          }
        }
      }
      console.log(countEmpties);

      // check if every filter is empty -> set all rows ELSE iterate rowData and check filter
      if (countEmpties === filterKeys.length) {
        setSearchMaterialRows(rowDataBackup);
      } else {
        for (var i = 0; i < rowDataBackup.length; i++) {
          if (
            Object.keys(rowDataBackup[i]) !== null &&
            Object.keys(rowDataBackup[i]) !== undefined
          ) {
            const obj = rowDataBackup[i];
            let checkFilter = false;

            for (var e = 0; e < filterKeys.length; e++) {
              const key = filterKeys[e];
              if (typeof filterProps[0][key] === "object") {
                if (
                  filterProps[0][key] === null ||
                  filterProps[0][key] === undefined ||
                  filterProps[0][key] === ""
                ) {
                  checkFilter = true;
                } else if (
                  filterProps[0][key].cat !== null &&
                  filterProps[0][key].cat !== undefined &&
                  filterProps[0][key].cat !== ""
                ) {
                  const test = filterProp(obj, key, filterProps);
                  if (test !== undefined) {
                    checkFilter = true;
                  } else {
                    checkFilter = false;
                    break;
                  }
                }
              } else {
                if (
                  filterProps[0][key] !== null &&
                  filterProps[0][key] !== undefined &&
                  filterProps[0][key] !== ""
                ) {
                  const test = filterProp(obj, key, filterProps);
                  if (test !== undefined) {
                    checkFilter = true;
                  } else {
                    checkFilter = false;
                    break;
                  }
                }
              }
            }
            if (checkFilter) {
              filteredRows.push(rowDataBackup[i]);
            }
          }
        }
        console.log(filteredRows);
        setSearchMaterialRows(filteredRows);
      }
    }
  };

  //  handle search button
  const handleSearchButton = () => {
    setSearchMaterialApiLoaded(false);
    setNeedRefreshSearchMaterial(!needRefreshSearchMaterial);
    filterRows();
  };

  // handle use selected Material & jump back to dialog
  const onClickUseSelectedMaterial = () => {
    console.log(selectedMaterial[0]);
    setUseSelectedMaterial({
      ...useSelectedMaterial,
      mara_id: selectedMaterial[0].id,
      mat_desc: selectedMaterial[0].mat_desc,
      mara_nr: selectedMaterial[0].mara_nr,
    });

    if (jumpToMaterialSearch === "AddComponent") {
      setOpenAddComponent(true);
      setJumpToMaterialSearch("");
    } else if (jumpToMaterialSearch === "EditComponent") {
      setOpenEditComponent(true);
      setJumpToMaterialSearch("");
    } else if (jumpToMaterialSearch === "AddConstruction") {
      setOpenAddCons(true);
      setJumpToMaterialSearch("");
    }
    setOpenSearchMaterial(false);
  };

  const CustomSlider = withStyles({
    root: {
      color: "#005000",
      height: 8,
    },
    thumb: {
      height: 24,
      width: 24,
      backgroundColor: "#fff",
      border: "2px solid currentColor",
      marginTop: -8,
      marginLeft: -12,
      "&:focus, &:hover, &$active": {
        boxShadow: "inherit",
      },
    },
    active: {},
    valueLabel: {
      left: "calc(-50% + 4px)",
    },
    track: {
      height: 8,
      borderRadius: 4,
    },
    rail: {
      height: 8,
      borderRadius: 4,
    },
  })(Slider);

  // div code
  return (
    <div className={classes.mainwindow}>
      {useAPI && !apidataloaded ? (
        <div className={classes.progress}>
          <CircularProgress className={classes.progress} />
          <br />
        </div>
      ) : (
        <div>
          <div>
            {console.log(searchInput)}
            <Grid container>
              <Grid item xs={3}>
                <Grid container className={classes.container}>
                  <Grid item xs={10}>
                    <Grid container>
                      <Grid item xs={12} className={classes.text}></Grid>
                      <Grid item xs={12}>
                        <Autocomplete
                          disableClearable
                          value={searchInput.mat_desc}
                          freeSolo
                          onChange={handleTextInputs}
                          onClose={handleTextInputs}
                          id="mat_desc"
                          size="small"
                          className={classes.autocomplete}
                          options={getColValues("mat_desc")}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              value={searchInput.mat_desc}
                              placeholder="Materialbeschreibung"
                              margin="dense"
                              variant="outlined"
                              className={classes.textfield}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <Grid container className={classes.container}>
                  <Grid item xs={10}>
                    <Grid container>
                      <Grid item xs={12} className={classes.text}></Grid>
                      <Grid item xs={12}>
                        <Grid container>
                          <Grid item xs={8}>
                            <Autocomplete
                              disableClearable
                              value={searchInput.Zugmodul.cat}
                              onChange={handleDropdownInputs}
                              id="Zugmodul_cat"
                              size="small"
                              className={classes.autocomplete}
                              options={getColNamesOptions("Zugmodul")}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  value={searchInput.Zugmodul.cat}
                                  placeholder="Zugmodul"
                                  margin="dense"
                                  variant="outlined"
                                  className={classes.textfield}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <Autocomplete
                              disableClearable
                              value={String(searchInput.Zugmodul.value || "")}
                              freeSolo
                              onChange={handleDropdownInputsValue}
                              onClose={handleDropdownInputsValue}
                              id="Zugmodul_value"
                              size="small"
                              className={classes.autocomplete_value}
                              options={numericFilterProps.Zugmodul[0] || []}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  value={String(
                                    searchInput.Zugmodul.value || ""
                                  )}
                                  placeholder="Wert"
                                  margin="dense"
                                  variant="outlined"
                                  className={classes.textfield_value}
                                />
                              )}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={3} className={classes.container_paper}>
                <Paper className={classes.paper}>
                  <Grid container className={classes.container_papercontent}>
                    <Grid item xs={2} className={classes.container}>
                      <div style={{ color: "#005000" }}>Min</div>
                    </Grid>
                    <Grid item xs={8} className={classes.container}>
                      <CustomSlider
                        color="secondary"
                        id="slider1"
                        max={numericFilterProps.Zugmodul[2]}
                        min={numericFilterProps.Zugmodul[1]}
                        value={searchInput.Zugmodul.range}
                        onChange={handleSliderChange}
                        valueLabelDisplay="auto"
                        aria-labelledby="slider1"
                      />
                    </Grid>
                    <Grid item xs={2} className={classes.container}>
                      <div style={{ color: "#005000" }}>Max</div>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={3}>
                <Grid container className={classes.container}>
                  <Grid item xs={10}>
                    <Grid container>
                      <Grid item xs={12} className={classes.text}></Grid>
                      <Grid item xs={12}>
                        <Autocomplete
                          disableClearable
                          value={searchInput.campus_fam || ""}
                          freeSolo
                          onChange={handleTextInputs}
                          onClose={handleTextInputs}
                          id="fam_dimop_desc"
                          size="small"
                          className={classes.autocomplete}
                          options={getColValues("fam_dimop_desc")}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              value={searchInput.campus_fam || ""}
                              placeholder="Kunststofffamilie"
                              margin="dense"
                              variant="outlined"
                              className={classes.textfield}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <Grid container className={classes.container}>
                  <Grid item xs={10}>
                    <Grid container>
                      <Grid item xs={12} className={classes.text}></Grid>
                      <Grid item xs={12}>
                        <Grid container>
                          <Grid item xs={8}>
                            <Autocomplete
                              disableClearable
                              value={searchInput.Bruchdehnung.cat}
                              onChange={handleDropdownInputs}
                              id="Bruchdehnung_cat"
                              size="small"
                              className={classes.autocomplete}
                              options={getColNamesOptions("Bruchdehnung")}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  value={searchInput.Bruchdehnung.cat}
                                  placeholder="Bruchdehnung"
                                  margin="dense"
                                  variant="outlined"
                                  className={classes.textfield}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <Autocomplete
                              disableClearable
                              value={String(
                                searchInput.Bruchdehnung.value || ""
                              )}
                              freeSolo
                              onChange={handleDropdownInputsValue}
                              onClose={handleDropdownInputsValue}
                              id="Bruchdehnung_value"
                              size="small"
                              className={classes.autocomplete_value}
                              options={numericFilterProps.Bruchdehnung[0] || []}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  value={String(
                                    searchInput.Bruchdehnung.value || ""
                                  )}
                                  placeholder="Wert"
                                  margin="dense"
                                  variant="outlined"
                                  className={classes.textfield_value}
                                />
                              )}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={3} className={classes.container_paper}>
                <Paper className={classes.paper}>
                  <Grid container className={classes.container_papercontent}>
                    <Grid item xs={2} className={classes.container}>
                      <div style={{ color: "#005000" }}>Min</div>
                    </Grid>
                    <Grid item xs={8} className={classes.container}>
                      <CustomSlider
                        color="secondary"
                        id="slider2"
                        max={numericFilterProps.Bruchdehnung[2]}
                        min={numericFilterProps.Bruchdehnung[1]}
                        value={searchInput.Bruchdehnung.range}
                        onChange={handleSliderChange}
                        valueLabelDisplay="auto"
                        aria-labelledby="slider2"
                      />
                    </Grid>
                    <Grid item xs={2} className={classes.container}>
                      <div style={{ color: "#005000" }}>Max</div>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={3}>
                <Grid container className={classes.container}>
                  <Grid item xs={10}>
                    <Grid container>
                      <Grid item xs={12} className={classes.text}></Grid>
                      <Grid item xs={12}>
                        <Autocomplete
                          disableClearable
                          value={searchInput.producer || ""}
                          freeSolo
                          onChange={handleTextInputs}
                          onClose={handleTextInputs}
                          id="producer"
                          size="small"
                          className={classes.autocomplete}
                          options={getColValues("producer")}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              value={searchInput.producer || ""}
                              placeholder="Hersteller"
                              margin="dense"
                              variant="outlined"
                              className={classes.textfield}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <Grid container className={classes.container}>
                  <Grid item xs={10}>
                    <Grid container>
                      <Grid item xs={12} className={classes.text}>
                        <div>MVR</div>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container>
                          <Grid item xs={8}>
                            <Autocomplete
                              disableClearable
                              value={searchInput.MVR.cat}
                              onChange={handleDropdownInputs}
                              id="MVR_cat"
                              size="small"
                              className={classes.autocomplete}
                              options={getColNamesOptions("MVR")}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  value={searchInput.MVR.cat}
                                  placeholder="MVR"
                                  margin="dense"
                                  variant="outlined"
                                  className={classes.textfield}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <Autocomplete
                              disableClearable
                              value={String(searchInput.MVR.value || "")}
                              freeSolo
                              onChange={handleDropdownInputsValue}
                              onClose={handleDropdownInputsValue}
                              id="MVR_value"
                              size="small"
                              className={classes.autocomplete_value}
                              options={numericFilterProps.MVR[0] || []}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  value={String(searchInput.MVR.value || "")}
                                  placeholder="Wert"
                                  margin="dense"
                                  variant="outlined"
                                  className={classes.textfield_value}
                                />
                              )}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={3} className={classes.container_paper}>
                <Paper className={classes.paper}>
                  <Grid container className={classes.container_papercontent}>
                    <Grid item xs={2} className={classes.container}>
                      <div style={{ color: "#005000" }}>Min</div>
                    </Grid>
                    <Grid item xs={8} className={classes.container}>
                      <CustomSlider
                        color="secondary"
                        id="slider3"
                        max={numericFilterProps.MVR[2]}
                        min={numericFilterProps.MVR[1]}
                        value={searchInput.MVR.range}
                        onChange={handleSliderChange}
                        valueLabelDisplay="auto"
                        aria-labelledby="slider3"
                      />
                    </Grid>
                    <Grid item xs={2} className={classes.container}>
                      <div style={{ color: "#005000" }}>Max</div>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={3}>
                <Grid container className={classes.container}>
                  <Grid item xs={10}>
                    <Grid container>
                      <Grid item xs={12} className={classes.text}></Grid>
                      <Grid item xs={12}>
                        <Autocomplete
                          disableClearable
                          value={searchInput.Verarbeitungsmethode || ""}
                          freeSolo
                          onChange={handleTextInputs}
                          onClose={handleTextInputs}
                          id="Verarbeitungsmethode"
                          size="small"
                          className={classes.autocomplete}
                          options={getColValues("Verarbeitungsmethode")}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              value={searchInput.Verarbeitungsmethode || ""}
                              placeholder="Verarbeitungsmethode"
                              margin="dense"
                              variant="outlined"
                              className={classes.textfield}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <Grid container className={classes.container}>
                  <Grid item xs={10}>
                    <Grid container>
                      <Grid item xs={12} className={classes.text}></Grid>
                      <Grid item xs={12}>
                        <Grid container>
                          <Grid item xs={8}>
                            <Autocomplete
                              disableClearable
                              value={searchInput.Bruchspannung.cat}
                              onChange={handleDropdownInputs}
                              id="Bruchspannung_cat"
                              size="small"
                              className={classes.autocomplete}
                              options={getColNamesOptions("Bruchspannung")}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  value={searchInput.Bruchspannung.cat}
                                  placeholder="Bruchspannung"
                                  margin="dense"
                                  variant="outlined"
                                  className={classes.textfield}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <Autocomplete
                              disableClearable
                              value={String(
                                searchInput.Bruchspannung.value || ""
                              )}
                              freeSolo
                              onChange={handleDropdownInputsValue}
                              onClose={handleDropdownInputsValue}
                              id="Bruchspannung_value"
                              size="small"
                              className={classes.autocomplete_value}
                              options={
                                numericFilterProps.Bruchspannung[0] || []
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  value={String(
                                    searchInput.Bruchspannung.value || ""
                                  )}
                                  placeholder="Wert"
                                  margin="dense"
                                  variant="outlined"
                                  className={classes.textfield_value}
                                />
                              )}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={3} className={classes.container_paper}>
                <Paper className={classes.paper}>
                  <Grid container className={classes.container_papercontent}>
                    <Grid item xs={2} className={classes.container}>
                      <div style={{ color: "#005000" }}>Min</div>
                    </Grid>
                    <Grid item xs={8} className={classes.container}>
                      <CustomSlider
                        color="secondary"
                        id="slider4"
                        max={numericFilterProps.Bruchspannung[2]}
                        min={numericFilterProps.Bruchspannung[1]}
                        value={searchInput.Bruchspannung.range}
                        onChange={handleSliderChange}
                        valueLabelDisplay="auto"
                        aria-labelledby="slider4"
                      />
                    </Grid>
                    <Grid item xs={2} className={classes.container}>
                      <div style={{ color: "#005000" }}>Max</div>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={3}>
                <Grid container className={classes.container}>
                  <Grid item xs={10}>
                    <Grid container>
                      <Grid item xs={12} className={classes.text}></Grid>
                      <Grid item xs={12}>
                        <Autocomplete
                          disableClearable
                          value={searchInput.art || ""}
                          freeSolo
                          onChange={handleTextInputs}
                          onClose={handleTextInputs}
                          id="art"
                          size="small"
                          className={classes.autocomplete}
                          options={getColValues("art")}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              value={searchInput.art || ""}
                              placeholder="Art"
                              margin="dense"
                              variant="outlined"
                              className={classes.textfield}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={7}></Grid>
              <Grid item xs={2}>
                <Button
                  variant="outlined"
                  className={classes.buttons}
                  onClick={onClickReset}
                >
                  Reset
                </Button>
                <Button
                  variant="outlined"
                  className={classes.buttons}
                  onClick={handleSearchButton}
                >
                  Suchen
                </Button>
              </Grid>
            </Grid>
          </div>
          <Divider className={classes.divider} />
          <div className={classes.filterIcon}>
            <FilterListIcon
              style={{ color: "#005000", background: "white" }}
              onClick={handleFilterColumns}
            />
            <TableMaterialSearch />
            <div>
              {selectedMaterial.length === 1 &&
              (jumpToMaterialSearch === "AddComponent" ||
                jumpToMaterialSearch === "EditComponent" ||
                jumpToMaterialSearch === "AddConstruction") ? (
                <Button
                  variant="outlined"
                  className={classes.buttons}
                  onClick={onClickUseSelectedMaterial}
                >
                  Material verwenden
                </Button>
              ) : (
                <div />
              )}
            </div>
            <FilterColumns />
          </div>
        </div>
      )}
    </div>
  );
}
