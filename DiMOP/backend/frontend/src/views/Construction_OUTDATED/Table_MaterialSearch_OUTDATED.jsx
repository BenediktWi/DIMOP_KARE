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
    padding: 10,
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

export default function TableMaterialSearch() {
  // get debugging API variable
  const { use_API, API_Host, API_User } = useContext(APIContext);
  const [useAPI, setUseAPI] = use_API;
  const [APIHost, setAPIHost] = API_Host;
  const [APIUser, setAPIUser] = API_User;

  // get managed states from context
  const {
    selected_material,
    loaded_cons,
    search_material_columns,
    search_material_rows,
    need_refresh_search_material,
    search_material_api_loaded,
  } = useContext(ConstructionContext);
  const [selectedMaterial, setSelectedMaterial] = selected_material;
  const [loadedCons, setLoadedCons] = loaded_cons;
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
    searchMaterialApiloaded,
    setSearchMaterialApiLoaded,
  ] = search_material_api_loaded;

  // states for table
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [emptyRows, setEmptyRows] = useState(0);

  // useEffect for managing refresh on search button with circular progress for waiting
  useEffect(() => {
    if (Object.keys(loadedCons).length !== 0) {
      if (useAPI) {
        const timer = setTimeout(() => {
          // console.log('This will run after 1 second!')
          setSearchMaterialApiLoaded(true);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        setSearchMaterialApiLoaded(true);
      }
    } else {
      setSearchMaterialApiLoaded(true);
    }
    setNeedRefreshSearchMaterial(false);
  }, [needRefreshSearchMaterial]);

  // handle checkbox management || all & single/multi
  const handleSelectAllClick = (e) => {
    if (e.target.checked) {
      const newSelecteds = searchMaterialRows.map((n) => n);
      setSelectedMaterial(newSelecteds);
      return;
    }
    setSelectedMaterial([]);
  };

  const handleClick = (e, name) => {
    const selectedIndex = selectedMaterial.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedMaterial, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedMaterial.slice(1));
    } else if (selectedIndex === selectedMaterial.length - 1) {
      newSelected = newSelected.concat(selectedMaterial.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedMaterial.slice(0, selectedIndex),
        selectedMaterial.slice(selectedIndex + 1)
      );
    }
    setSelectedMaterial(newSelected);
  };

  // handle page management
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    const empty = Math.min(
      rowsPerPage -
        Math.min(
          rowsPerPage,
          searchMaterialRows.length - Number(page) * rowsPerPage
        )
    );
    setEmptyRows(empty);
  }, [page, searchMaterialRows]);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const isSelected = (name) => selectedMaterial.indexOf(name) !== -1;

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
      {useAPI && !searchMaterialApiloaded ? (
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
                        selectedMaterial.length > 0 &&
                        selectedMaterial.length < searchMaterialRows.length
                      }
                      checked={
                        searchMaterialRows.length > 0 &&
                        selectedMaterial.length === searchMaterialRows.length
                      }
                      onChange={handleSelectAllClick}
                      inputProps={{ "aria-label": "select all desserts" }}
                    />
                  </TableCell>
                  {searchMaterialColumns.map((column) => (
                    <TableCell
                      key={column.col_id}
                      align={column.align}
                      sortDirection={orderBy === column.col_id ? order : false}
                      style={{
                        minWidth: column.minWidth,
                        background: "#005000",
                        color: "white",
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === column.col_id}
                        direction={orderBy === column.col_id ? order : "asc"}
                        onClick={createSortHandler(column.col_id)}
                      >
                        {column.label}
                        {orderBy === column.col_id ? (
                          <span className={classes.visuallyHidden}>
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
                {stableSort(searchMaterialRows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ "aria-labelledby": labelId }}
                          />
                        </TableCell>
                        {searchMaterialColumns.map((column) => {
                          const value = row[column.col_id];
                          return (
                            <TableCell key={column.col_id} align={column.align}>
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 50 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={searchMaterialRows.length}
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
