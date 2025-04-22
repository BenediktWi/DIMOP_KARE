import React, { useState, useContext, useEffect } from "react";

import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { CircularProgress } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Grid1 from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

import {
    SelectionState,
    IntegratedSelection,
    TreeDataState,
    CustomTreeData,
    SortingState,
    IntegratedSorting,
} from "@devexpress/dx-react-grid";
import {
    Grid,
    Table,
    TableHeaderRow,
    TableTreeColumn,
    TableSelection,
} from "@devexpress/dx-react-grid-material-ui";

import moment from "moment";

import TreeData from "../../files/table_tree.json";
import listAlternatives_JSON from "../../files/table_projektinfos.json";
import DeleteComponent from "../../components/ConstructionComponents/DeleteComponent";
import EditComponent from "../../components/ConstructionComponents/EditComponent";
import AddComponent from "../../components/ConstructionComponents/AddComponent";

import { ConstructionContext } from "../../views/Construction/ConstructionContext";
import { APIContext } from "../../APIContext";
import TableTest from "./TableTest_OUTDATED";
import DemoTable from "./DemoTable_OUTDATED";

const useStyles = makeStyles((theme) => ({
    mainwindow: {
        padding: 20,
        minHeight: "calc(100vh - 115px - 100px)",
        height: "100%",
        paddingBottom: 0,
        textAlign: "left",
    },
    divider: {
        margin: 0,
        marginTop: 15,
    },
    progress: {
        textAlign: "center",
        justifyContent: "center",
        padding: 15,
    },
    buttons: {
        borderColor: "#005000",
        color: "#005000",
        textTransform: "none",
        marginLeft: 20,
    },
    label: { marginTop: 10 },
    buttonbox: {
        textAlign: "right",
        paddingTop: 15,
        paddingBottom: 15,
    },
    autocomplete: {
        color: "black",
        "& .MuiOutlinedInput-notchedOutline": {
            border: 0,
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            border: 0,
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: 0,
        },
    },
    textfield: { margin: 0, padding: 0, background: "white" },
    root_card: {
        marginTop: 15,
        marginBottom: 0,
    },
    title: {
        fontSize: 13,
    },
    card_div: {
        marginBottom: 15,
    },
}));

export default function ConstructionTableTree() {
    // get debugging API variable
    const { use_API, API_Host } = useContext(APIContext);

    const [useAPI, setUseAPI] = use_API;
    const [APIHost, setAPIHost] = API_Host;

    const [loadingTest, setLoadingTest] = useState(true);

    // get managed states from context
    const {
        loaded_cons,
        loaded_alternative,
        need_refresh_project_info,
        need_refresh_components,
        selected_component,
        open_delete_component,
        open_add_component,
        open_edit_component,
        selected_component_id,
        edited_component,
        content_num,
    } = useContext(ConstructionContext);

    const [contentNum, setContentNum] = content_num;
    const [loadedCons, setLoadedCons] = loaded_cons;
    const [loadedAlternative, setLoadedAlternative] = loaded_alternative;
    const [
        needRefreshProjectInfo,
        setNeedRefreshProjectInfo,
    ] = need_refresh_project_info;
    const [
        needRefreshComponents,
        setNeedRefreshComponents,
    ] = need_refresh_components;
    const [selectedComponent, setSelectedComponent] = selected_component;
    const [selectedComponentId, setSelectedComponentId] = selected_component_id;
    const [editedComponent, setEditedComponent] = edited_component;
    const [openDeleteComponent, setOpenDeleteComponent] = open_delete_component;
    const [openEditComponent, setOpenEditComponent] = open_edit_component;
    const [openAddComponent, setOpenAddComponent] = open_add_component;

    // states for table tree
    const classes = useStyles();

    // states for TREE data from json/api
    const rows_json = TreeData.Table_Tree_Data;
    const [rows, setRows] = useState(rows_json);
    const [apidataloaded, setapidataloaded] = useState(false);

    // DROPDWON DATA

    // prepare json data list for dropdown
    const listAlternatives_json = listAlternatives_JSON.Table_Projekt_Info_Data;
    const [listAlternatives, setListAlternatives] = useState(
        listAlternatives_json
    );
    const [listDropdownData, setListDropdownData] = useState([]);
    const [apiDataLoadedDropdown, setApiDataLoadedDropdown] = useState(false);

    // states for dropdown selection
    const [dropdownSelected, setDropdownSelected] = useState();
    const [labelSearch, setLabelSearch] = useState();

    // transform user data for dropdown
    const transformDropdownData = (data) => {
        if (data !== null && data.length !== 0) {
            // get key/text/value as keys for using in dropdown
            const source = data.map(
                (item) =>
                    item.id + " - " + item.mat_desc + " (" + item.mara_nr + ")"
            );
            setListDropdownData(source);
            setListAlternatives(data);
        } else setListDropdownData();
    };

    // useEffect for API Connection
    useEffect(() => {
        if (Object.keys(loadedCons).length !== 0) {
            if (useAPI) {
                fetch(APIHost + "/bomal/" + loadedCons.id)
                    .then((res) => res.json())
                    .then((data) => {
                        transformDropdownData(data);
                        const timer = setTimeout(() => {
                            // console.log('This will run after 1 second!')
                            setApiDataLoadedDropdown(true);
                        }, 1000);
                        return () => clearTimeout(timer);
                    })
                    .catch(console.log);
            } else {
                // if no api, use json
                transformDropdownData(listAlternatives_json);
                setApiDataLoadedDropdown(true);
            }
        } else {
            setLabelSearch("Bitte wählen Sie zuvor eine Konstruktion.");
            setApiDataLoadedDropdown(true);
        }
    }, [loadedCons, needRefreshProjectInfo]);

    // handle alternatives dropdown
    const handleDropdownChange = (e) => {
        setDropdownSelected(e.target.textContent);
    };

    const [clickedSelectButton, setClickedSelectButton] = useState(false);

    // handle alternatives search button
    const onClickSearch = () => {
        if (dropdownSelected && dropdownSelected !== null) {
            setClickedSelectButton(true);
            getUserData();
        } else {
            setLabelSearch("Bitte wählen Sie eine gültige Alternative.");
            setClickedSelectButton(false);
        }
    };

    // transform unix timestamp
    const changeDt = (dt) => {
        if (dt !== null) {
            var newDate = moment(dt).format("DD.MM.YYYY HH:MM");
            return newDate;
        } else return dt;
    };

    const getUserData = () => {
        if (
            dropdownSelected !== "" &&
            dropdownSelected !== null &&
            Number.isInteger(Number(dropdownSelected.split(" -")[0]))
        ) {
            setLabelSearch();
            const id = Number(dropdownSelected.split(" -")[0]);
            const sources = [listAlternatives.find((alt) => (alt.id = id))].map(
                (item) => {
                    return {
                        id: item.id,
                        mara_nr: item.mara_nr,
                        mat_desc: item.mat_desc,
                        bom_al: item.bom_al,
                        creator: item.firstname + " " + item.surname,
                        created_at: changeDt(item.created_at),
                        updated_at: changeDt(item.updated_at),
                        cad_nr: item.cad_nr,
                    };
                }
            );
            setLoadedAlternative(sources);
        } else {
            setLabelSearch("Bitte wählen Sie einen gültigen Nutzer.");
        }
    };

    const proofRecycleCat = (value) => {
        if (value !== null) {
            if (value <= 1 && value >= Number(4 / 5)) {
                return <FiberManualRecordIcon style={{ color: "black" }} />;
            } else if (value < Number(4 / 5) && value >= Number(3 / 5)) {
                return <FiberManualRecordIcon style={{ color: "orange" }} />;
            } else if (value < Number(3 / 5) && value >= Number(2 / 5)) {
                return <FiberManualRecordIcon style={{ color: "yellow" }} />;
            } else if (value < Number(2 / 5) && value >= Number(1 / 5)) {
                return <FiberManualRecordIcon style={{ color: "#01DF01" }} />;
            } else if (value < Number(1 / 5) && value >= 0) {
                return <FiberManualRecordIcon style={{ color: "green" }} />;
            }
        }
    };

    // get TREE data
    const transformTableData = (data) => {
        if (data !== null) {
            const source = data.map((item) => {
                if (useAPI) {
                    return {
                        id: item.mara_id,
                        parentId: item.mast_id_parent,
                        mara_id: item.mara_id,
                        mara_nr: item.mara_nr,
                        mat_desc: item.mat_desc,
                        pos: item.pos,
                        height_erp: item.height_erp,
                        width_erp: item.width_erp,
                        depth_erp: item.depth_erp,
                        unit_erp: item.unit_erp,
                        volume_cad: item.volume_cad,
                        unit_cad: item.unit_cad,
                        weight_ui: item.weight_ui,
                        qr_relevant: item.qr_relevant,
                    };
                } else {
                    return {
                        id: item.id,
                        parentId: item.parentId,
                        mara_id: item.mara_id,
                        mara_nr: item.mara_nr,
                        mat_desc: item.mat_desc,
                        pos: item.pos,
                        height_erp: item.height_erp,
                        width_erp: item.width_erp,
                        depth_erp: item.depth_erp,
                        unit_erp: item.unit_erp,
                        volume_cad: item.volume_cad,
                        unit_cad: item.unit_cad,
                        weight_ui: item.weight_ui,
                        qr_relevant: item.qr_relevant,
                        recycle_val: item.recycle_val,
                        recycle_cat: proofRecycleCat(item.recycle_val),
                    };
                }
            });
            console.log("setrows (source)");
            setRows(source);
        } else {
            console.log("not using api");
            setRows([]);
        }
    };

    // useEffect for managing setRow initial & onRefresh
    useEffect(() => {
        if (
            Object.keys(loadedCons).length !== 0 &&
            Object.keys(loadedAlternative).length !== 0
        ) {
            if (useAPI) {
                // setapidataloaded(true);
                fetch(APIHost + "/bomitem/" + loadedAlternative[0].id)
                    .then((res) => res.json())
                    .then((data) => {
                        setColumns(columns_api);
                        transformTableData(data);
                        console.log(columns_api);
                        console.log(data);
                        const timer = setTimeout(() => {
                            // console.log('This will run after 1 second!')
                            setapidataloaded(true);
                            console.log("API data loaded true");
                        }, 1000);
                        return () => clearTimeout(timer);
                    })
                    .catch(console.log);
            } else {
                setColumns(TreeData.Table_Tree_Columns);
                transformTableData(rows_json);
                setapidataloaded(true);
            }
        } else {
            setColumns(columns_api);
            setRows([]);
            setapidataloaded(true);
        }
    }, [loadedCons, loadedAlternative, needRefreshComponents]);

    // get columns for data tree
    const [columns, setColumns] = useState([]);
    const columns_api = [
        { name: "id", title: "StücklistenID" },
        { name: "mara_id", title: "MaterialID" },
        { name: "mara_nr", title: "MaterialNr" },
        { name: "mat_desc", title: "Materialbeschreibung" },
        { name: "pos", title: "Position" },
        { name: "height_erp", title: "Höhe" },
        { name: "width_erp", title: "Breite" },
        { name: "depth_erp", title: "Tiefe" },
        { name: "unit_erp", title: "Einheit" },
        { name: "volume_cad", title: "Volumen" },
        { name: "unit_cad", title: "Einheit" },
        { name: "weight_ui", title: "Gewicht" },
        { name: "qr_relevant", title: "QR rel." },
    ];

    const [tableColumnExtensions] = useState([
        { columnName: "id", width: 150 },
    ]);
    const [defaultExpandedRowIds] = useState([0]);

    // get child rows
    const getChildRows = (row, rootRows) => {
        const childRows = rootRows.filter(
            (r) => r.parentId === (row ? row.id : null)
        );
        return childRows.length ? childRows : null;
    };

    // filtering selected row ids in row data
    const handleSelectedComponent = (selectedComponentId) => {
        setSelectedComponentId(selectedComponentId);
        setSelectedComponent(
            selectedComponentId.map((selectId) => rows[selectId])
        );
    };

    useEffect(() => {
        setSelectedComponent([]);
        setSelectedComponentId([]);
        setClickedSelectButton(false);
    }, [dropdownSelected]);

    // delete/add/edit buttons management
    const handleClickOpenDeleteComponent = () => {
        setOpenDeleteComponent(true);
    };

    const handleClickOpenAddComponent = () => {
        setOpenAddComponent(true);
    };

    const handleClickOpenEditComponent = () => {
        resetEditComponentInput();
        setEditedComponent(selectedComponent[0]);
        setOpenEditComponent(true);
    };

    const resetEditComponentInput = () => {
        setEditedComponent({});
    };

    const [resultCalc, setResultCalc] = useState([]);

    // dunkelgrün, grün, gelb orange schwarz   // 2 Columns einblenden bei evaluation click
    const onClickCalculate = () => {
        if (
            dropdownSelected &&
            dropdownSelected !== null &&
            clickedSelectButton
        ) {
            setClickedSelectButton(false);
            if (!useAPI) {
                setColumns([
                    ...columns,
                    { name: "recycle_val", title: "Recyclewert (num.)" },
                    { name: "recycle_cat", title: "Recyclewert (kat.)" },
                ]);
            }
            setResultCalc([5.99, 6, 7, "9%"]);
        } else {
            setResultCalc([null, null, null, null]);
            setLabelSearch("Bitte bestätigen Sie Ihre gewählte Alternative.");
        }
    };

    // sorting columns
    const [sorting, setSorting] = useState([{}]);

    // table tree html code
    return (
        <div className={classes.mainwindow}>
            {!apiDataLoadedDropdown && useAPI ? (
                <div className={classes.progress}>
                    <CircularProgress />
                    <br />
                </div>
            ) : (
                <div>
                    <Grid1 container>
                        <Grid1 item xs={4}>
                            <Autocomplete
                                disableClearable
                                value={dropdownSelected || ""}
                                onChange={handleDropdownChange}
                                id="bomal"
                                size="small"
                                className={classes.autocomplete}
                                options={listDropdownData}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        value={dropdownSelected || ""}
                                        margin="dense"
                                        variant="outlined"
                                        className={classes.textfield}
                                    />
                                )}
                            />
                        </Grid1>
                        <Grid1 item xs={1}>
                            <Button
                                className={classes.buttons}
                                variant="outlined"
                                onClick={onClickSearch}
                            >
                                Wählen
                            </Button>
                        </Grid1>
                        {contentNum === 3 ? (
                            <div>
                                <Grid1 item xs={1}>
                                    <Button
                                        className={classes.buttons}
                                        variant="outlined"
                                        onClick={onClickCalculate}
                                    >
                                        Bewerten
                                    </Button>
                                </Grid1>
                            </div>
                        ) : (
                            <div />
                        )}
                    </Grid1>
                    <p className={classes.label}>{labelSearch}</p>
                </div>
            )} 
            <Divider variant="middle" className={classes.divider} /> 

            <Divider variant="middle" className={classes.divider} /> 
            {/*<TableTest></TableTest> */}
            <DemoTable></DemoTable>
            <Divider variant="middle" className={classes.divider} /> 

            <Divider variant="middle" className={classes.divider} /> 
            {!apidataloaded && useAPI ? (
                <div className={classes.progress}>
                    <CircularProgress />
                    <br />
                </div>
            ) : (
                <div>
                    {contentNum === 2 ? (
                        <div>
                            <div>
                                
                                <Paper>
                                    <Grid rows={rows} columns={columns}>
                                        <SelectionState
                                            selection={selectedComponentId}
                                            onSelectionChange={
                                                handleSelectedComponent
                                            }
                                        />
                                        <TreeDataState
                                            defaultExpandedRowIds={
                                                defaultExpandedRowIds
                                            }
                                        />
                                        <CustomTreeData
                                            getChildRows={getChildRows}
                                        />
                                        <IntegratedSelection />
                                        <SortingState
                                            sorting={sorting}
                                            onSortingChange={setSorting}
                                        />
                                        <IntegratedSorting />
                                        <Table
                                            columnExtensions={
                                                tableColumnExtensions
                                            }
                                        />
                                        <TableHeaderRow showSortingControls />
                                        <TableSelection
                                            selectByRowClick
                                            highlightRow
                                            showSelectionColumn={false}
                                        />
                                        <TableTreeColumn
                                            for="id"
                                            showSelectionControls
                                            showSelectAll
                                        />
                                    </Grid>
                                </Paper>
                            </div>
                            <div className={classes.buttonbox}>
                                <Button
                                    variant="outlined"
                                    className={classes.buttons}
                                    onClick={handleClickOpenDeleteComponent}
                                >
                                    Löschen
                                </Button>
                                <Button
                                    variant="outlined"
                                    className={classes.buttons}
                                    onClick={handleClickOpenEditComponent}
                                >
                                    Bearbeiten
                                </Button>
                                <Button
                                    variant="outlined"
                                    className={classes.buttons}
                                    onClick={handleClickOpenAddComponent}
                                >
                                    Hinzufügen
                                </Button>
                            </div>
                        </div>
                    ) : contentNum === 3 ? (
                        <div>
                            <div className={classes.card_div}>
                                <Grid1
                                    container
                                    direction="row"
                                    justify="space-evenly"
                                    alignItems="center"
                                >
                                    <Grid1 item xs={2}>
                                        <Card
                                            className={classes.root_card}
                                            variant="outlined"
                                        >
                                            <CardContent>
                                                <Typography
                                                    className={classes.title}
                                                    color="textSecondary"
                                                    gutterBottom
                                                >
                                                    Recycling-Wert
                                                </Typography>
                                                <Typography
                                                    variant="h5"
                                                    component="h2"
                                                >
                                                    {resultCalc[0] || ""}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid1>
                                    <Grid1 item xs={2}>
                                        <Card
                                            className={classes.root_card}
                                            variant="outlined"
                                        >
                                            <CardContent>
                                                <Typography
                                                    className={classes.title}
                                                    color="textSecondary"
                                                    gutterBottom
                                                >
                                                    CO2-Wert
                                                </Typography>
                                                <Typography
                                                    variant="h5"
                                                    component="h2"
                                                >
                                                    {resultCalc[1] || ""}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid1>
                                    <Grid1 item xs={2}>
                                        <Card
                                            className={classes.root_card}
                                            variant="outlined"
                                        >
                                            <CardContent>
                                                <Typography
                                                    className={classes.title}
                                                    color="textSecondary"
                                                    gutterBottom
                                                >
                                                    Preis
                                                </Typography>
                                                <Typography
                                                    variant="h5"
                                                    component="h2"
                                                >
                                                    {resultCalc[2] || ""}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid1>
                                    <Grid1 item xs={2}>
                                        <Card
                                            className={classes.root_card}
                                            variant="outlined"
                                        >
                                            <CardContent>
                                                <Typography
                                                    className={classes.title}
                                                    color="textSecondary"
                                                    gutterBottom
                                                >
                                                    Gewicht
                                                </Typography>
                                                <Typography
                                                    variant="h5"
                                                    component="h2"
                                                >
                                                    {resultCalc[3] || ""}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid1>
                                </Grid1>
                            </div>
                            <Paper>
                                <Grid rows={rows} columns={columns}>
                                    <SelectionState
                                        selection={selectedComponentId}
                                        onSelectionChange={
                                            handleSelectedComponent
                                        }
                                    />
                                    <TreeDataState
                                        defaultExpandedRowIds={
                                            defaultExpandedRowIds
                                        }
                                    />
                                    <CustomTreeData
                                        getChildRows={getChildRows}
                                    />
                                    <IntegratedSelection />
                                    <SortingState
                                        sorting={sorting}
                                        onSortingChange={setSorting}
                                    />
                                    <IntegratedSorting />
                                    <Table
                                        columnExtensions={tableColumnExtensions}
                                    />
                                    <TableHeaderRow showSortingControls />
                                    <TableSelection
                                        selectByRowClick
                                        highlightRow
                                        showSelectionColumn={false}
                                    />
                                    <TableTreeColumn
                                        for="id"
                                        showSelectionControls
                                        showSelectAll
                                    />
                                </Grid>
                            </Paper>
                        </div>
                    ) : (
                        <div />
                    )}
                </div>
            )}
            <DeleteComponent />
            <EditComponent />
            <AddComponent /> 
        </div>
    );
}
