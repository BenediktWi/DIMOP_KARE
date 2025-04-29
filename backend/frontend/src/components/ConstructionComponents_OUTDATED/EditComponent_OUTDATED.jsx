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
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";

import { ConstructionContext } from "../../views/Construction/ConstructionContext";
import { APIContext } from "../../APIContext";

// css theme
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(3),
  },
}));

export default function EditComponent() {
  // get debugging API variable
  const { use_API, API_Host } = useContext(APIContext);
  const [useAPI, setUseAPI] = use_API;
  const [APIHost, setAPIHost] = API_Host;

  // get managed states from context
  const {
    open_edit_component,
    edited_component,
    selected_component,
    selected_component_id,
    need_refresh_components,
    loaded_cons,
    loaded_alternative,
    open_search_material,
    use_selected_material,
    jump_to_material_search,
  } = useContext(ConstructionContext);
  const [openEditComponent, setOpenEditComponent] = open_edit_component;
  const [editedComponent, setEditedComponent] = edited_component;
  const [selectedComponent, setSelectedComponent] = selected_component;
  const [selectedComponentId, setSelectedComponentId] = selected_component_id;
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

  // states
  const classes = useStyles();
  const [labelEditComponent, setLabelEditComponent] = useState();

  // handle closing || valid values
  const handleCloseEditComponent = () => {
    if (
      editedComponent.id !== "" &&
      editedComponent.mara_id !== "" &&
      editedComponent.mara_nr !== "" &&
      editedComponent.mat_desc !== "" &&
      editedComponent.pos !== "" &&
      editedComponent.height_erp !== "" &&
      editedComponent.width_erp !== "" &&
      editedComponent.depth_erp !== "" &&
      editedComponent.unit_erp !== "" &&
      editedComponent.volume_cad !== "" &&
      editedComponent.unit_cad !== "" &&
      editedComponent.weight_ui !== "" &&
      editedComponent.qr_relevant !== ""
    ) {
      setOpenEditComponent(false);
      handleEditingComponent();
      resetEditComponentInputs();
    } else {
      setLabelEditComponent("Bitte überprüfen Sie ihre Angaben.");
    }
  };

  const transformBoolean = (x) => {
    if (x) {
      return 1;
    } else {
      return 0;
    }
  };

  const transformBoolean1 = () => {
    let x = editedComponent.qr_relevant;
    if (editedComponent.qr_relevant === 1) {
      return true;
    } else if (editedComponent.qr_relevant === 0) {
      return false;
    }
  };

  const handleEditingComponent = () => {
    if (useAPI) {
      const req = {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mast_id: loadedAlternative[0].id,
          mara_id: editedComponent.mara_id,
          pos: editedComponent.pos,
          height_erp: editedComponent.height_erp,
          width_erp: editedComponent.width_erp,
          depth_erp: editedComponent.depth_erp,
          unit_erp: editedComponent.unit_erp,
          volume_cad: editedComponent.volume_cad,
          unit_cad: editedComponent.unit_cad,
          weight_ui: editedComponent.weight_ui,
          qr_relevant: editedComponent.qr_relevant,
        }),
      };
      console.log(req);
      fetch(APIHost + "/bomitem/" + editedComponent.id, req)
        .then((res) => {
          res.json();
        })
        .then((result) => console.log(result));
    }
    setNeedRefreshComponents(!needRefreshComponents);
  };

  const handleCloseEditComponentBreak = () => {
    setOpenEditComponent(false);
    resetEditComponentInputs();
  };

  // change Component state with inputs
  const handleEditComponent = (e) => {
    setEditedComponent({ ...editedComponent, [e.target.id]: e.target.value });
  };

  const handleChangeCheck = (e) => {
    setEditedComponent({
      ...editedComponent,
      [e.target.name]: transformBoolean(e.target.checked),
    });
  };

  // reset
  const resetEditComponentInputs = () => {
    setSelectedComponent([]);
    setSelectedComponentId([]);
    setEditedComponent({});
    setLabelEditComponent("");
    setJumpToMaterialSearch("");
  };

  const onClickGoMaterialSearch = () => {
    setOpenEditComponent(false);
    setOpenSearchMaterial(true);
    setJumpToMaterialSearch("EditComponent");
  };

  useEffect(() => {
    if (
      useSelectedMaterial.mara_id !== "" &&
      useSelectedMaterial.mat_desc !== ""
    ) {
      setEditedComponent({
        ...editedComponent,
        mara_id: useSelectedMaterial.mara_id,
      });
    }
  }, [useSelectedMaterial]);

  useEffect(() => {
    if (jumpToMaterialSearch === "reset") {
      resetEditComponentInputs();
      setJumpToMaterialSearch("");
    }
  }, [jumpToMaterialSearch]);

  return (
    <Dialog
      open={openEditComponent}
      onClose={handleCloseEditComponentBreak}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Ändern</DialogTitle>
      {Object.keys(loadedCons).length === 0 ||
      Object.keys(loadedAlternative).length === 0 ? (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bitte laden oder erstellen Sie zuvor eine Konstruktion oder
            Alternative.
          </DialogContentText>
        </DialogContent>
      ) : selectedComponent.length !== 1 ? (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Kein änderbares Element selektiert.
          </DialogContentText>
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogContentText style={{ color: "black" }}>
            Geben Sie die Daten der zu ändernden Komponente ein.
          </DialogContentText>
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
                    onChange={handleEditComponent}
                    value={editedComponent.mara_id || ""}
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
                onChange={handleEditComponent}
                value={editedComponent.pos || ""}
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
                onChange={handleEditComponent}
                value={editedComponent.height_erp || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="width_erp"
                label="Weite"
                type="email"
                onChange={handleEditComponent}
                value={editedComponent.width_erp || ""}
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
                onChange={handleEditComponent}
                value={editedComponent.depth_erp || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="unit_erp"
                label="Einheit"
                type="name"
                onChange={handleEditComponent}
                value={editedComponent.unit_erp || ""}
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
                type="organization"
                onChange={handleEditComponent}
                value={editedComponent.volume_cad || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="unit_cad"
                label="Einheit"
                type="email"
                onChange={handleEditComponent}
                value={editedComponent.unit_cad || ""}
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
                type="organization"
                onChange={handleEditComponent}
                value={editedComponent.weight_ui || ""}
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
          <div>{labelEditComponent}</div>
        </DialogContent>
      )}
      {Object.keys(loadedCons).length === 0 ||
      selectedComponent.length !== 1 ||
      Object.keys(loadedAlternative).length === 0 ? (
        <DialogActions>
          <Button
            variant="outlined"
            onClick={handleCloseEditComponentBreak}
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      ) : (
        <DialogActions>
          <Button
            onClick={handleCloseEditComponentBreak}
            variant="outlined"
            style={{ marginLeft: 10 }}
          >
            Abbrechen
          </Button>
          <Button
            onClick={handleCloseEditComponent}
            variant="outlined"
            style={{ marginLeft: 10 }}
          >
            Ändern
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
