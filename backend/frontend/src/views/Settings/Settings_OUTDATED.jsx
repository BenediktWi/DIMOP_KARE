import React, { useEffect, useState } from "react";
import {
    Grid,
    List,
    ListItem,
    CircularProgress,
    Button,
} from "@material-ui/core";

import NavBar from "../../components/NavBar/NavBar";
import PartnerLogos from "../../components/PartnerLogos/PartnerLogos";

export default function Settings() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [anzeige, setAnzeige] = useState(1);

    useEffect(() => {
        // fetch data
        fetch("http://dummy.restapiexample.com/api/v1/employees") //url/endpoint austauschen
            .then((result) => result.json())
            .then(
                (result) => {
                    console.log(result);
                    // result verarbeiten
                    setData(result.data);

                    setLoading(false);
                },
                (error) => {
                    console.log("error while fetching data");
                }
            );

        // data state auf daten setzen
        // loading auf false setzen
    }, []);

    return (
        <div>
            <Grid container>
                <Grid item xs={12}>
                    <NavBar></NavBar>
                </Grid>
                <Grid item xs={12} style={{ background: "red" }}>
                    <Grid container style={{}}>
                        <Grid item xs={3} style={{ background: "yellow" }}>
                            {loading ? (
                                <CircularProgress />
                            ) : (
                                <List>
                                    {data.map((elem) => {
                                        return (
                                            <ListItem>
                                                {elem.employee_name}
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            )}
                        </Grid>
                        <Grid item xs={9} style={{ background: "orange" }}>
                            <Grid container>
                                <Grid item xs={12}>
                                    Prozessschritte
                                </Grid>
                                <Grid item xs={12} style={{ height: 400 }}>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Button
                                                variant="contained"
                                                onClick={() => setAnzeige(1)}
                                            >
                                                1
                                            </Button>
                                            <Button
                                                variant="contained"
                                                onClick={() => setAnzeige(2)}
                                            >
                                                2
                                            </Button>
                                        </Grid>
                                        <h1>Aktuelle Anzeige: </h1>
                                        <h1>{anzeige}</h1>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} style={{ background: "teal" }}>
                    <PartnerLogos />
                </Grid>
            </Grid>
        </div>
    );
}
