import React, { useContext, useState, useEffect, Fragment } from "react";

import {
    Button,
    CircularProgress,
    Grid,
    Step,
    StepLabel,
    Stepper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import NavBar from "../../components/NavBar/NavBar";

import ConstructionLoad from "./ConstructionLoad_OUTDATED";
import variants from "../../files/constructionVariantsById.json";
import { DataTable } from "../../components/DataTable_OUTDATED/DataTable_OUTDATED";

// css theme || use classes.NAME
const useStyles = makeStyles((theme) => ({}));

// build construction view
export default function Construction() {
    // standard import for using styles
    const classes = useStyles();
    // const theme = useTheme();

    const [constructionLoadedId, setConstructionLoadedId] = useState(null);
    const [loadDialogOpen, setLoadDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        //fetch data
        // fetch("constructionById/constructionLoadedId").then(res => res.json()).then(res => {
        //     setData(res)
        //     setLoading(false)
        // })
        console.log("use effect");
    }, [constructionLoadedId]);

    // get managed states from context
    // const {
    //     open_load_cons,
    //     content_num,
    // } = useContext(ConstructionContext);

    return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <NavBar></NavBar>
                </Grid>
            </Grid>

            <Grid container spacing={3} justify="center">
                <Grid item>
                    <Stepper activeStep="1">
                        <Step key="1">
                            <StepLabel>Konstruktion laden</StepLabel>
                        </Step>
                        <Step key="2">
                            <StepLabel>Varianten vergleichen</StepLabel>
                        </Step>
                    </Stepper>
                </Grid>
            </Grid>
            <Grid container spacing={3} justify="center">
                <Grid item>
                    {constructionLoadedId ? (
                        <Fragment>
                            {isLoading ? (
                                <CircularProgress />
                            ) : (
                                <DataTable
                                    data={variants.data}
                                    columns={variants.columns}
                                    rowClick={() => console.log("asd")}
                                />
                            )}
                        </Fragment>
                    ) : (
                        <Fragment>
                            <Typography variant="h1" align="center">
                                Laden Sie eine Konstruktion
                            </Typography>
                            <Button onClick={() => setLoadDialogOpen(true)}>
                                Konstruktion auswählen
                            </Button>
                        </Fragment>
                    )}
                </Grid>
            </Grid>

            {/* Dialogs */}
            <ConstructionLoad
                open={loadDialogOpen}
                setOpen={setLoadDialogOpen}
                setConstructionLoadedId={setConstructionLoadedId}
            />
        </div>
    );
}
