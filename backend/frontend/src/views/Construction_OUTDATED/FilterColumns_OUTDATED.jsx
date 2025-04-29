import React, { useContext, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";

import { ConstructionContext } from "../../views/Construction/ConstructionContext";

// css theme
const useStyles = makeStyles((theme) => ({
  Button: {
    marginLeft: 10,
  },
}));

export default function FilterColumns() {
  const classes = useStyles();

  // get managed states from context
  const {
    open_filter_columns,
    filter_columns_show_columns,
    filter_columns_selected,
    search_material_columns_source,
  } = useContext(ConstructionContext);
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

  const handleClose = () => {
    console.log(filterColumnsSelected);
    setFilterColumnsShowColumns(filterColumnsSelected);
    setOpenFilterColumns(false);
  };
  const handleCloseBreak = () => {
    console.log(filterColumnsSelected);
    setOpenFilterColumns(false);
  };

  const handleToggle = (value) => () => {
    const currentIndex = filterColumnsSelected.indexOf(value);
    const newChecked = [...filterColumnsSelected];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setFilterColumnsSelected(newChecked);
  };

  return (
    <Dialog
      open={openFilterColumns}
      onClose={handleCloseBreak}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">{"Spalten anzeigen"}</DialogTitle>
      <DialogContent>
        <DialogContentText component={"span"}>
          <List className={classes.root}>
            {searchMaterialColumnsSource.map((value) => {
              const labelId = `checkbox-list-label-${value.label}`;
              return (
                <ListItem
                  key={value.label}
                  role={undefined}
                  dense
                  button
                  onClick={handleToggle(value.label)}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={
                        filterColumnsSelected.indexOf(value.label) !== -1
                      }
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={value.label} />
                </ListItem>
              );
            })}
          </List>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={handleCloseBreak}
          variant="outlined"
          className={classes.Button}
        >
          Abbrechen
        </Button>
        <Button
          onClick={handleClose}
          variant="outlined"
          autoFocus
          className={classes.Button}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
