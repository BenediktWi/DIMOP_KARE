import React, { useContext } from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { ConstructionContext } from "../../views/Construction/ConstructionContext";
import { APIContext } from "../../APIContext";

export default function DeleteAlternative() {
  // get debugging API variable
  const { use_API, API_Host } = useContext(APIContext);
  const [useAPI, setUseAPI] = use_API;
  const [APIHost, setAPIHost] = API_Host;

  // get managed states from context
  const {
    selected_alternative,
    open_delete_alternative,
    need_refresh_project_info,
    loaded_cons,
  } = useContext(ConstructionContext);
  const [selectedAlternative, setSelectedAlternative] = selected_alternative;
  const [
    openDeleteAlternative,
    setOpenDeleteAlternative,
  ] = open_delete_alternative;
  const [
    needRefreshProjectInfo,
    setNeedRefreshProjectInfo,
  ] = need_refresh_project_info;
  const [loadedCons, setLoadedCons] = loaded_cons;

  // Adding selected User to Backend DB
  const handleDeletingAlternative = () => {
    setNeedRefreshProjectInfo(!needRefreshProjectInfo);
    if (useAPI) {
      const req = {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      fetch(APIHost + "/bomal/" + selectedAlternative[0].id, req)
        .then((res) => {
          res.json();
        })
        .then((result) => console.log(result));
    }
  };

  // handle closing
  const handleCloseDeleteAlternative = () => {
    setOpenDeleteAlternative(false);
    handleDeletingAlternative();
    resetSelected();
  };

  const handleCloseDeleteBreak = () => {
    setOpenDeleteAlternative(false);
    resetSelected();
  };

  const resetSelected = () => {
    setSelectedAlternative([]);
  };

  return (
    <Dialog
      open={openDeleteAlternative}
      onClose={handleCloseDeleteBreak}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Löschen"}</DialogTitle>
      {Object.keys(loadedCons).length === 0 ? (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bitte laden oder erstellen Sie zuvor eine Konstruktion.
          </DialogContentText>
        </DialogContent>
      ) : selectedAlternative.length === 0 ? (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Keine Elemente zum Löschen selektiert.
          </DialogContentText>
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Sollen die {selectedAlternative.length} selektierten Elemente
            wirklich gelöscht werden?
            {selectedAlternative.length > 20 ? (
              <div />
            ) : (
              selectedAlternative.map((element) => (
                <li key={element.bom_al}>
                  {element.mat_desc} {"(" + element.id + ")"}
                </li>
              ))
            )}
          </DialogContentText>
        </DialogContent>
      )}
      {selectedAlternative.length === 0 ||
      Object.keys(loadedCons).length === 0 ? (
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseDeleteBreak} autoFocus>
            Ok
          </Button>
        </DialogActions>
      ) : (
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseDeleteBreak}>
            Abbrechen
          </Button>
          <Button
            variant="outlined"
            onClick={handleCloseDeleteAlternative}
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
