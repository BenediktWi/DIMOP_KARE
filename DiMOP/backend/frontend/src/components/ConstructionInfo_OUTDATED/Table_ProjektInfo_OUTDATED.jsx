import React, { useContext, useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { CircularProgress } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import TableSortLabel from "@material-ui/core/TableSortLabel";

import { APIContext } from "../../APIContext";
import { ConstructionContext } from "../../views/Construction/ConstructionContext";

import TableProjektInfos_JSON from "../../files/table_projektinfos.json";

import moment from "moment";

// css theme
const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
    },
    container: {
        maxHeight: 440,
    },
    table: {
        minWidth: 750,
    },
    progress: {
        textAlign: "center",
        justifyContent: "center",
        padding: 15,
    },
    visuallyHidden: {
        border: 0,
        clip: "rect(0 0 0 0)",
        height: 1,
        margin: -1,
        overflow: "hidden",
        padding: 0,
        position: "absolute",
        top: 20,
        width: 1,
    },
}));

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

export default function TableProjektInfo() {
    // get debugging API variable
    const { use_API, API_Host } = useContext(APIContext);
    const [useAPI, setUseAPI] = use_API;
    const [APIHost, setAPIHost] = API_Host;

    // get managed states from context
    const {
        selected_alternative,
        need_refresh_project_info,
        loaded_cons,
    } = useContext(ConstructionContext);
    const [selectedAlternative, setSelectedAlternative] = selected_alternative;
    const [
        needRefreshProjectInfo,
        setNeedRefreshProjectInfo,
    ] = need_refresh_project_info;
    const [loadedCons, setLoadedCons] = loaded_cons;

    // states for table
    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(3);
    const [emptyRows, setEmptyRows] = useState(0);

    // get data from json
    const rows_json = TableProjektInfos_JSON.Table_Projekt_Info_Data;
    const [rows, setRows] = useState(rows_json);

    // transform unix timestamp
    const changeDt = (dt) => {
        if (dt !== null && dt !== undefined) {
            var newDate = moment(dt).format("DD.MM.YYYY HH:MM");
            return newDate;
        } else return dt;
    };

    // transform number to bool

    const changeNumbertoBool = (number) => {
        if (number === 0) {
            return false;
        } else if (number === 1) {
            return true;
        }
    };

    // transform JSON/API Data
    const transformTableData = (data) => {
        if (data !== null) {
            const source = data.map((item) => {
                return {
                    id: item.id,
                    bom_desc: item.bom_desc,
                    mara_nr: item.mara_nr,
                    mat_desc: item.mat_desc,
                    bom_al: item.bom_al,
                    bom_al_desc: item.bom_al_desc,
                    mara_id: item.mara_id,
                    creator: item.firstname + " " + item.surname,
                    created_at: changeDt(item.created_at),
                    updated_at: changeDt(item.updated_at),
                    cad_nr: item.cad_nr,
                    fav: changeNumbertoBool(item.fav),
                };
            });
            setRows(source);
        } else setRows([]);
    };

    // get data from api
    const [apidataloaded, setapidataloaded] = useState(false);

    // useEffect for managing setRow initial & onRefresh
    useEffect(() => {
        setSelectedAlternative([]);
        if (Object.keys(loadedCons).length !== 0) {
            if (useAPI) {
                fetch(APIHost + "/bomal/" + loadedCons.id)
                    .then((res) => res.json())
                    .then((data) => {
                        console.log(data);
                        transformTableData(data);
                        const timer = setTimeout(() => {
                            // console.log('This will run after 1 second!')
                            setapidataloaded(true);
                        }, 1000);
                        return () => clearTimeout(timer);
                    })
                    .catch(console.log);
            } else {
                transformTableData(rows_json);
                setapidataloaded(true);
            }
        } else {
            setRows([]);
            setapidataloaded(true);
        }
    }, [loadedCons, needRefreshProjectInfo]);

    // get columns
    const columns = useAPI
        ? TableProjektInfos_JSON.Table_Projekt_Info_Columns
        : [
              { col_id: "mara_nr", label: "Materialnummer" },
              { col_id: "mat_desc", label: "Materialbezeichnung" },
              { col_id: "bom_al", label: "Alternative" },
              { col_id: "creator", label: "Ersteller" },
              { col_id: "created_at", label: "Erstelldatum" },
              { col_id: "updated_at", label: "Änderungsdatum" },
              { col_id: "cad_nr", label: "CAD-Zeichnung" },
          ];

    // handle checkbox management || all & single/multi
    const handleSelectAllClick = (e) => {
        if (e.target.checked) {
            const newSelecteds = rows.map((n) => n);
            setSelectedAlternative(newSelecteds);
            return;
        }
        setSelectedAlternative([]);
    };

    const handleClick = (e, name) => {
        const selectedIndex = selectedAlternative.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedAlternative, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedAlternative.slice(1));
        } else if (selectedIndex === selectedAlternative.length - 1) {
            newSelected = newSelected.concat(selectedAlternative.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedAlternative.slice(0, selectedIndex),
                selectedAlternative.slice(selectedIndex + 1)
            );
        }
        setSelectedAlternative(newSelected);
    };

    // handle page management
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    useEffect(() => {
        const empty = Math.min(
            rowsPerPage -
                Math.min(rowsPerPage, rows.length - Number(page) * rowsPerPage)
        );
        setEmptyRows(empty);
    }, [page, rows]);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const isSelected = (name) => selectedAlternative.indexOf(name) !== -1;

    // sorting columns
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("calories");

    const createSortHandler = (property) => (event) => {
        handleRequestSort(event, property);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    // table code
    return (
        <Paper className={classes.root}>
            {!apidataloaded && useAPI ? (
                <div className={classes.progress}>
                    <CircularProgress />
                    <br />
                </div>
            ) : (
                <div>
                    <TableContainer className={classes.container}>
                        <Table
                            className={classes.table}
                            aria-labelledby="tableTitle"
                            size="medium"
                            aria-label="enhanced table"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        padding="checkbox"
                                        style={{ background: "#005000" }}
                                    >
                                        <Checkbox
                                            style={{ color: "white" }}
                                            indeterminate={
                                                selectedAlternative.length >
                                                    0 &&
                                                selectedAlternative.length <
                                                    rows.length
                                            }
                                            checked={
                                                rows.length > 0 &&
                                                selectedAlternative.length ===
                                                    rows.length
                                            }
                                            onChange={handleSelectAllClick}
                                            inputProps={{
                                                "aria-label":
                                                    "select all desserts",
                                            }}
                                        />
                                    </TableCell>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.col_id}
                                            align={column.align}
                                            sortDirection={
                                                orderBy === column.col_id
                                                    ? order
                                                    : false
                                            }
                                            style={{
                                                minWidth: column.minWidth,
                                                background: "#005000",
                                                color: "white",
                                            }}
                                        >
                                            <TableSortLabel
                                                active={
                                                    orderBy === column.col_id
                                                }
                                                direction={
                                                    orderBy === column.col_id
                                                        ? order
                                                        : "asc"
                                                }
                                                onClick={createSortHandler(
                                                    column.col_id
                                                )}
                                            >
                                                {column.label}
                                                {orderBy === column.col_id ? (
                                                    <span
                                                        className={
                                                            classes.visuallyHidden
                                                        }
                                                    >
                                                        {order === "desc"
                                                            ? "sorted descending"
                                                            : "sorted ascending"}
                                                    </span>
                                                ) : null}
                                            </TableSortLabel>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {stableSort(rows, getComparator(order, orderBy))
                                    .slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                    )
                                    .map((row, index) => {
                                        const isItemSelected = isSelected(row);
                                        const labelId = `enhanced-table-checkbox-${index}`;
                                        return (
                                            <TableRow
                                                hover
                                                onClick={(event) =>
                                                    handleClick(event, row)
                                                }
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row.id}
                                                selected={isItemSelected}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            "aria-labelledby": labelId,
                                                        }}
                                                    />
                                                </TableCell>
                                                {columns.map((column) => {
                                                    const value =
                                                        row[column.col_id];
                                                    return (
                                                        <TableCell
                                                            key={column.col_id}
                                                            align={column.align}
                                                        >
                                                            {column.format &&
                                                            typeof value ===
                                                                "number"
                                                                ? column.format(
                                                                      value
                                                                  )
                                                                : value}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{ height: 50 * emptyRows }}
                                    >
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[3, 5, 10]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </div>
            )}
        </Paper>
    );
}
