import React, { Component } from "react";

import logo_uni from "../../assets/img/Universität_Würzburg_Logo.svg";
import logo_skz from "../../assets/img/skz_logo.png";
import logo_stami from "../../assets/img/stami.png";
import logo_forcycle2 from "../../assets/img/forcycle2.png";

import { Grid, Typography } from "@material-ui/core";

const Logo = (props) => {
    return (
        <Grid container justify="center">
            <Grid item>
                <a href={props.href} target="_blank">
                    <img
                        src={props.src}
                        style={{ height: 64, marginTop: 16, marginBottom: 16 }}
                        alt={props.alt}
                    />
                </a>
            </Grid>
        </Grid>
    );
};

export default class PartnerLogos extends Component {
    render() {
        return (
            <Grid container justify="center">
                <Grid item xs={6} md={3}>
                    <Logo
                        href="https://www.wiwi.uni-wuerzburg.de/lehrstuhl/wiinf2/startseite/"
                        src={logo_uni}
                        alt="logo_uni"
                    />
                </Grid>

                <Grid item xs={6} md={3}>
                    <Logo
                        href="https://www.skz.de/de/index.html"
                        src={logo_skz}
                        alt="logo_skz"
                    />
                </Grid>

                <Grid item xs={6} md={3}>
                    <Logo
                        href="https://www.stmuv.bayern.de"
                        src={logo_stami}
                        alt="logo_stami"
                    />
                </Grid>

                <Grid item xs={6} md={3}>
                    <Logo
                        href="https://www.stmuv.bayern.de/themen/ressourcenschutz/forcycle/forcycle2/index.htm"
                        src={logo_forcycle2}
                        alt="logo_forcycle2"
                    />
                </Grid>
            </Grid>
        );
    }
}
