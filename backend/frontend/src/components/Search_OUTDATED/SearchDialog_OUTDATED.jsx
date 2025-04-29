import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import React, { useContext, useEffect, useRef, useState } from "react";
//Components
import { MainContext } from "../../views/Main/MainContext.jsx";
import { Search } from "./Search_OUTDATED";
import Slide from "@material-ui/core/Slide";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

  const { selection_atomic } = useContext(MainContext);
  const [selectionAtomic, setSelectionAtomic] = selection_atomic;

  return (
    <div>
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
            <div>
              <Search />
            </div>
          ) : (
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
