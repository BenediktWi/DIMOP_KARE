import React, { useContext } from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { ConstructionContext } from "../../views/Construction/ConstructionContext";
import { APIContext } from "../../APIContext";

export default function DeleteComponent() {
  // get debugging API variable
  const { use_API, API_Host } = useContext(APIContext);
  const [useAPI, setUseAPI] = use_API;
  const [APIHost, setAPIHost] = API_Host;

  // get managed states from context
  const {
    selected_component,
    open_delete_component,
    need_refresh_components,
    loaded_cons,
    loaded_alternative,
    selected_component_id,
  } = useContext(ConstructionContext);

  const [selectedComponent, setSelectedComponent] = selected_component;
  const [selectedComponentId, setSelectedComponentId] = selected_component_id;
  const [openDeleteComponent, setOpenDeleteComponent] = open_delete_component;
  const [
    needRefreshComponents,
    setNeedRefreshComponents,
  ] = need_refresh_components;
  const [loadedCons, setLoadedCons] = loaded_cons;
  const [loadedAlternative, setLoadedAlternative] = loaded_alternative;

  // Deleting selected Component to Backend DB
  const handleDeletingComponent = () => {
    setNeedRefreshComponents(!needRefreshComponents);
    if (useAPI) {
      const req = {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      fetch(APIHost + "/bomitem/" + selectedComponent[0].id, req)
        .then((res) => {
          res.json();
        })
        .then((result) => console.log(result));
    }
  };

  // handle closing
  const handleCloseDeleteComponent = () => {
    setOpenDeleteComponent(false);
    handleDeletingComponent();
    resetSelected();
  };

  const handleCloseDeleteBreak = () => {
    setOpenDeleteComponent(false);
    resetSelected();
  };

  const resetSelected = () => {
    setSelectedComponent([]);
    setSelectedComponentId([]);
  };

  return (
    <Dialog
      open={openDeleteComponent}
      onClose={handleCloseDeleteBreak}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Löschen"}</DialogTitle>
      {Object.keys(loadedCons).length === 0 ||
      Object.keys(loadedAlternative).length === 0 ? (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bitte laden oder erstellen Sie zuvor eine Konstruktion oder
            Alternative.
          </DialogContentText>
        </DialogContent>
      ) : selectedComponent.length === 0 ? (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Keine Elemente zum Löschen selektiert.
          </DialogContentText>
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Sollen die {selectedComponent.length} selektierten Elemente wirklich
            gelöscht werden?
            {selectedComponent.length > 20 ? (
              <div />
            ) : (
              selectedComponent.map((element) => (
                <li key={element.id}>
                  {element.id + " - "}
                  {element.mat_desc}
                  {" (" + element.mara_id + ")"}
                </li>
              ))
            )}
          </DialogContentText>
        </DialogContent>
      )}
      {Object.keys(loadedCons).length === 0 ||
      selectedComponent.length === 0 ||
      Object.keys(loadedAlternative).length === 0 ? (
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseDeleteBreak} autoFocus>
            OK
          </Button>
        </DialogActions>
      ) : (
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseDeleteBreak}>
            Abbrechen
          </Button>
          <Button
            variant="outlined"
            onClick={handleCloseDeleteComponent}
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
