import React from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useState } from "react";

import constructions from "../../files/constructions.json";

import {
    Table,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@material-ui/core";
import { DataTable } from "../../components/DataTable_OUTDATED/DataTable_OUTDATED";

const ConstructionLoad = (props) => {
    // const [open, setOpen] = useState(props.loadDialogOpen || false);

    const openDialog = () => props.setOpen(true);
    const closeDialog = () => props.setOpen(false);

    const setConstructionLoadedId = (id) => {
        props.setConstructionLoadedId(id);
        closeDialog();
    };

    console.log(props);
    return (
        <div>
            <Dialog
                open={props.open}
                // onClose={handleCloseLoadConsBreak}
                aria-labelledby="form-dialog-title"
                fullWidth={true}
                maxWidth={"lg"}
            >
                <DialogTitle id="form-dialog-title">
                    Konstruktion Laden
                </DialogTitle>
                <DialogContent>
                    <DialogContentText style={{ color: "black" }}>
                        Wählen Sie die zu ladende Konstruktion aus.
                    </DialogContentText>
                    <DataTable
                        data={constructions.data}
                        columns={constructions.columns}
                        rowClick={setConstructionLoadedId}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={closeDialog} variant="outlined">
                        Abbrechen
                    </Button>
                    <Button
                        // onClick={handleCloseLoadCons}
                        variant="outlined"
                        style={{ marginLeft: 10 }}
                    >
                        Laden
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ConstructionLoad;
