// Contains tabletree component where bill of materials (bom) can be managed, exported and evaluated

// Import react components
import { useContext, useEffect, useState } from "react";

// Import devexpress components
import {
  ColumnChooser,
  Grid as GridDevExpress,
  Table,
  TableColumnVisibility,
  TableHeaderRow,
  TableTreeColumn,
  Toolbar,
} from "@devexpress/dx-react-grid-material-ui";
import {
  CustomTreeData,
  DataTypeProvider,
  IntegratedSorting,
  SelectionState,
  SortingState,
  TreeDataState,
} from "@devexpress/dx-react-grid";

// Import own components
import EvaluationDialog from "./EvaluationDialog.jsx";
import AddBomDialog from "./AddBomDialog.jsx";
import AddMaterialDialog from "./AddMaterialDialog.jsx";
import DeleteMaterialDialog from "./DeleteMaterialDialog.jsx";
import CsvUploadDialog from "./CsvUploadDialog.jsx";
import { MainContext } from "./MainContext.jsx";

// Import material ui components
import PolymerIcon from "@material-ui/icons/Polymer";
import React from "react";
import { SearchDialog } from "../../views/Main/SearchDialog.jsx";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import WarningIcon from "@material-ui/icons/Warning";
import GetAppIcon from "@material-ui/icons/GetApp";
import { FormControl } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Button from "@material-ui/core/Button";

// Import csv download component
import CsvDownload from "react-json-to-csv";

// Use css via makeStyles
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
    margin: 20,
    height: 30,
    width: 120,
  },
  label: { marginTop: 10 },
  buttonbox: {
    textAlign: "right",
    paddingTop: 15,
    paddingBottom: 15,
  },
  textfield: { margin: 0, padding: 0, background: "white" },
  root_card: {
    marginTop: 15,
    marginBottom: 0,
  },
  title: {
    fontSize: 13,
  },
  card_div: {
    marginBottom: 15,
  },
  formControl: {
    minWidth: 325,
  },
}));

// Function to get child rows
const getChildRows = (row, rootRows) => {
  const childRows = rootRows.filter(
    (r) => r.parent_id === (row ? row.result_id : null)
  );
  return childRows.length ? childRows : null;
};

// Function to visually represent which bom components are atomic
const PlasticTypeProviderFormatter = ({ value, row }) => {
  if (value == 1)
    return (
      <span>
        <Tooltip
          title={
            <Typography variant="body1">
              Dieser Komponente kann ein Kunststoff zugeordnet werden.
            </Typography>
          }
        >
          <PolymerIcon style={{ color: "black" }}></PolymerIcon>
        </Tooltip>
      </span>
    );
  else
    return (
      <span>
        <Tooltip
          title={
            <Typography variant="body1">
              Dieser Komponente kann kein Kunststoff zugeordnet werden.
            </Typography>
          }
        >
          <PolymerIcon style={{ color: "lightgrey" }}></PolymerIcon>
        </Tooltip>
      </span>
    );
};

// Function to visually represent which bom components are atomic
const PlasticTypeProvider = (props) => (
  <DataTypeProvider
    formatterComponent={PlasticTypeProviderFormatter}
    {...props}
  />
);

// Component TableTree
const TableTree = () => {
  // Declare variable for useStyles
  const classes = useStyles();

  // Import global variables via useContext
  const {
    parent_material,
    bom_updated,
    delete_material,
    selected_construction_id,
    selected_construction_title,
    data_backend,
    highest_level_id,
    new_bom_created,
    selection_atomic,
    search_dialog_open,
  } = useContext(MainContext);

  // Declare variables imported from MainContext.jsx
  const [parentMaterial, setParentMaterial] = parent_material;
  const [deleteMaterial, setDeleteMaterial] = delete_material;
  const [bomUpdated, setBomUpdated] = bom_updated;
  const [selectedConstructionId, setSelectedConstructionId] =
    selected_construction_id;
  const [selectedConstructionTitle, setSelectedConstructionTitle] =
    selected_construction_title;
  const [dataBackend, setDataBackend] = data_backend;
  const [highestLevelId, setHighestLevelId] = highest_level_id;
  const [newBomCreated, setNewBomCreated] = new_bom_created;
  const [selectionAtomic, setSelectionAtomic] = selection_atomic;
  const [searchDialogOpen, setSearchDialogOpen] = search_dialog_open;

  // Declare variables
  const [bomMaterialId, setBomMaterialId] = useState("");
  const [rowSelection, setRowSelection] = useState([]);
  const [listDropdownData, setListDropdownData] = useState([]);
  const [dropdownSelected, setDropdownSelected] = useState([]);

  // Fetch tabletree data from backend endpoint tabletree.py
  useEffect(() => {
    if (selectedConstructionTitle !== "Bitte auswaehlen") {
      fetch("/tree/" + bomMaterialId)
        .then((res) => {
          return res.json();
        })
        .then((d) => {
          console.log(d);
          setDataBackend(d);
          console.log(dataBackend);
          setBomUpdated(false);
          setRowSelection([]);
        });
    } else {
    }
  }, [bomUpdated, bomMaterialId]);

  // Fetch dropdown data from backend endpoint mat.py
  useEffect(() => {
    if (selectedConstructionTitle !== "Bitte auswaehlen") {
      fetch("/mat?cons_id=" + selectedConstructionId)
        .then((res) => {
          return res.json();
        })
        .then((d) => {
          transformDropdownData(d);
        });
    } else {
    }
  }, [selectedConstructionId, newBomCreated]);

  // Define columns for tabletree data
  const [columns] = useState([
    { name: "result_id", title: "Id" },
    { name: "parent_id", title: "Parent" },
    { name: "mat_id", title: "Mat.Nr." },
    { name: "bom_id", title: "Id. BOM Eintrag" },
    { name: "mat_desc", title: "Mat.Bez." },
    // { name: "level", title: "Ebene" }, currently not working in backend
    { name: "mat_id_int", title: "ERP Mat.Nr." },
    { name: "mat_desc_int", title: "ERP Bez." },
    { name: "cad_id", title: "CAD Nr." },
    { name: "is_atomic", title: "Atomar" },
    { name: "mara_plast_id", title: "Kunststoff_ID" },
    { name: "plast_desc", title: "Kunstst.Bez." },
    { name: "plast_fam", title: "Kunstst.Fam." },
    { name: "height", title: "Höhe" },
    { name: "width", title: "Breite" },
    { name: "depth", title: "Tiefe" },
    { name: "unit", title: "Einheit" },
    { name: "weight", title: "Gewicht" },
    { name: "weight_unit", title: "G. Einheit" },
    { name: "volume", title: "Volumen" },
    { name: "volume_unit", title: "Vol. Einheit" },
    { name: "orga_id", title: "Organisations Id" },
    { name: "mat_rw", title: "Rec.Value" },
    { name: "recycling_cat", title: "Rec.Kat." },
    { name: "resource_use", title: "ADPf" },
    { name: "co2_value", title: "GWP" },
    { name: "price", title: "Preis" },
    { name: "impure", title: "Enthält Störstoffe" },
    { name: "dangerous", title: "Enthält Gefahrenstoffe" },
    { name: "evaluated", title: "Evaluiert" },
    { name: "del_kz", title: "Lösch.Kz" },
    { name: "cons_id", title: "Kons.Id" },
  ]);

  // Define column width for specific columns
  const [tableColumnExtensions] = useState([
    { columnName: "mat_id", width: 250 },
    { columnName: "mat_desc", width: 250 },
    { columnName: "plast_desc", width: 250 },
    { columnName: "recycling_cat", width: 100 },
    { columnName: "mat_rw", width: 100 },
    { columnName: "price", width: 80 },
    { columnName: "co2_value", width: 80 },
    { columnName: "resource_use", width: 80 },
    { columnName: "impure", width: 150 },
    { columnName: "dangerous", width: 170 },
  ]);

  // Default value for expanded rows in tabletree
  const [defaultExpandedRowIds] = useState([0]);

  // Hide specific columns by default
  const [defaultHiddenColumnNames] = useState([
    //"level", currently not working in backend
    "result_id",
    "parent_id",
    "mat_id_int",
    "mat_desc_int",
    "cad_id",
    "mara_plast_id",
    "orga_id",
    "mat_rw",
    "recycling_cat",
    "resource_use",
    "co2_value",
    "price",
    "impure",
    "dangerous",
    "del_kz",
    "cons_id",
    "evaluated",
  ]);

  // Set specific variables on click
  const setParent = () => {
    if (rowSelection.length == 1) {
      setParentMaterial(dataBackend[rowSelection].mat_id);
      setHighestLevelId(dataBackend[rowSelection].result_id);
      setSelectionAtomic(dataBackend[rowSelection].is_atomic);
    }
  };

  // Handle drop down menu changes
  const handleDropdownChange = (event) => {
    setDropdownSelected(event.target.textContent);
    setBomMaterialId(parseInt(event.target.textContent.split(" ")[0]));
  };

  // Transform drop down data
  const transformDropdownData = (data) => {
    if (data !== null && data.length !== 0) {
      const source = data.map((item) => item.id + " " + item.mat_desc);
      setListDropdownData(source);
    } else setListDropdownData([]);
  };

  // Select component to be deleted
  const setDeleteComponent = () => {
    if (rowSelection.length == 1) {
      setDeleteMaterial(dataBackend[rowSelection].bom_id);
    }
  };

  // Handle if search dialog is closed
  const handleSearchDialogClose = () => {
    setSearchDialogOpen(false);
  };

  {
    /* Used to control if search dialog is open */
  }
  useEffect(() => {
    console.log("search dialog changed", searchDialogOpen);
  }, [searchDialogOpen]);

  return (
    <div>
      {/* Search dialog */}
      <SearchDialog
        open={searchDialogOpen}
        handleSearchDialogClose={handleSearchDialogClose}
      />
      <Grid
        container
        item
        xs={12}
        style={{
          background: "white",
          marginTop: 25,
          textAlign: "left",
        }}
      >
        {/* Dropdown to choose bom */}
        <Grid item xs={4}>
          <Typography>Bitte wählen Sie eine Stückliste aus.</Typography>
          <FormControl className={classes.formControl}>
            <Autocomplete
              disableClearable
              value={dropdownSelected}
              onChange={handleDropdownChange}
              options={listDropdownData}
              renderInput={(params) => (
                <TextField
                  {...params}
                  value={dropdownSelected}
                  margin="dense"
                  className={classes.textfield}
                />
              )}
            />
          </FormControl>
        </Grid>
        {/* Component to import csv. Uses CsvUploadDialod.jsx */}
        <Grid item xs={2}>
          <Tooltip
            title={
              <Typography variant="body1">
                Hiermit können Sie eine neue Stückliste als csv-Datei
                importieren.
              </Typography>
            }
          >
            <div>
              <CsvUploadDialog></CsvUploadDialog>
            </div>
          </Tooltip>
        </Grid>
        {/* Export choosen bom to csv */}
        <Grid item xs={2}>
          <Tooltip
            title={
              <Typography variant="body1">
                Hiermit können Sie eine Stückliste als csv-Datei exportieren.
              </Typography>
            }
          >
            <div>
              <CsvDownload
                data={dataBackend}
                filename="dimop_bom.csv"
                style={{
                  borderRight: "none",
                  borderBottom: "none",
                  borderLeft: "none",
                  borderTop: "none",
                  color: "#005000",
                  margin: 20,
                  height: 30,
                  width: 120,
                  backgroundColor: "white",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "bold",
                  fontFamiliy: "Roboto",
                  textAlign: "center",
                }}
              >
                <GetAppIcon style={{ marginRight: 5 }}></GetAppIcon>
                Download
              </CsvDownload>
            </div>
          </Tooltip>
        </Grid>

        {/* Used to create new material as bom. Uses AddBomDialog.jsx */}
        <Grid item xs={2}>
          <Tooltip
            title={
              <Typography variant="body1">
                Hiermit können Sie eine neue Stückliste erstellen.
              </Typography>
            }
          >
            <div>
              <AddBomDialog></AddBomDialog>
            </div>
          </Tooltip>
        </Grid>

        {/* Used to evaluate choosen bom. Uses EvaluationDialog.jsx */}
        <Grid item xs={2}>
          <Tooltip
            title={
              <Typography variant="body1">
                Hiermit können Sie die gewählte Stückliste bewerten.
              </Typography>
            }
          >
            <div>
              <EvaluationDialog></EvaluationDialog>
            </div>
          </Tooltip>
        </Grid>
      </Grid>

      {/* Contains tabletree component */}
      <div>
        <GridDevExpress rows={dataBackend} columns={columns}>
          <SelectionState
            selection={rowSelection}
            onSelectionChange={setRowSelection}
          />
          <TreeDataState defaultExpandedRowIds={defaultExpandedRowIds} />
          <SortingState />
          <CustomTreeData getChildRows={getChildRows} />
          <IntegratedSorting />
          <PlasticTypeProvider for={["is_atomic"]} />
          <Table columnExtensions={tableColumnExtensions} />
          <TableColumnVisibility
            defaultHiddenColumnNames={defaultHiddenColumnNames}
          />
          <TableHeaderRow showSortingControls />
          <TableTreeColumn for="mat_id" showSelectionControls />
          <Toolbar />
          <ColumnChooser />
        </GridDevExpress>
      </div>

      <Grid
        container
        item
        xs={12}
        style={{
          background: "white",
          marginTop: 25,
          marginBottom: 25,
        }}
      >
        <Grid item xs={6}></Grid>

        {/* Used to delete component within bom. Uses DeleteMaterialDialog.jsx */}
        <Grid item xs={2}>
          <Tooltip
            title={
              <Typography variant="body1">
                Hiermit können Sie eine ausgewählte Komponente löschen.
              </Typography>
            }
          >
            <div onClick={setDeleteComponent}>
              <DeleteMaterialDialog></DeleteMaterialDialog>
            </div>
          </Tooltip>
        </Grid>

        {/* Used to add material within bom. Uses AddMaterialDialog.jsx */}
        <Grid item xs={2}>
          <Tooltip
            title={
              <Typography variant="body1">
                Hiermit können Sie einer bestehenden Komponente eine weitere
                Komponente hinzufügen.
              </Typography>
            }
          >
            <div onClick={setParent}>
              <AddMaterialDialog></AddMaterialDialog>
            </div>
          </Tooltip>
        </Grid>

        {/* Used to initiate search. Uses SearchDialog.jsx*/}
        <Grid item xs={2}>
          <Tooltip
            title={
              <Typography variant="body1">
                Hiermit können Sie einer bestehenden Komponente einen Kunststoff
                zuordnen.
              </Typography>
            }
          >
            <Button
              className={classes.buttons}
              onClick={() => {
                setParent();
                setSearchDialogOpen(!searchDialogOpen);
              }}
            >
              <PolymerIcon style={{ marginRight: 5 }}></PolymerIcon>
              Zuordnen
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
      {/* Warning if no onlx one row is selected */}
      <Grid container item xs={12} justify="center">
        {(rowSelection.length == 1) == false &&
        selectedConstructionTitle != "Bitte auswaehlen" &&
        bomMaterialId != "" ? (
          <div style={{ color: "red", marginTop: 20, marginBottom: 20 }}>
            <WarningIcon
              style={{ fontSize: "small", marginRight: 10 }}
            ></WarningIcon>{" "}
            Bitte wählen Sie eine Komponente aus.
          </div>
        ) : (
          <div />
        )}
      </Grid>
    </div>
  );
};

export default TableTree;
