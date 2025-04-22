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
import Checkbox from "@material-ui/core/Checkbox";
import { CircularProgress } from "@material-ui/core";

import { APIContext } from "../../APIContext";
import { ConstructionContext } from "./ConstructionContext";

import TableConstructionLoad_JSON from "../../files/table_constructionload.json";

import moment from "moment";

// css theme
const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
    },
    container: {
        maxHeight: 440,
    },
    paper: {
        width: "100%",
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    progress: {
        textAlign: "center",
        justifyContent: "center",
        padding: 15,
    },
}));

export default function TableConstructionLoad() {
    // get debugging API variable
    const { use_API, API_Host, API_User } = useContext(APIContext);
    const [useAPI, setUseAPI] = use_API;
    const [APIHost, setAPIHost] = API_Host;
    const [APIUser, setAPIUser] = API_User;

    // get managed states from context
    const {
        selected_cons_load,
        selected_cons_delete,
        open_load_cons,
        open_delete_cons,
    } = useContext(ConstructionContext);
    const [selectedConsLoad, setSelectedConsLoad] = selected_cons_load;
    const [selectedConsDelete, setSelectedConsDelete] = selected_cons_delete;
    const [openLoadCons, setOpenLoadCons] = open_load_cons;
    const [openDeleteCons, setOpenDeleteCons] = open_delete_cons;

    // states for table
    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [emptyRows, setEmptyRows] = useState(0);

    // get data from json
    const rows_json = TableConstructionLoad_JSON.ConstructionLoadData;
    const [rows, setRows] = useState(rows_json);

    // transform unix timestamp
    const changeDt = (dt) => {
        if (dt !== null && dt !== undefined) {
            var newDate = moment(dt).format("DD.MM.YYYY HH:MM");
            return newDate;
        } else return dt;
    };

    // transform JSON/API Data
    const transformTableData = (data) => {
        const source = data.map((item) => {
            return {
                id: item.id,
                kons_title: item.kons_title,
                kons_desc: item.kons_desc,
                orga_name: item.orga_name,
                mara_id: item.mara_id,
                created_at: changeDt(item.created_at),
                created_from: item.created_from,
                updated_at: changeDt(item.updated_at),
            };
        });
        setRows(source);
    };

    // get data from api
    const [apidataloaded, setapidataloaded] = useState(false);

    useEffect(() => {
        if (useAPI) {
            fetch(APIHost + "/kons/" + APIUser)
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
        }
    }, []);

    // get columns
    const columns = !useAPI
        ? TableConstructionLoad_JSON.ConstructionLoadColumns
        : [
              { col_id: "id", label: "Id" },
              { col_id: "kons_title", label: "Name" },
              { col_id: "kons_desc", label: "Beschreibung" },
              { col_id: "orga_name", label: "Organisation" },
              { col_id: "mara_id", label: "Material" },
              { col_id: "created_at", label: "Erstellungsdatum" },
              { col_id: "created_from", label: "Ersteller" },
              { col_id: "updated_at", label: "Änderungsdatum" },
          ];

    // handle single checkbox management
    const handleClick = (e, name) => {
        if (openLoadCons) {
            setSelectedConsLoad([name]);
        } else if (openDeleteCons) {
            setSelectedConsDelete([name]);
        }
    };

    // page management
    const handleChangePage = (e, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(+e.target.value);
        setPage(0);
    };

    useEffect(() => {
        const empty = Math.min(
            1,
            rowsPerPage -
                Math.min(rowsPerPage, rows.length - Number(page) * rowsPerPage)
        );
        setEmptyRows(empty);
    }, [page, rows]);

    const [loadDeleteSwitcher, setLoadDeleteSwitcher] = useState("");
    const isSelected = (name) => {
        if (openDeleteCons === true || loadDeleteSwitcher === "delete") {
            if (loadDeleteSwitcher !== "delete") {
                setLoadDeleteSwitcher("delete");
            }
            return selectedConsDelete.indexOf(name) !== -1;
        } else if (openLoadCons === true || loadDeleteSwitcher === "load") {
            if (loadDeleteSwitcher !== "load") {
                setLoadDeleteSwitcher("load");
            }
            return selectedConsLoad.indexOf(name) !== -1;
        }
    };

    // table hmtml structure // circular progress if api is loading
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
                                            style={{
                                                minWidth: column.minWidth,
                                                background: "#005000",
                                                color: "white",
                                            }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows
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
                                                                "boolean"
                                                                    ? "center"
                                                                    : "left"
                                                            }
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
