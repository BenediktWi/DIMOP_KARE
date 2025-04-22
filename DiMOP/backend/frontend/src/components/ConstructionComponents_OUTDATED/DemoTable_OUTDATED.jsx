import React from "react";
import { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import DemoData from "../../files/demo_data.json";
import {
    TableHead,
    TableRow,
    TableCell,
    IconButton,
    Table,
    TableBody,
    Button,
    Grid,
    Card,
    CardContent,
    Typography,
} from "@material-ui/core";

import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";

const useStyles = makeStyles((theme) => ({
    root_card: {
        marginTop: 15,
        marginBottom: 0,
    },
    title: {
        fontSize: 13,
    },
}));

const Row = (props) => {
    const [open, setOpen] = useState(false);

    let parent, childRows;

    const fillRowWithData = (elem, depth, isParent = false) => {
        return (
            <TableRow
                style={{
                    backgroundColor: isParent ? "#ecf0f1" : "#95a5a6",
                }}
                // style={{
                //     backgroundColor: `rgb(${(122 + depth * 42) % 255}, ${
                //         (112 + depth * 32) % 255
                //     },${(136 + depth * 12) % 255})`,
                // }}
            >
                <TableCell style={{ paddingLeft: 16 + 32 * depth }}>
                    {isParent ? (
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                            // onClick={(e) => handleRowClick(e)}
                        >
                            {open ? (
                                <KeyboardArrowDownIcon />
                            ) : (
                                <KeyboardArrowRightIcon />
                            )}
                        </IconButton>
                    ) : (
                        ""
                    )}
                </TableCell>
                <TableCell>{elem.mast_id}</TableCell>
                <TableCell>{elem.parent_id}</TableCell>
                <TableCell>{elem.desc}</TableCell>
                <TableCell>{elem.mat}</TableCell>
                <TableCell>{elem.height_erp}</TableCell>
                <TableCell>{elem.width_erp}</TableCell>
                <TableCell>{elem.depth_erp}</TableCell>
                <TableCell>{elem.unit_erp}</TableCell>
                <TableCell>{elem.volume_cad}</TableCell>
                <TableCell>{elem.unit_cad}</TableCell>
                <TableCell>{elem.weight_ui}</TableCell>
                <TableCell>{elem.weight_unit}</TableCell>
                <TableCell
                    style={{
                        backgroundColor:
                            elem.recycle_val == 0
                                ? "#2ecc71"
                                : elem.recycle_val == 1
                                ? "#f39c12"
                                : elem.recycle_val == 2
                                ? "#e74c3c"
                                : "",
                    }}
                >
                    {/* {elem.recycle_val} */}
                </TableCell>
            </TableRow>
        );
    };

    parent = fillRowWithData(props.row, props.level, true);

    // get all elements with parent_id == elem.id
    let children = DemoData.alternatives[
        props.selectedAlternative
    ].tableData.filter((e) => e.parent_id == props.row.mast_id);

    if (children.length > 0) {
        //if there are children get all children of children
        childRows = children.map((c) => {
            return (
                <Row
                    key={c.id}
                    level={props.level + 1}
                    row={c}
                    selectedAlternative={props.selectedAlternative}
                />
            );
        });
    } else {
        //abbruch
        return fillRowWithData(props.row, props.level, false);
    }

    return open ? [parent, childRows] : [parent];
};

const DemoTable = () => {
    const classes = useStyles();

    // const [data, setData] = useState(DemoData);
    const [selectedAlternative, setSelectedAlternative] = useState(0);

    const [recyclingValue, setRecyclingValue] = useState(
        DemoData.alternatives[selectedAlternative].KPI.Recyclingwert
    );
    const [price, setPrice] = useState(
        DemoData.alternatives[selectedAlternative].KPI.Preis
    );
    const [co, setCo] = useState(
        DemoData.alternatives[selectedAlternative].KPI.CO2
    );
    const [weight, setWeight] = useState(
        DemoData.alternatives[selectedAlternative].KPI.Gewicht
    );

    // const selectAlternative = () => {};

    return (
        <div style={{ marginTop: 0 }}>
            <Grid container style={{ marginTop: 32 }}>
                <Typography variant="h5" component="h2">
                    Alternative auswählen
                </Typography>

                {DemoData.alternatives.map((e) => {
                    return (
                        <Grid item key={"button" + e.id}>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setSelectedAlternative(e.id);

                                    setRecyclingValue(
                                        DemoData.alternatives[e.id].KPI
                                            .Recyclingwert
                                    );
                                    setPrice(
                                        DemoData.alternatives[e.id].KPI.Preis
                                    );
                                    setCo(DemoData.alternatives[e.id].KPI.CO2);
                                    setWeight(
                                        DemoData.alternatives[e.id].KPI.Gewicht
                                    );
                                }}
                                style={{ marginLeft: 32 }}
                            >
                                {e.displayName}
                            </Button>
                        </Grid>
                    );
                })}
            </Grid>
            <Table>
                {/* Create Table Header */}
                {/* TODO: use mapping */}
                <TableHead>
                    <TableRow>
                        {DemoData.alternatives[
                            selectedAlternative
                        ].tableColumns.map((column) => (
                            <TableCell key={column.name}>
                                {column.title}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/* Create Table Rows */}
                    {DemoData.alternatives[selectedAlternative].tableData
                        .filter((e) => e.parent_id == null)
                        .map((elem) => {
                            console.log(elem);
                            return (
                                <Row
                                    key={elem.mast_id}
                                    level={0}
                                    row={elem}
                                    selectedAlternative={selectedAlternative}
                                />
                            );
                        })}
                </TableBody>
            </Table>
            <Grid
                container
                direction="row"
                justify="space-evenly"
                alignItems="center"
            >
                <Grid item xs={2}>
                    <Card className={classes.root_card} variant="outlined">
                        <CardContent>
                            <Typography
                                align="center"
                                className={classes.title}
                                color="textSecondary"
                                gutterBottom
                            >
                                Recycling-Wert
                            </Typography>
                            <Typography
                                align="center"
                                variant="h5"
                                component="h2"
                            >
                                {recyclingValue || ""}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={2}>
                    <Card className={classes.root_card} variant="outlined">
                        <CardContent>
                            <Typography
                                align="center"
                                className={classes.title}
                                color="textSecondary"
                                gutterBottom
                            >
                                CO2-Wert
                            </Typography>
                            <Typography
                                align="center"
                                variant="h5"
                                component="h2"
                            >
                                {co || ""}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={2}>
                    <Card className={classes.root_card} variant="outlined">
                        <CardContent>
                            <Typography
                                align="center"
                                className={classes.title}
                                color="textSecondary"
                                gutterBottom
                            >
                                Preis
                            </Typography>
                            <Typography
                                align="center"
                                variant="h5"
                                component="h2"
                            >
                                {price || ""}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={2}>
                    <Card className={classes.root_card} variant="outlined">
                        <CardContent>
                            <Typography
                                className={classes.title}
                                color="textSecondary"
                                gutterBottom
                                align="center"
                            >
                                Gewicht
                            </Typography>
                            <Typography
                                variant="h5"
                                component="h2"
                                align="center"
                            >
                                {weight || ""}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default DemoTable;
