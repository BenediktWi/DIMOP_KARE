import React, { useState, useContext } from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import MaterialSearch from "./MaterialSearch_OUTDATED";

import { APIContext } from "../../APIContext";
import { ConstructionContext } from "../../views/Construction/ConstructionContext";

export default function MaterialSearchDialog() {
  const { open_search_material, jump_to_material_search } = useContext(
    ConstructionContext
  );
  const [openSearchMaterial, setOpenSearchMaterial] = open_search_material;
  const [
    jumpToMaterialSearch,
    setJumpToMaterialSearch,
  ] = jump_to_material_search;

  const handleCloseLoadConsBreak = () => {
    setJumpToMaterialSearch("reset");
    setOpenSearchMaterial(false);
  };

  return (
    <Dialog
      open={openSearchMaterial}
      onClose={handleCloseLoadConsBreak}
      aria-labelledby="form-dialog-title"
      fullWidth={true}
      maxWidth={"lg"}
    >
      <DialogTitle id="form-dialog-title">Materialsuche</DialogTitle>
      <DialogContent style={{ background: "white" }}>
        {/*background: "#007F3D"*/}
        <MaterialSearch />
      </DialogContent>
      {/* <DialogActions>
        <Button
          onClick={handleCloseLoadConsBreak}
          variant="outlined"
          style={{ marginLeft: 10 }}
        >
          Abbrechen
        </Button>
        <Button
          onClick={handleCloseLoadConsBreak}
          variant="outlined"
          style={{ marginLeft: 10 }}
        >
          Laden
        </Button>
      </DialogActions> */}
    </Dialog>
  );
}
