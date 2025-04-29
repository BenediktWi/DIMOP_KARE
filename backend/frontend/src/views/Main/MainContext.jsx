// Contains all the global variales that are used
 import React, { createContext, useState } from "react";

export const MainContext = createContext();

export const MainProvider = (props) => {
  //Initialize global variables 
  const [orga_id, setOrgaId] = useState(2);
  const [selected_construction_id, setSelectedConstructionId] = useState([]);
  const [selected_construction_title, setSelectedConstructionTitle] = useState(
    "Bitte auswaehlen"
  );
  const [selected_material, setSelectedMaterial] = useState();
  const [delete_material, setDeleteMaterial] = useState();
  const [parent_material, setParentMaterial] = useState();
  const [new_material, setNewMaterial] = useState({
    mat_desc: "",
    mat_id_int: "",
    cad_id: "",
    mara_plast_id: "",
    mat_rw: "",
    height: "",
    width: "",
    depth: "",
    unit: "",
    weight: "",
    weight_unit: "",
    volume: "",
    volume_unit: "",
  });
  const [new_construction, setNewConstruction] = useState({
    cons_title: "",
    cons_desc: "",
    orga_id: orga_id,
    del_kz: 0,
  });
  const [add_component_open, setAddComponentOpen] = useState(false);
  const [delete_component_open, setDeleteComponentOpen] = useState(false);
  const [add_bom_open, setAddBomOpen] = useState(false);
  const [bom_updated, setBomUpdated] = useState(false);
  const [child_updated, setChildUpdated] = useState(false);
  const [add_plast_open, setAddPlastOpen] = useState(false);
  const [evaluation_open, setEvaluationOpen] = useState(false);
  const [data_backend, setDataBackend] = useState([]);
  const [highest_level_id, setHighestLevelId] = useState();
  const [add_construction_open, setAddConstructionOpen] = useState(false);
  const [constructions_updated, setConstructionsUpdated] = useState(false);
  const [delete_construction_open, setDeleteConstructionOpen] = useState(false);
  const [delete_construction, setDeleteConstruction] = useState();
  const [new_bom_created, setNewBomCreated] = useState(false);
  const [add_component_mode, setComponentMode] = useState("");
  const [active_step, setActiveStep] = useState(0);
  const [selection_atomic, setSelectionAtomic] = useState([]);
  const [material_created, setMaterialCreated] = useState(false);
  const [csv_upload_open, setCsvUploadOpen] = useState(false);
  const [search_dialog_open, setSearchDialogOpen] = useState(false);
  const [comparison_data, setComparisonData] = useState([]);

  return (
    <MainContext.Provider
      value={{
        selected_construction_id: [
          selected_construction_id,
          setSelectedConstructionId,
        ],
        selected_construction_title: [
          selected_construction_title,
          setSelectedConstructionTitle,
        ],
        selected_material: [selected_material, setSelectedMaterial],
        parent_material: [parent_material, setParentMaterial],
        delete_material: [delete_material, setDeleteMaterial],
        new_material: [new_material, setNewMaterial],
        add_component_open: [add_component_open, setAddComponentOpen],
        delete_component_open: [delete_component_open, setDeleteComponentOpen],
        add_bom_open: [add_bom_open, setAddBomOpen],
        orga_id: [orga_id, setOrgaId],
        bom_updated: [bom_updated, setBomUpdated],
        child_updated: [child_updated, setChildUpdated],
        add_plast_open: [add_plast_open, setAddPlastOpen],
        evaluation_open: [evaluation_open, setEvaluationOpen],
        data_backend: [data_backend, setDataBackend],
        highest_level_id: [highest_level_id, setHighestLevelId],
        add_construction_open: [add_construction_open, setAddConstructionOpen],
        constructions_updated: [constructions_updated, setConstructionsUpdated],
        new_construction: [new_construction, setNewConstruction],
        delete_construction: [delete_construction, setDeleteConstruction],
        delete_construction_open: [
          delete_construction_open,
          setDeleteConstructionOpen,
        ],
        new_bom_created: [new_bom_created, setNewBomCreated],
        add_component_mode: [add_component_mode, setComponentMode],
        active_step: [active_step, setActiveStep],
        selection_atomic: [selection_atomic, setSelectionAtomic],
        material_created: [material_created, setMaterialCreated],
        csv_upload_open: [csv_upload_open, setCsvUploadOpen],
        search_dialog_open: [search_dialog_open, setSearchDialogOpen],
        comparison_data: [comparison_data, setComparisonData],
      }}
    >
      {props.children}
    </MainContext.Provider>
  );
};
