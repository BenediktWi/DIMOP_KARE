import React, { createContext, useState } from "react";

// export context for state management
export const ConstructionContext = createContext();

// provider with managed states || add new states
export const ConstructionProvider = (props) => {
    //////// states construction
    // content management
    const [content_num, setContentNum] = useState(1);

    // states load cons
    const [open_load_cons, setOpenLoadCons] = useState(false);
    const [selected_cons_load, setSelectedConsLoad] = useState([]);
    const [loaded_cons, setLoadedCons] = useState({});

    // states delete cons
    const [open_delete_cons, setOpenDeleteCons] = useState(false);
    const [selected_cons_delete, setSelectedConsDelete] = useState([]);

    // states delete cons
    const [open_add_cons, setOpenAddCons] = useState(false);

    // states settings password
    const [open_settings_password, setOpenSettingsPassword] = useState(false);

    // states settings account
    const [open_settings_account, setOpenSettingsAccount] = useState(false);

    // states search material
    const [open_search_material, setOpenSearchMaterial] = useState(false);
    const [selected_material, setSelectedMaterial] = useState([]);
    const [search_material_columns, setSearchMaterialColumns] = useState([]);
    const [search_material_rows, setSearchMaterialRows] = useState([]);
    const [
        need_refresh_search_material,
        setNeedRefreshSearchMaterial,
    ] = useState(false);
    const [search_material_api_loaded, setSearchMaterialApiLoaded] = useState(
        true
    );
    const [open_filter_columns, setOpenFilterColumns] = useState(false);
    const [filter_columns_show_columns, setFilterColumnsShowColumns] = useState(
        []
    );
    const [filter_columns_selected, setFilterColumnsSelected] = useState([]);
    const [
        search_material_columns_source,
        setSearchMaterialColumnsSource,
    ] = useState([]);
    const [use_selected_material, setUseSelectedMaterial] = useState({
        mara_id: "",
        mat_desc: "",
        mara_nr: "",
    });
    const [jump_to_material_search, setJumpToMaterialSearch] = useState();

    //// states construction info
    // project team
    const [selected_user, setSelectedUser] = useState([]);
    const [open_delete_user, setOpenDeleteUser] = useState(false);
    const [open_add_user, setOpenAddUser] = useState(false);
    const [open_edit_user, setOpenEditUser] = useState(false);
    const [edited_user, setEditedUser] = useState({});
    const [need_refresh_project_team, setNeedRefreshProjectTeam] = useState(
        false
    );

    // project info
    const [selected_alternative, setSelectedAlternative] = useState([]);
    const [open_delete_alternative, setOpenDeleteAlternative] = useState(false);
    const [open_add_alternative, setOpenAddAlternative] = useState(false);
    const [open_edit_alternative, setOpenEditAlternative] = useState(false);
    const [edited_alternative, setEditedAlternative] = useState({});
    const [need_refresh_project_info, setNeedRefreshProjectInfo] = useState(
        false
    );

    //// table tree
    // load alternative
    const [loaded_alternative, setLoadedAlternative] = useState({});

    // components tree
    const [need_refresh_components, setNeedRefreshComponents] = useState(false);
    const [selected_component, setSelectedComponent] = useState([]);
    const [selected_component_id, setSelectedComponentId] = useState([]);
    const [edited_component, setEditedComponent] = useState({});

    const [open_delete_component, setOpenDeleteComponent] = useState(false);
    const [open_add_component, setOpenAddComponent] = useState(false);
    const [open_edit_component, setOpenEditComponent] = useState(false);

    return (
        <ConstructionContext.Provider
            value={{
                //// Construction

                // content management
                content_num: [content_num, setContentNum],

                // load cons
                loaded_cons: [loaded_cons, setLoadedCons],
                open_load_cons: [open_load_cons, setOpenLoadCons],
                selected_cons_load: [selected_cons_load, setSelectedConsLoad],

                // delete cons
                open_delete_cons: [open_delete_cons, setOpenDeleteCons],
                selected_cons_delete: [
                    selected_cons_delete,
                    setSelectedConsDelete,
                ],

                // delete cons
                open_add_cons: [open_add_cons, setOpenAddCons],

                // settings password
                open_settings_password: [
                    open_settings_password,
                    setOpenSettingsPassword,
                ],

                // settings account
                open_settings_account: [
                    open_settings_account,
                    setOpenSettingsAccount,
                ],

                // search material
                open_search_material: [
                    open_search_material,
                    setOpenSearchMaterial,
                ],
                selected_material: [selected_material, setSelectedMaterial],
                search_material_columns: [
                    search_material_columns,
                    setSearchMaterialColumns,
                ],
                search_material_rows: [
                    search_material_rows,
                    setSearchMaterialRows,
                ],
                need_refresh_search_material: [
                    need_refresh_search_material,
                    setNeedRefreshSearchMaterial,
                ],
                search_material_api_loaded: [
                    search_material_api_loaded,
                    setSearchMaterialApiLoaded,
                ],
                open_filter_columns: [
                    open_filter_columns,
                    setOpenFilterColumns,
                ],
                filter_columns_show_columns: [
                    filter_columns_show_columns,
                    setFilterColumnsShowColumns,
                ],
                filter_columns_selected: [
                    filter_columns_selected,
                    setFilterColumnsSelected,
                ],
                search_material_columns_source: [
                    search_material_columns_source,
                    setSearchMaterialColumnsSource,
                ],
                use_selected_material: [
                    use_selected_material,
                    setUseSelectedMaterial,
                ],
                jump_to_material_search: [
                    jump_to_material_search,
                    setJumpToMaterialSearch,
                ],

                //// construction info
                // project team
                selected_user: [selected_user, setSelectedUser],
                open_delete_user: [open_delete_user, setOpenDeleteUser],
                open_add_user: [open_add_user, setOpenAddUser],
                open_edit_user: [open_edit_user, setOpenEditUser],
                edited_user: [edited_user, setEditedUser],
                need_refresh_project_team: [
                    need_refresh_project_team,
                    setNeedRefreshProjectTeam,
                ],

                // project info
                selected_alternative: [
                    selected_alternative,
                    setSelectedAlternative,
                ],
                open_delete_alternative: [
                    open_delete_alternative,
                    setOpenDeleteAlternative,
                ],
                open_add_alternative: [
                    open_add_alternative,
                    setOpenAddAlternative,
                ],
                open_edit_alternative: [
                    open_edit_alternative,
                    setOpenEditAlternative,
                ],
                edited_alternative: [edited_alternative, setEditedAlternative],
                need_refresh_project_info: [
                    need_refresh_project_info,
                    setNeedRefreshProjectInfo,
                ],

                //// tabletree
                // load alternative
                loaded_alternative: [loaded_alternative, setLoadedAlternative],

                // components tree
                need_refresh_components: [
                    need_refresh_components,
                    setNeedRefreshComponents,
                ],
                selected_component: [selected_component, setSelectedComponent],
                selected_component_id: [
                    selected_component_id,
                    setSelectedComponentId,
                ],
                edited_component: [edited_component, setEditedComponent],

                open_delete_component: [
                    open_delete_component,
                    setOpenDeleteComponent,
                ],
                open_add_component: [open_add_component, setOpenAddComponent],
                open_edit_component: [
                    open_edit_component,
                    setOpenEditComponent,
                ],
            }}
        >
            {props.children}
        </ConstructionContext.Provider>
    );
};
