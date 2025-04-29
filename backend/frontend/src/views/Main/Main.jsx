// Main component: Contains everything relevant

// Import react components
import React from "react";
import { useContext, useState, useEffect } from "react";

// Import clsx
import clsx from "clsx";

// Import own components
import PartnerLogos from "../../components/PartnerLogos/PartnerLogos";
import NavBar from "../../components/NavBar/NavBar";
import TableTree from "./TableTree.jsx";
import ConstructionsTable from "./ConstructionsTable.jsx";
import CompareMaterials from "./CompareMaterials.jsx";
import { MainContext } from "./MainContext.jsx";

// Import material ui components
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import MaterialUIToolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import AccountTreeOutlinedIcon from "@material-ui/icons/AccountTreeOutlined";
import RateReviewOutlinedIcon from "@material-ui/icons/RateReviewOutlined";
import Typography from "@material-ui/core/Typography";

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
    "&:hover": {
      backgroundColor: "red",
      color: "blue",
    },
  },
  label: { marginTop: 10 },
  buttonbox: {
    textAlign: "right",
    paddingTop: 15,
    paddingBottom: 15,
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
  highlighted: {
    // color: "#005000",
    color: "#f1c40f",
  },
}));

// Component Main
const Main = () => {

  // Declare variable for useStyles
  const classes = useStyles();

  // Import global variables via useContext
  const {
    selected_construction_id,
    selected_construction_title,
  } = useContext(MainContext);

  // Declare variables imported from MainContext.jsx
  const [
    selectedConstructionId,
    setSelectedConstructionId,
  ] = selected_construction_id;
  const [
    selectedConstructionTitle,
    setSelectedConstructionTitle,
  ] = selected_construction_title;

  // Declare variables
  const [contentNum, setContentNum] = useState(1);

  return (
    <div>
      {/* Contains component NavBar.jsx */}
      <NavBar></NavBar>
      {/* Contains component PartnerLogos.jsx */}
      <PartnerLogos></PartnerLogos>
      {/* Contains AppBar. Can switch between ConstructionsTable.jsx,
      TableTree.jsx and CompareMaterials.jsx"  */}
      <AppBar position="relative" style={{ background: "#007F3D" }}>
        <MaterialUIToolbar>
          <Grid container alignItems="center">
            <Grid item xs={6}>
              {/* Shows which construction is currently constructed */}
              <Typography variant="h6" noWrap>
                {"Konstruktion: " +
                  selectedConstructionId +
                  " " +
                  selectedConstructionTitle}
              </Typography>
            </Grid>
            {/* Contains icons which can be used to choose content */}
            <Grid item xs={6}>
              <Grid
                container
                direction="row"
                justify="space-around"
                alignItems="center"
              >
                <InfoOutlinedIcon
                  style={{
                    fontSize: 32,
                    cursor: "pointer",
                  }}
                  onClick={() => setContentNum(1)}
                  className={clsx({
                    [classes.highlighted]: contentNum === 1 ? true : false,
                  })}
                />
                <AccountTreeOutlinedIcon
                  style={{
                    fontSize: 32,
                    cursor: "pointer",
                  }}
                  onClick={() => setContentNum(2)}
                  className={clsx({
                    [classes.highlighted]: contentNum === 2 ? true : false,
                  })}
                />
                <RateReviewOutlinedIcon
                  style={{
                    fontSize: 32,
                    cursor: "pointer",
                  }}
                  onClick={() => setContentNum(3)}
                  className={clsx({
                    [classes.highlighted]: contentNum === 3 ? true : false,
                  })}
                />
              </Grid>
            </Grid>
          </Grid>
        </MaterialUIToolbar>
      </AppBar>
      <Grid container item xs={12}>
        <Grid item xs={1}></Grid>

        <Grid item xs={10}>
          <div>
            {/* Check selected Button */}
            {contentNum === 1 ? (
              <ConstructionsTable></ConstructionsTable>
            ) : contentNum === 2 ? (
              <TableTree></TableTree>
            ) : contentNum === 3 ? (
              <CompareMaterials></CompareMaterials>
            ) : (
              <div></div>
            )}
          </div>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </div>
  );
};

export default Main;
