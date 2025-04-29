import React, { useContext, useState, useEffect } from "react";

import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import { ConstructionContext } from "../../views/Construction/ConstructionContext";
import { APIContext } from "../../APIContext";

// css theme
const useStyles = makeStyles((theme) => ({
  Button: {
    marginLeft: 10,
  },
}));

export default function AddComponent() {
  // get debugging API variable
  const { use_API, API_Host } = useContext(APIContext);
  const [useAPI, setUseAPI] = use_API;
  const [APIHost, setAPIHost] = API_Host;

  const classes = useStyles();
  const [labelAddComponent, setLabelAddComponent] = useState();
  const [newComponent, setNewComponent] = useState({
    parentId: "",
    mara_id: "",
    height_erp: "",
    width_erp: "",
    depth_erp: "",
    unit_erp: "",
    volume_cad: "",
    unit_cad: "",
    weight_ui: "",
    qr_relevant: false,
  });

  // get managed states from context
  const {
    open_add_component,
    need_refresh_components,
    loaded_cons,
    loaded_alternative,
    open_search_material,
    use_selected_material,
    jump_to_material_search,
  } = useContext(ConstructionContext);
  const [openAddComponent, setOpenAddComponent] = open_add_component;
  const [
    needRefreshComponents,
    setNeedRefreshComponents,
  ] = need_refresh_components;
  const [loadedCons, setLoadedCons] = loaded_cons;
  const [loadedAlternative, setLoadedAlternative] = loaded_alternative;
  const [openSearchMaterial, setOpenSearchMaterial] = open_search_material;
  const [useSelectedMaterial, setUseSelectedMaterial] = use_selected_material;
  const [
    jumpToMaterialSearch,
    setJumpToMaterialSearch,
  ] = jump_to_material_search;

  const handleAddingComponent = () => {
    console.log("AddingComponent!");
    console.log(newComponent);
    const req = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mast_id: loadedAlternative[0].id,
        mara_id: newComponent.mara_id,
        pos: newComponent.pos,
        height_erp: newComponent.height_erp,
        width_erp: newComponent.width_erp,
        depth_erp: newComponent.depth_erp,
        unit_erp: newComponent.unit_erp,
        volume_cad: newComponent.volume_cad,
        unit_cad: newComponent.unit_cad,
        weight_ui: newComponent.weight_ui,
        qr_relevant: newComponent.qr_relevant,
      }),
    };
    console.log(req);
    fetch(APIHost + "/bomitem", req)
      .then((res) => {
        res.json();
        console.log(res);
      })
      .then((result) => console.log(result));
    setNeedRefreshComponents(!needRefreshComponents);
  };

  // handle closing || valid values
  const handleCloseAdd = () => {
    if (
      newComponent.mara_id !== "" &&
      newComponent.pos !== "" &&
      newComponent.height_erp !== "" &&
      newComponent.width_erp !== "" &&
      newComponent.depth_erp !== "" &&
      newComponent.unit_erp !== "" &&
      newComponent.volume_cad !== "" &&
      newComponent.unit_cad !== "" &&
      newComponent.weight_ui !== "" &&
      newComponent.qr_relevant !== ""
    ) {
      setOpenAddComponent(false);
      handleAddingComponent();
      resetAddComponentInputs();
    } else {
      setLabelAddComponent("Bitte überprüfen Sie ihre Angaben.");
    }
  };

  const handleCloseAddBreak = () => {
    setOpenAddComponent(false);
    resetAddComponentInputs();
  };

  // change components state with inputs
  const handleAddComponent = (e) => {
    setNewComponent({
      ...newComponent,
      [e.target.id]: e.target.value,
    });
  };

  // reset
  const resetAddComponentInputs = () => {
    setNewComponent({});
    setJumpToMaterialSearch("");
    setLabelAddComponent("");
  };

  const onClickGoMaterialSearch = () => {
    setOpenAddComponent(false);
    setOpenSearchMaterial(true);
    setJumpToMaterialSearch("AddComponent");
  };

  useEffect(() => {
    if (
      useSelectedMaterial.mara_id !== "" &&
      useSelectedMaterial.mat_desc !== ""
    ) {
      setNewComponent({
        ...newComponent,
        mara_id: useSelectedMaterial.mara_id,
      });
    }
  }, [useSelectedMaterial]);

  useEffect(() => {
    if (jumpToMaterialSearch === "reset") {
      resetAddComponentInputs();
      setJumpToMaterialSearch("");
    }
  }, [jumpToMaterialSearch]);

  const handleChangeCheck = (e) => {
    setNewComponent({
      ...newComponent,
      [e.target.name]: transformBoolean(e.target.checked),
    });
  };

  const transformBoolean = (x) => {
    if (x) {
      return 1;
    } else {
      return 0;
    }
  };

  const transformBoolean1 = () => {
    let x = newComponent.qr_relevant;
    if (newComponent.qr_relevant === 1) {
      return true;
    } else if (newComponent.qr_relevant === 0) {
      return false;
    }
  };

  return (
    <Dialog
      open={openAddComponent}
      onClose={handleCloseAddBreak}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Hinzufügen</DialogTitle>
      {Object.keys(loadedCons).length === 0 ||
      Object.keys(loadedAlternative).length === 0 ? (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bitte laden oder erstellen Sie zuvor eine Konstruktion oder
            Alternative.
          </DialogContentText>
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogContentText style={{ color: "black" }}>
            Geben Sie die Daten der zu ändernden Komponente ein.
          </DialogContentText>
          <Grid container>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="parentId"
                label="parentId"
                type="name"
                onChange={handleAddComponent}
                value={newComponent.parentId || ""}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <Grid container>
                <Grid item xs={8}>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="mara_id"
                    label="MaterialID"
                    type="email"
                    onChange={handleAddComponent}
                    value={newComponent.mara_id || ""}
                  />
                </Grid>
                <Grid item xs={4}>
                  <IconButton
                    color="secondary"
                    aria-label="add an alarm"
                    onClick={onClickGoMaterialSearch}
                    style={{ height: "100%" }}
                  >
                    <SearchOutlinedIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="pos"
                label="Position"
                type="function"
                onChange={handleAddComponent}
                value={newComponent.pos || ""}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="height_erp"
                label="Höhe"
                type="organization"
                onChange={handleAddComponent}
                value={newComponent.height_erp || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="width_erp"
                label="Weite"
                type="email"
                onChange={handleAddComponent}
                value={newComponent.width_erp || ""}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="depth_erp"
                label="Tiefe"
                type="organization"
                onChange={handleAddComponent}
                value={newComponent.depth_erp || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="unit_erp"
                label="Einheit"
                type="organization"
                onChange={handleAddComponent}
                value={newComponent.unit_erp || ""}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="volume_cad"
                label="Volumen"
                type="email"
                onChange={handleAddComponent}
                value={newComponent.volume_cad || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="unit_cad"
                label="Einheit"
                type="organization"
                onChange={handleAddComponent}
                value={newComponent.unit_cad || ""}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="weight_ui"
                label="Gewicht"
                type="email"
                onChange={handleAddComponent}
                value={newComponent.weight_ui || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={handleChangeCheck}
                      checked={transformBoolean1() || false}
                      name="qr_relevant"
                    />
                  }
                  label="QR rel."
                />
              </FormGroup>
            </Grid>
          </Grid>
          <div>{labelAddComponent}</div>
        </DialogContent>
      )}
      {Object.keys(loadedCons).length === 0 ||
      Object.keys(loadedAlternative).length === 0 ? (
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseAddBreak} autoFocus>
            OK
          </Button>
        </DialogActions>
      ) : (
        <DialogActions>
          <Button
            onClick={handleCloseAddBreak}
            variant="outlined"
            className={classes.Button}
          >
            Abbrechen
          </Button>
          <Button
            onClick={handleCloseAdd}
            variant="outlined"
            className={classes.Button}
          >
            Anlegen
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
