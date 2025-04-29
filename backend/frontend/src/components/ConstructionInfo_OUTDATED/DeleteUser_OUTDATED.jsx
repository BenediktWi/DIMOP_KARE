import React, { useContext } from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { ConstructionContext } from "../../views/Construction/ConstructionContext";
import { APIContext } from "../../APIContext";

export default function DeleteUser() {
  // get debugging API variable
  const { use_API, API_Host } = useContext(APIContext);
  const [useAPI, setUseAPI] = use_API;
  const [APIHost, setAPIHost] = API_Host;

  // get managed states from context
  const {
    selected_user,
    open_delete_user,
    need_refresh_project_team,
    loaded_cons,
  } = useContext(ConstructionContext);
  const [selectedUser, setSelectedUser] = selected_user;
  const [openDeleteUser, setOpenDeleteUser] = open_delete_user;
  const [
    needRefreshProjectTeam,
    setNeedRefreshProjectTeam,
  ] = need_refresh_project_team;
  const [loadedCons, setLoadedCons] = loaded_cons;

  // Adding selected User to Backend DB
  const handleDeletingUser = () => {
    setNeedRefreshProjectTeam(!needRefreshProjectTeam);
    if (useAPI) {
      const req = {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      fetch(APIHost + "/perp/" + selectedUser[0].id, req)
        .then((res) => {
          res.json();
        })
        .then((result) => console.log(result));
    }
  };

  // handle closing
  const handleCloseDeleteUser = () => {
    setOpenDeleteUser(false);
    handleDeletingUser();
    resetSelected();
  };

  const handleCloseDeleteBreak = () => {
    setOpenDeleteUser(false);
    resetSelected();
  };

  const resetSelected = () => {
    setSelectedUser([]);
  };

  return (
    <Dialog
      open={openDeleteUser}
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
      ) : selectedUser.length === 0 ? (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Keine Elemente zum Löschen selektiert.
          </DialogContentText>
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Sollen die {selectedUser.length} selektierten Elemente wirklich
            gelöscht werden?
            {selectedUser.length > 20 ? (
              <div />
            ) : (
              selectedUser.map((element) => (
                <li key={element.id}>
                  {element.name}
                  {"(" + element.id + ")"}
                </li>
              ))
            )}
          </DialogContentText>
        </DialogContent>
      )}
      {Object.keys(loadedCons).length === 0 || selectedUser.length === 0 ? (
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
          <Button variant="outlined" onClick={handleCloseDeleteUser} autoFocus>
            OK
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
