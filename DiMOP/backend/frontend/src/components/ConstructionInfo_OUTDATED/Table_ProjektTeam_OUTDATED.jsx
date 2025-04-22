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
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import Checkbox from "@material-ui/core/Checkbox";
import { CircularProgress } from "@material-ui/core";
import TableSortLabel from "@material-ui/core/TableSortLabel";

import { APIContext } from "../../APIContext";
import { ConstructionContext } from "../../views/Construction/ConstructionContext";

import TableProjektTeam_JSON from "../../files/table_projektteam.json";

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

export default function TableProjektteam() {
    // get debugging API variable
    const { use_API, API_Host } = useContext(APIContext);
    const [useAPI, setUseAPI] = use_API;
    const [APIHost, setAPIHost] = API_Host;

    // get managed states from context
    const {
        selected_user,
        need_refresh_project_team,
        loaded_cons,
    } = useContext(ConstructionContext);
    const [selectedUser, setSelectedUser] = selected_user;
    const [
        needRefreshProjectTeam,
        setNeedRefreshProjectTeam,
    ] = need_refresh_project_team;
    const [loadedCons, setLoadedCons] = loaded_cons;

    // states for table
    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [emptyRows, setEmptyRows] = useState(0);

    // get data from json
    const rows_json = TableProjektTeam_JSON.Table_Projekt_Team_Data;
    const [rows, setRows] = useState(rows_json);

    // get data from api
    const [apidataloaded, setapidataloaded] = useState(false);

    const transformTableData = (data) => {
        if (data !== null) {
            const source = data.map((item) => {
                return {
                    id: item.id,
                    name: item.firstname + " " + item.surname,
                    funktion: item.function,
                    organisation: item.orga_name,
                    email: item.e_mail,
                    user_read: Boolean(item.auth_read),
                    user_write: Boolean(item.auth_write),
                    user_delete: Boolean(item.auth_delete),
                };
            });
            setRows(source);
        } else {
            setRows([]);
        }
    };

    // useEffect for managing setRow initial & onRefresh
    useEffect(() => {
        setSelectedUser([]);
        if (Object.keys(loadedCons).length !== 0) {
            if (useAPI) {
                fetch(APIHost + "/perp/" + loadedCons.id)
                    .then((res) => res.json())
                    .then((data) => {
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
    }, [loadedCons, needRefreshProjectTeam]);

    // get columns
    const columns = useAPI
        ? [
              { col_id: "name", label: "Name" },
              { col_id: "funktion", label: "Funktion" },
              { col_id: "organisation", label: "Organisation" },
              { col_id: "email", label: "E-Mail" },
              { col_id: "user_read", label: "Lesen" },
              { col_id: "user_write", label: "Schreiben" },
              { col_id: "user_delete", label: "Löschen" },
          ]
        : TableProjektTeam_JSON.Table_Projekt_Team_Columns;

    // handle single checkbox management
    const handleClick = (e, name) => {
        setSelectedUser([name]);
    };

    // page management
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

    const isSelected = (name) => selectedUser.indexOf(name) !== -1;

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

    // circular progress if useapi and nodataloaded yet
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
                                    ></TableCell>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.col_id}
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
                                                            align={
                                                                typeof value ===
                                                                "number"
                                                                    ? "center"
                                                                    : "left"
                                                            }
                                                        >
                                                            <div>
                                                                {column.format &&
                                                                typeof value ===
                                                                    "number"
                                                                    ? column.format(
                                                                          value
                                                                      )
                                                                    : value}
                                                                {value ===
                                                                    true &&
                                                                column.col_id ===
                                                                    "user_read" ? (
                                                                    <VisibilityOutlinedIcon />
                                                                ) : value ===
                                                                      true &&
                                                                  column.col_id ===
                                                                      "user_write" ? (
                                                                    <CreateOutlinedIcon />
                                                                ) : value ===
                                                                      true &&
                                                                  column.col_id ===
                                                                      "user_delete" ? (
                                                                    <DeleteOutlineOutlinedIcon />
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </div>
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
                        rowsPerPageOptions={[5, 10, 25]}
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
