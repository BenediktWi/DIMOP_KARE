import React, { useContext } from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { ConstructionContext } from "./ConstructionContext";
import { APIContext } from "../../APIContext";
import TableConstructionLoad from "./Table_ConstructionLoad";

export default function ConstructionDelete() {
  // get debugging API variable
  const { use_API, API_Host } = useContext(APIContext);
  const [useAPI, setUseAPI] = use_API;
  const [APIHost, setAPIHost] = API_Host;

  // construction context states
  const { open_delete_cons, selected_cons_delete, loaded_cons } = useContext(
    ConstructionContext
  );

  const [selectedConsDelete, setSelectedConsDelete] = selected_cons_delete;
  const [openDeleteCons, setOpenDeleteCons] = open_delete_cons;
  const [loadedCons, setLoadedCons] = loaded_cons;

  const handleCloseDeleteCons = () => {
    if (selectedConsDelete.length === 1) {
      deleteCons(selectedConsDelete[0]);
      setOpenDeleteCons(false);
      if (loadedCons.id === selectedConsDelete[0].id) {
        setLoadedCons({});
      }
    } else {
      setOpenDeleteCons(true);
    }
  };

  const handleCloseDeleteConsBreak = () => {
    setOpenDeleteCons(false);
  };

  const deleteCons = (cons) => {
    if (useAPI) {
      const req = {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      fetch(APIHost + "/kons/" + cons.id, req)
        .then((res) => {
          res.json();
        })
        .then((result) => console.log(result));
    }
  };

  return (
    <Dialog
      open={openDeleteCons}
      onClose={handleCloseDeleteConsBreak}
      aria-labelledby="form-dialog-title"
      fullWidth={true}
      maxWidth={"lg"}
    >
      <DialogTitle id="form-dialog-title">Konstruktion Löschen</DialogTitle>
      <DialogContent>
        <DialogContentText style={{ color: "black" }}>
          Wählen Sie die zu löschende Konstruktion aus.
        </DialogContentText>
        <TableConstructionLoad />
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleCloseDeleteConsBreak}
          variant="outlined"
          style={{ marginLeft: 10 }}
        >
          Abbrechen
        </Button>
        <Button
          onClick={handleCloseDeleteCons}
          variant="outlined"
          style={{ marginLeft: 10 }}
        >
          Löschen
        </Button>
      </DialogActions>
    </Dialog>
  );
}
