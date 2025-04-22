
// Import react components
import React, { useContext, useEffect, useRef, useState } from "react";

// Import own components
import { MainContext } from "../../views/Main/MainContext.jsx";
import MaterialSearch from "../../views/Main/MaterialSearch.jsx";

// Import material ui components
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import Slide from "@material-ui/core/Slide";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Component SearchDialog
export const SearchDialog = (props) => {
  const descriptionElementRef = useRef(null);

  useEffect(() => {
    if (props.open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [props.open]);

  // Declare variable for useStates
  const { selection_atomic } = useContext(MainContext);

  // Declare variables imported from MainContext.jsx
  const [selectionAtomic, setSelectionAtomic] = selection_atomic;

  return (
    <div>
      {/* Dialog the opens from TableTree.jsx */}
      <Dialog
        open={props.open}
        TransitionComponent={Transition}
        fullWidth
        maxWidth="lg"
        onClose={props.handleSearchDialogClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Materialsuche</DialogTitle>
        <DialogContent dividers>
          {selectionAtomic == 1 ? (
            // If only one row is selected go to MaterialSearch.jsx 
            <div>
              <MaterialSearch />
            </div>
          ) : (
            // If less than one or more than one rows are selected display warning
            <div>
              <Grid container item xs={12} justify="center">
                <Typography>
                  Diese Komponente ist nicht atomar. Ihr können nur Komponenten
                  jedoch keine Rohstoffe zugeordnet werden.
                </Typography>
              </Grid>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Grid contrainer item xs={12} justify="center">
            {/* Button that closes dialog */}
            <Button
              onClick={props.handleSearchDialogClose}
              style={{
                borderColor: "#005000",
                color: "#005000",
                textTransform: "none",
                margin: 20,
                height: 30,
                width: 120,
              }}
            >
              Abbrechen
            </Button>
          </Grid>
        </DialogActions>
      </Dialog>
    </div>
  );
};
