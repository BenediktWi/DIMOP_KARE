import React, { useContext, useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { CircularProgress } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormLabel from "@material-ui/core/FormLabel";

import IconButton from "@material-ui/core/IconButton";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";

import { ConstructionContext } from "./ConstructionContext_OUTDATED";
import { APIContext } from "../../APIContext";

import orgas_json from "../../files/old/orgas.json";

const useStyles = makeStyles((theme) => ({
    textbox: {
        //textAlign: "center",
        //justifyContent: "center",
    },
    progress: {
        textAlign: "center",
        justifyContent: "center",
    },
    buttons: { marginLeft: 10 },
}));

export default function ConstructionAdd() {
    // get debugging API variable
    const { use_API, API_Host, API_User } = useContext(APIContext);
    const [useAPI, setUseAPI] = use_API;
    const [APIHost, setAPIHost] = API_Host;
    const [APIUser, setAPIUser] = API_User;

    // construction context states
    const {
        open_add_cons,
        loaded_cons,
        open_search_material,
        jump_to_material_search,
        use_selected_material,
    } = useContext(ConstructionContext);
    const [openAddCons, setOpenAddCons] = open_add_cons;
    const [loadedCons, setLoadedCons] = loaded_cons;
    const [openSearchMaterial, setOpenSearchMaterial] = open_search_material;
    const [
        jumpToMaterialSearch,
        setJumpToMaterialSearch,
    ] = jump_to_material_search;
    const [useSelectedMaterial, setUseSelectedMaterial] = use_selected_material;

    const classes = useStyles();

    const [newCons, setNewCons] = useState({
        kons_title: "",
        kons_desc: "",
        orga_id: "",
        mara_id: "",
        mara_nr: "",
        mat_desc: "",
    });

    const handleCloseAddCons = () => {
        if (
            newCons.kons_title !== null &&
            newCons.kons_title !== "" &&
            newCons.kons_desc !== null &&
            newCons.kons_desc !== "" &&
            newCons.orga_id !== null &&
            newCons.orga_id !== "" &&
            newCons.mat_desc !== null &&
            newCons.mat_desc !== "" &&
            ((newCons.mara_id !== null && newCons.mara_id !== "") ||
                (newCons.mara_nr !== null && newCons.mara_nr !== ""))
        ) {
            addCons(newCons);
            setOpenAddCons(false);
            resetInputs();
        } else {
            setOpenAddCons(true);
        }
    };

    const handleCloseAddConsBreak = () => {
        resetInputs();
        setOpenAddCons(false);
    };

    const resetInputs = () => {
        setNewCons({
            kons_title: "",
            kons_desc: "",
            orga_id: "",
            mara_id: "",
            mara_nr: "",
            mat_desc: "",
        });
    };

    const addCons = (cons) => {
        if (useAPI) {
            if (checkRadio === "old") {
                console.log(cons);
                const req = {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        kons_title: cons.kons_title,
                        kons_desc: cons.kons_desc,
                        orga_id: Number(String(cons.orga_id).split(" - ")[0]),
                        mara_id: Number(String(cons.mara_id).split(" - ")[0]),
                        del_kz: "1",
                    }),
                };
                fetch(APIHost + "/kons", req)
                    .then((res) => {
                        res.json();
                    })
                    .then((result) => console.log(result));
            } else console.log("NEU ist abgeklemmt!!!");
        }
    };

    const handleKonsInputs = (event) => {
        setNewCons({ ...newCons, [event.target.id]: event.target.value });
    };

    const [orgaDataSource, setOrgaDataSource] = useState();
    const [apidataloadedorgas, setapidataloadedorgas] = useState(false);

    // useEffect for get orga data
    useEffect(() => {
        if (useAPI) {
            fetch(APIHost + "/orgas")
                .then((res) => res.json())
                .then((data) => {
                    setOrgaDataSource(data);
                    const timer = setTimeout(() => {
                        setapidataloadedorgas(true);
                    }, 1000);
                    setapidataloadedorgas(false);
                    return () => clearTimeout(timer);
                })
                .catch(console.log);
        } else {
            setOrgaDataSource(orgas_json);
            setapidataloadedorgas(true);
        }
    }, []);

    // get ORGA  dropdown options
    const getColNamesOptionsOrga = () => {
        if (orgaDataSource !== null && orgaDataSource !== undefined) {
            const options = orgaDataSource
                .filter((option) => option.id !== null)
                .map((option) =>
                    String(
                        option.id +
                            " - " +
                            option.orga_nr +
                            " - " +
                            option.orga_name
                    )
                );
            return options;
        } else return [];
    };

    // get Values from dropdown inputs / set register input at organisation or function
    const handleDropdownInputs = (e) => {
        if (e.target.value === "" || e.target.value === 0) {
            const filter = e.target.id.split("-")[0];
            setNewCons({ ...newCons, [filter]: e.target.textContent });
        } else {
            const filter = e.target.id.split("-")[0];
            setNewCons({ ...newCons, [filter]: e.target.value });
        }
    };

    //////// radio button management

    const [checkRadio, setCheckRadio] = useState("new");

    const handleRadioButton = (event) => {
        setNewCons({ ...newCons, mara_id: "", mara_nr: "", mat_desc: "" });
        setCheckRadio(event.target.value);
    };

    ///// Jump to Material Search

    const onClickGoMaterialSearch = () => {
        setOpenAddCons(false);
        setOpenSearchMaterial(true);
        setJumpToMaterialSearch("AddConstruction");
    };

    useEffect(() => {
        if (
            useSelectedMaterial.mara_id !== "" &&
            useSelectedMaterial.mat_desc !== "" &&
            useSelectedMaterial.mara_nr !== ""
        ) {
            setNewCons({
                ...newCons,
                mara_id: useSelectedMaterial.mara_id,
                mat_desc: useSelectedMaterial.mat_desc,
                mara_nr: useSelectedMaterial.mara_nr,
            });
        }
    }, [useSelectedMaterial]);

    useEffect(() => {
        if (jumpToMaterialSearch === "reset") {
            resetInputs();
            setJumpToMaterialSearch("");
        }
    }, [jumpToMaterialSearch]);

    return (
        <Dialog
            open={openAddCons}
            onClose={handleCloseAddConsBreak}
            aria-labelledby="form-dialog-title"
            fullWidth={true}
        >
            <DialogTitle id="form-dialog-title">
                Konstruktion Erstellen
            </DialogTitle>
            <DialogContent>
                <DialogContentText style={{ color: "black" }}>
                    Erstellen Sie eine Konstruktion.
                </DialogContentText>
                {!apidataloadedorgas && useAPI ? (
                    <div className={classes.progress}>
                        <CircularProgress />
                        <br />
                    </div>
                ) : (
                    <div>
                        <Grid container className={classes.textbox}>
                            <Grid item xs={6}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="kons_title"
                                    label="Konstruktionstitel"
                                    type="name"
                                    onChange={handleKonsInputs}
                                    value={newCons.kons_title}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="kons_desc"
                                    label="Konstruktionsbescheibung"
                                    type="name"
                                    onChange={handleKonsInputs}
                                    value={newCons.kons_desc}
                                />
                            </Grid>
                        </Grid>
                        <Grid container className={classes.textbox}>
                            <Grid item xs={5}>
                                <Autocomplete
                                    disableClearable
                                    value={newCons.orga_id}
                                    onChange={handleDropdownInputs}
                                    id="orga_id"
                                    size="small"
                                    options={getColNamesOptionsOrga()}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            value={newCons.orga_id}
                                            placeholder="Organisation"
                                            margin="dense"
                                            variant="outlined"
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                        <Grid container style={{ marginTop: 25 }}>
                            <Grid item xs={10}>
                                <FormLabel component="legend">
                                    Erstelle eine neue Konstruktion zu einem...
                                </FormLabel>
                                <RadioGroup
                                    aria-label="quiz"
                                    name="quiz"
                                    value={checkRadio}
                                    onChange={handleRadioButton}
                                >
                                    <Grid container className={classes.textbox}>
                                        <Grid item xs={5}>
                                            <FormControlLabel
                                                value="new"
                                                control={<Radio />}
                                                label="neuen Material."
                                            />
                                        </Grid>
                                        <Grid item xs={5}>
                                            <FormControlLabel
                                                value="old"
                                                control={<Radio />}
                                                label="bekannten Material."
                                            />
                                        </Grid>
                                    </Grid>
                                </RadioGroup>
                            </Grid>
                        </Grid>
                        <Grid container className={classes.textbox}>
                            <Grid item xs={6}>
                                {checkRadio === "old" ? (
                                    <Grid container>
                                        <Grid item xs={8}>
                                            <TextField
                                                autoFocus
                                                margin="dense"
                                                id="mara_nr"
                                                label="Materialnummer"
                                                type="name"
                                                onChange={handleKonsInputs}
                                                value={newCons.mara_nr}
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <IconButton
                                                color="secondary"
                                                aria-label="add an alarm"
                                                onClick={
                                                    onClickGoMaterialSearch
                                                }
                                                style={{ height: "100%" }}
                                            >
                                                <SearchOutlinedIcon />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                ) : (
                                    <div>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="mara_nr"
                                            label="Materialnummer"
                                            type="name"
                                            onChange={handleKonsInputs}
                                            value={newCons.mara_nr}
                                        />
                                    </div>
                                )}
                            </Grid>
                            <Grid item xs={6}>
                                {checkRadio === "old" ? (
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="mat_desc"
                                        label="Materialbeschreibung"
                                        type="name"
                                        onChange={handleKonsInputs}
                                        value={newCons.mat_desc}
                                        disabled
                                    />
                                ) : (
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="mat_desc"
                                        label="Materialbeschreibung"
                                        type="name"
                                        onChange={handleKonsInputs}
                                        value={newCons.mat_desc}
                                    />
                                )}
                            </Grid>
                        </Grid>
                    </div>
                )}
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleCloseAddConsBreak}
                    variant="outlined"
                    className={classes.buttons}
                >
                    Abbrechen
                </Button>
                <Button
                    onClick={handleCloseAddCons}
                    variant="outlined"
                    className={classes.buttons}
                >
                    Erstellen
                </Button>
            </DialogActions>
        </Dialog>
    );
}
