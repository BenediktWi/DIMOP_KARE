import React from "react";

import norman from "../../assets/img/norman_pytel.jpg";
import {
    Typography,
    makeStyles,
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    card: {
        maxWidth: 345,
    },
    media: {
        height: 320,
    },
}));

export const Ansprechpartner = () => {
    const classes = useStyles();
    return (
        <Card className={classes.card}>
            <CardActionArea>
                <CardContent>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                    >
                        Lehrstuhl für BWL und Wirtschaftsinformatik Prof. Dr.
                        Axel Winkelmann
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                    >
                        Julius-Maximilians-Universität Würzburg
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                    >
                        Sanderring 2
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                    >
                        97070 Würzburg
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                    >
                        E-Mail: axel.winkelmann@uni-wuerzburg.de
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                    >
                        Telefon: +49 (0)931 31-89640
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};
