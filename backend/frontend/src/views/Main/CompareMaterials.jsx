// author: topr
// last updated: 28.04.2021
// currently used: yes
// description: rebuild of Comparison.jsx because I broke it

import React from "react";
import { useEffect, useContext, useState } from "react";

//Components
import { MainContext } from "./MainContext.jsx";

//Material UI
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import WarningIcon from "@material-ui/icons/Warning";
import CompareArrowsIcon from "@material-ui/icons/CompareArrows";
import Tooltip from "@material-ui/core/Tooltip";
import GetAppIcon from "@material-ui/icons/GetApp";

//Devexpress
import {
  SelectionState,
  SortingState,
  IntegratedSorting,
  IntegratedSelection,
  FilteringState,
  IntegratedFiltering,
} from "@devexpress/dx-react-grid";

import {
  Grid as GridDevExpress,
  Table,
  TableSelection,
  TableHeaderRow,
  TableFilterRow,
  Toolbar,
} from "@devexpress/dx-react-grid-material-ui";

// Import csv download component
import CsvDownload from "react-json-to-csv";

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
    width: 240,
  },
  textfield: { margin: 0, padding: 0, background: "white" },
  title: {
    fontSize: 13,
  },
  card_div: {
    marginBottom: 15,
  },
  formControl: {
    minWidth: 325,
  },
  root_card: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 20,
    marginBottom: 20,
    height: 200,
    width: 200,
  },
}));

const StyledRating = withStyles({
  iconFilled: {
    color: "#005000",
  },
  iconHover: {
    color: "#005000",
  },
})(Rating);

const CompareMaterials = () => {
  const classes = useStyles();

  const {
    selected_construction_id,
    selected_construction_title,
    comparison_data,
  } = useContext(MainContext);

  const [
    selectedConstructionId,
    setSelectedConstructionId,
  ] = selected_construction_id;

  const [
    selectedConstructionTitle,
    setSelectedConstructionTitle,
  ] = selected_construction_title;

  const [comparisonData, setComparisionData] = comparison_data;

  const [resultData, setResultData] = useState([]);

  const [columnsComparison] = useState([
    { name: "id", title: "Mat.Nr." },
    { name: "mat_desc", title: "Mat.Bez." },
    { name: "recycling_cat", title: "Rec.Kat." },
    { name: "mat_rw", title: "Rec.Fäh." },
    { name: "price", title: "Preis" },
    { name: "co2_value", title: "GWP" },
    { name: "resource_use", title: "ADPf" },
    { name: "impure", title: "Enthält Störstoffe" },
    { name: "dangerous", title: "Enthält Gefahrenstoffe" },
  ]);

  const [columnsResult] = useState([
    { name: "id", title: "Mat.Nr." },
    { name: "mat_desc", title: "Mat.Bez." },
    { name: "ranks", title: "Rang" },
    { name: "score", title: "Score" },
    { name: "recycling_cat", title: "Rec.Kat." },
    { name: "mat_rw", title: "Rec.Fäh." },
    { name: "price", title: "Preis" },
    { name: "co2_value", title: "GWP" },
    { name: "resource_use", title: "ADPf" },
    { name: "impure", title: "Enthält Störstoffe" },
    { name: "dangerous", title: "Enthält Gefahrenstoffe" },
  ]);

  const [tableColumnExtensions] = useState([
    { columnName: "id", width: 100 },
    { columnName: "mat_desc", width: 250 },
    { columnName: "recycling_cat", width: 100 },
    { columnName: "mat_rw", width: 100 },
    { columnName: "price", width: 80 },
    { columnName: "co2_value", width: 80 },
    { columnName: "resource_use", width: 80 },
    { columnName: "impure", width: 150 },
    { columnName: "dangerous", width: 170 },
  ]);

  const [rowSelection, setRowSelection] = useState([]);

  useEffect(() => {
    if (selectedConstructionTitle !== "Bitte auswaehlen") {
      fetch("/mat_eval_get/" + selectedConstructionId)
        .then((res) => {
          return res.json();
        })
        .then((d) => {
          console.log(selectedConstructionId);
          console.log(d);
          setComparisionData(d);
          console.log(comparisonData);
        });
    } else {
    }
  }, []);

  const [evaluationRatings, setEvaluationRatings] = useState({
    recycling: 2,
    co2: 2,
    price: 2,
    adpf: 2,
  });

  const initiateComparison = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        selectedIds: rowSelection.map((row) => comparisonData[row].id),
        recyclingWeight: Number(
          evaluationRatings.recycling /
            (evaluationRatings.price +
              evaluationRatings.co2 +
              evaluationRatings.recycling +
              evaluationRatings.adpf)
        ).toFixed(2),
        priceWeight: Number(
          evaluationRatings.price /
            (evaluationRatings.price +
              evaluationRatings.co2 +
              evaluationRatings.recycling +
              evaluationRatings.adpf)
        ).toFixed(2),
        co2Weight: Number(
          evaluationRatings.co2 /
            (evaluationRatings.price +
              evaluationRatings.co2 +
              evaluationRatings.recycling +
              evaluationRatings.adpf)
        ).toFixed(2),
        adpfWeight: Number(
          evaluationRatings.adpf /
            (evaluationRatings.price +
              evaluationRatings.co2 +
              evaluationRatings.recycling +
              evaluationRatings.adpf)
        ).toFixed(2),
      }),
      redirect: "follow",
    };

    fetch("/comparison", requestOptions)
      .then((res) => {
        return res.json();
      })
      .then((d) => {
        console.log(d);
        setResultData(d);
        console.log(resultData);
      });
  };

  return (
    <div>
      <Grid
        container
        item
        xs={12}
        style={{
          marginTop: 25,
          textAlign: "center",
        }}
      >
        <div>
          <GridDevExpress rows={comparisonData} columns={columnsComparison}>
            <SelectionState
              selection={rowSelection}
              onSelectionChange={setRowSelection}
            />
            <SortingState />
            <IntegratedSorting />
            <IntegratedSelection />
            <FilteringState defaultFilters={[]} />
        <IntegratedFiltering />
            <Table columnExtensions={tableColumnExtensions} />
            <TableSelection showSelectAll />
            <Toolbar />
            <TableFilterRow />
            <TableHeaderRow showSortingControls />
          </GridDevExpress>
        </div>
      </Grid>
      <Grid container item xs={12} justify="center">
        {rowSelection.length >= 2 == false ? (
          <div style={{ color: "red", marginTop: 20, marginBottom: 20 }}>
            <WarningIcon
              style={{ fontSize: "small", marginRight: 10 }}
            ></WarningIcon>{" "}
            Bitte wählen Sie mindestens 2 Materialien.
          </div>
        ) : (
          <div />
        )}
      </Grid>

      <Grid
        container
        item
        xs={12}
        style={{
          marginTop: 25,
          textAlign: "center",
        }}
      >
        <Grid item xs={4} style={{ marginTop: 30 }}>
          <Box component="fieldset" mb={3} borderColor="transparent">
            <Typography component="legend">Recyclingfähigkeit</Typography>
            <StyledRating
              name="recycling"
              value={evaluationRatings.recycling}
              max={10}
              onChange={(event, newValue) => {
                setEvaluationRatings({
                  ...evaluationRatings,
                  ["recycling"]: newValue,
                });
              }}
              icon={<FiberManualRecordIcon fontSize="inherit" />}
            />
          </Box>
          <Box component="fieldset" mb={3} borderColor="transparent">
            <Typography component="legend">Preis</Typography>
            <StyledRating
              name="price"
              value={evaluationRatings.price}
              max={10}
              onChange={(event, newValue) => {
                setEvaluationRatings({
                  ...evaluationRatings,
                  ["price"]: newValue,
                });
              }}
              icon={<FiberManualRecordIcon fontSize="inherit" />}
            />
          </Box>
          <Box component="fieldset" mb={3} borderColor="transparent">
            <Typography component="legend">GWP</Typography>
            <StyledRating
              name="co2"
              value={evaluationRatings.co2}
              max={10}
              onChange={(event, newValue) => {
                setEvaluationRatings({
                  ...evaluationRatings,
                  ["co2"]: newValue,
                });
              }}
              icon={<FiberManualRecordIcon fontSize="inherit" />}
            />
          </Box>
          <Box component="fieldset" mb={3} borderColor="transparent">
            <Typography component="legend">ADPf</Typography>
            <StyledRating
              name="adpf"
              value={evaluationRatings.adpf}
              max={10}
              onChange={(event, newValue) => {
                setEvaluationRatings({
                  ...evaluationRatings,
                  ["adpf"]: newValue,
                });
              }}
              icon={<FiberManualRecordIcon fontSize="inherit" />}
            />
          </Box>
        </Grid>
        <Grid item xs={8}>
          <Grid
            container
            item
            xs={12}
            style={{
              marginTop: 25,
              textAlign: "center",
            }}
          >
            <Grid container item xs={12}>
              <Grid item xs={3}>
                <Card className={classes.root_card} variant="outlined">
                  <CardContent>
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                      align="center"
                    >
                      Gewichtung Recyclingwert
                    </Typography>
                    <Typography variant="h5" component="h2" align="center">
                      {Number(
                        (evaluationRatings.recycling * 100) /
                          (evaluationRatings.price +
                            evaluationRatings.co2 +
                            evaluationRatings.recycling +
                            evaluationRatings.adpf)
                      ).toFixed(2)}{" "}
                      %
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={3}>
                {" "}
                <Card className={classes.root_card} variant="outlined">
                  <CardContent>
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                      align="center"
                    >
                      Gewichtung Preis
                    </Typography>
                    <Typography variant="h5" component="h2" align="center">
                      {Number(
                        (evaluationRatings.price * 100) /
                          (evaluationRatings.price +
                            evaluationRatings.co2 +
                            evaluationRatings.recycling +
                            evaluationRatings.adpf)
                      ).toFixed(2)}{" "}
                      %
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card className={classes.root_card} variant="outlined">
                  <CardContent>
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                      align="center"
                    >
                      Gewichtung Globales Erwärmungspotential (GWP)
                    </Typography>
                    <Typography variant="h5" component="h2" align="center">
                      {Number(
                        (evaluationRatings.co2 * 100) /
                          (evaluationRatings.price +
                            evaluationRatings.co2 +
                            evaluationRatings.recycling +
                            evaluationRatings.adpf)
                      ).toFixed(2)}{" "}
                      %
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card className={classes.root_card} variant="outlined">
                  <CardContent>
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                      align="center"
                    >
                      Gewichtung Abiotischer-Ressourcen-Verbrauch (ADPf)
                    </Typography>
                    <Typography variant="h5" component="h2" align="center">
                      {Number(
                        (evaluationRatings.adpf * 100) /
                          (evaluationRatings.price +
                            evaluationRatings.co2 +
                            evaluationRatings.recycling +
                            evaluationRatings.adpf)
                      ).toFixed(2)}{" "}
                      %
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid container item xs={12} justify="center">
                <Tooltip
                  title={
                    <Typography variant="body1">
                      Hiermit können Sie ausgewählte Materialien miteinander
                      vergleichen.
                    </Typography>
                  }
                >
                  <Button
                    className={classes.buttons}
                    onClick={initiateComparison}
                  >
                    <CompareArrowsIcon
                      style={{ marginRight: 5 }}
                    ></CompareArrowsIcon>
                    Vergleich durchführen
                  </Button>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid
        container
        item
        xs={12}
        style={{
          marginTop: 25,
          marginBottom: 25,
          textAlign: "center",
        }}
      >
        <div>
          <GridDevExpress rows={resultData} columns={columnsResult}>
            <SortingState />
            <IntegratedSorting />
            <Table columnExtensions={tableColumnExtensions} />
            <Toolbar />
            <TableHeaderRow showSortingControls />
          </GridDevExpress>
        </div>
      </Grid>
      <Grid
        container
        item
        xs={12}
        justify="center"
        style={{
          marginTop: 25,
          marginBottom: 25,
          textAlign: "center",
        }}
      >
                  <Tooltip
            title={
              <Typography variant="body1">
                Hiermit können Sie den Vergleich der Materialien als csv-Datei exportieren.
              </Typography>
            }
          >
            <div>
              <CsvDownload
                data={resultData}
                filename="dimop_comparison.csv"
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
    </div>
  );
};

export default CompareMaterials;
