import React from "react";
import { useEffect, useContext, useState } from "react";

// Components
import { MainContext } from "./MainContext.jsx";
import AddConstructionDialog from "./AddConstructionDialog.jsx";
import DeleteConstructionDialog from "./DeleteConstructionDialog.jsx";

//Material UI
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import WarningIcon from "@material-ui/icons/Warning";

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

const ConstructionTable = () => {
  const classes = useStyles();

  const {
    selected_construction_id,
    selected_construction_title,
    orga_id,
    constructions_updated,
  } = useContext(MainContext);

  const [orgaId, setOrgaId] = orga_id;

  const [
    selectedConstructionId,
    setSelectedConstructionId,
  ] = selected_construction_id;
  const [
    selectedConstructionTitle,
    setSelectedConstructionTitle,
  ] = selected_construction_title;

  const [constructionData, setConstructionData] = useState([]);
  const [constructionsUpdated, setConstructionsUpdate] = constructions_updated;

  useEffect(() => {
    fetch("/cons/" + orgaId)
      .then((res) => {
        return res.json();
      })
      .then((d) => {
        setConstructionData(d.filter((d) => d.del_kz === 0));
      });
  }, [constructionsUpdated]);

  const [constructionColumns] = useState([
    { name: "id", title: "Konstr.Nr." },
    { name: "cons_title", title: "Konstr.Titel." },
    { name: "cons_desc", title: "Konstr.Beschr." },
    { name: "del_kz", title: "Lösch.Kennz." },
  ]);

  const [defaultHiddenColumnNames] = useState(["del_kz"]);

  const [tableColumnExtensions] = useState([
    { columnName: "id", width: 100 },
    { columnName: "cons_title", width: 250 },
    { columnName: "cons_desc", width: 550, wordWrapEnabled: true },
    { columnName: "del_kz", width: 50 },
  ]);

  const [selection, setSelection] = useState([]);

  const onClickSelect = () => {
    if (selection.length == 1) {
      setSelectedConstructionId(constructionData[selection].id);
      setSelectedConstructionTitle(constructionData[selection].cons_title);
    }
  };

  return (
    <div>
      <GridDevExpress rows={constructionData} columns={constructionColumns}>
        <SelectionState
          selection={selection}
          onSelectionChange={setSelection}
        />
        <FilteringState defaultFilters={[]} />
        <IntegratedFiltering />
        <Table columnExtensions={tableColumnExtensions} />
        <TableSelection />
        <TableColumnVisibility
          defaultHiddenColumnNames={defaultHiddenColumnNames}
        />
        <Toolbar />
        <ColumnChooser />
        <TableFilterRow />
        <TableHeaderRow />
      </GridDevExpress>

      <Grid container item xs={12}>
        <Grid item xs={6}></Grid>
        <Grid item xs={2}>
          <div onClick={onClickSelect}>
            <Tooltip
              title={
                <Typography variant="body1">
                  Hiermit können Sie eine Konstruktion löschen.
                </Typography>
              }
            >
              <div>
                <DeleteConstructionDialog></DeleteConstructionDialog>
              </div>
            </Tooltip>
          </div>
        </Grid>
        <Grid item xs={2}>
          <Tooltip
            title={
              <Typography variant="body1">
                Hiermit können Sie eine Konstruktion erstellen.
              </Typography>
            }
          >
            <div>
              <AddConstructionDialog></AddConstructionDialog>
            </div>
          </Tooltip>
        </Grid>
        <Grid item xs={2}>
          <Tooltip
            title={
              <Typography variant="body1">
                Hiermit können Sie eine Konstruktion auswählen.
              </Typography>
            }
          >
            <Button className={classes.buttons} onClick={onClickSelect}>
              <CheckCircleIcon style={{ marginRight: 5 }}></CheckCircleIcon>
              Auswählen
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
      <Grid container item xs={12} justify="center">
        {(selection.length == 1) == false ? (
          <div style={{ color: "red", marginTop: 20, marginBottom: 20 }}>
            <WarningIcon
              style={{ fontSize: "small", marginRight: 10 }}
            ></WarningIcon>{" "}
            Bitte wählen Sie eine Konstruktion.
          </div>
        ) : (
          <div />
        )}
      </Grid>
    </div>
  );
};

export default ConstructionTable;
