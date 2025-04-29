import { Button, Container, Grid, List, ListItem, Typography, makeStyles } from "@material-ui/core";
import React, { Component, useRef } from "react";

import { Ansprechpartner } from "../../components/Ansprechpartner/Ansprechpartner";
import NavBar from "../../components/NavBar/NavBar";
import PartnerLogos from "../../components/PartnerLogos/PartnerLogos";
import { SearchDialog } from "../../components/Search_OUTDATED/SearchDialog_OUTDATED";
import { TriangleSpacer } from "../../components/Spacers/TriangleSpacer";
import colors from "../../variables/colors";
import solution from "../../assets/img/solution.jpg";

const useStyles = makeStyles((theme) => ({
  paragraph: {
    padding: theme.spacing(16),
    color: colors.black,
  },
}));

const Heading = (props) => {
  return (
    <>
      <Typography variant={props.variant} align="center">
        {props.children}
      </Typography>
      <hr width="25%"></hr>
    </>
  );
};

const Paragraph = (props) => {
  const classes = useStyles();
  return (
    <Grid
      container
      justify="center"
      style={{
        backgroundColor: `${props.backgroundColor}`,
      }}
      className={classes.paragraph}
    >
      <Grid
        item
        xs={12}
        // className={classes.paragraph}
        style={{
          margin: -2,
        }}
      >
        <Container maxWidth="md" style={{ color: `${props.color || colors.black}` }}>
          <Typography variant="h4" align="center">
            {props.heading}
          </Typography>
          <hr width="25%"></hr>
        </Container>
      </Grid>
      <Grid
        item
        xs={12}
        // className={classes.paragraph}
        style={{
          margin: -2,
        }}
      >
        <Container maxWidth="md" style={{ color: `${props.color || colors.black}` }}>
          <Typography variant="h6" align={props.alignText || "justify"}>
            {props.text}
          </Typography>
        </Container>
      </Grid>
      <Grid
        container
        justify="center"
        // className={classes.paragraph}
        style={{
          margin: -2,
        }}
      >
        <Grid item>
          <Container maxWidth="lg" style={{ color: `${props.color || "black"}` }}>
            {props.children}
          </Container>
        </Grid>
      </Grid>
    </Grid>
  );
};

export const Home = () => {
  const classes = useStyles();

  return (
    <Grid container>
      <Grid item xs={12}>
        <NavBar></NavBar>
      </Grid>
      <Grid item xs={12}>
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item xs={12} className={classes.paragraph}>
            <Container maxWidth="lg">
              <Typography variant="h2" align="center">
                Über das Projekt DiMOP
              </Typography>
              <Typography variant="h6" align="center">
                Digitale multikriterielle Materialauswahl zur optimierten Kreislauffähigkeit von Kunststoffprodukten
              </Typography>
            </Container>
          </Grid>
          <Grid item xs={12}>
            <PartnerLogos />
          </Grid>

          <TriangleSpacer variant="topLeft" backgroundColor={colors.lightGrey} />
          <Paragraph
            heading="Hintergrund"
            text="Um die Ziele der EU-Plastikstrategie zu erreichen,
                            und eine Kreislaufwirtschaft für Kunststoffe zu
                            etablieren, muss insbesondere die Recycling- bzw.
                            Kreislauffähigkeit von Kunststoffprodukten
                            signifikant verbessert werden. Bisher spielt das
                            Thema „Kreislauffähigkeit“ beim Produktdesign jedoch
                            kaum eine Rolle. Produktentwickler treffen am Beginn
                            des Lebenszyklus wichtige Entscheidungen für den
                            weiteren Weg eines Produkts. Recycler sollen das
                            „Ergebnis“ dann am Ende des Lebenszyklus verwerten.
                            Allerdings leben beide in völlig getrennten Welten,
                            es gibt keinen Austausch. In der Folge werden
                            oftmals Kunststoffmaterialien ausgewählt, die beim
                            Recycling zu erheblichen Problemen führen."
            backgroundColor={colors.lightGrey}
          />
          <TriangleSpacer variant="bottomLeft" backgroundColor={colors.lightGrey} />
          <Paragraph
            heading="Aufgabenstellung"
            text="Um hier Abhilfe zu schaffen, sollen durch das
                        Projekt „Digitale multikriterielle Materialauswahl
                        zur optimierten Kreislauffähigkeit von
                        Kunststoffprodukten – DIMOP“ wichtige Informationen
                        zur Kreislauffähigkeit verschiedener
                        Kunststoffmaterialien und Materialkombinationen beim
                        Produktdesign zur Verfügung gestellt werden. Dadurch
                        können verschiedene Kriterien, z. B. Funktionalität,
                        Ressourceneffizienz und Kreislauffähigkeit,
                        gegeneinander abgewogen werden und eine ganzheitlich
                        optimierte Materialauswahl getroffen werden. Am Ende
                        des Lebenszyklus ist es möglich, die Produkte besser
                        zu recyceln und die Wertstoffe dem Kreislauf erneut
                        zuzuführen."
          />
          <TriangleSpacer variant="topRight" backgroundColor={colors.lightGrey} />
          <Paragraph
            heading="Lösungsansatz"
            text="Im Forschungsvorhaben werden für relevante und
                        materialbedingte Problemfelder des Recyclings
                        alternative Ansätze für die Materialauswahl erfasst,
                        systematisiert und verallgemeinert. Darauf aufbauend
                        soll eine Methode zur multikriteriell optimierten
                        Materialauswahl entwickelt werden. Dabei gilt es,
                        Zielkonflikte zu identifizieren und Hilfestellungen
                        zu deren Vermeidung zu geben."
            backgroundColor={colors.lightGrey}
          />
          <TriangleSpacer variant="bottomRight" backgroundColor={colors.lightGrey} />
          <Grid item>
            <img src={solution} alt="solution" style={{ height: 220, padding: 5 }}></img>
            <Grid item xs={12} className={classes.paragraph}>
              <Typography variant="body1" align="justify">
                <i>Abbildung: Konzeptuelle Darstellung des Lösungsansatzes von DIMOP</i>
              </Typography>
            </Grid>
          </Grid>
          <TriangleSpacer variant="topLeft" backgroundColor={colors.lightGrey} />
          <Paragraph
            heading="Ergebnisverwertung und Umsetzung"
            text="Auf dieser Basis wird ein Software-Tool zur
                        praxistauglichen Umsetzung des erarbeiteten Modells
                        entwickelt. Durch Schaffung von Schnittstellen zu
                        Unternehmenssoftware soll die Integration in
                        betriebliche Prozesse unterstützt werden. Der
                        Projektfortschritt wird kontinuierlich unter
                        Einbeziehung der beteiligten Unternehmen validiert.
                        Die Überprüfung der Praxistauglichkeit der
                        Forschungsergebnisse erfolgt durch die Entwicklung
                        einer Pilotanwendung. Als Ergebnis des
                        DIMOP-Projekts sollen allen Unternehmen der
                        bayerischen Kunststoffindustrie digitale Werkzeuge
                        zur Verfügung stehen, die eine Entscheidungshilfe
                        bei der Materialauswahl für Kunststoffprodukte
                        liefern, um somit deren Kreislauffähigkeit zu
                        steigern."
            backgroundColor={colors.lightGrey}
          />
          <TriangleSpacer variant="bottomLeft" backgroundColor={colors.lightGrey} />
          <Paragraph
            heading="Beitrag zur Ressourceneffizienz"
            text="Die Ergebnisse führen durch eine verbesserte
                        Kreislauffähigkeit von Kunststoffen zu einer
                        Steigerung der Ressourceneffizienz und
                        Wettbewerbsfähigkeit dieses Werkstoffs in Bayern. So
                        können „grüne“ Produkte steigenden
                        Marktanforderungen gerecht werden. Ferner werden
                        Qualität und Verfügbarkeit von Sekundärrohstoffen
                        erhöht. Darüber hinaus ergibt sich eine Verbesserung
                        der Materialeffizienz durch das vereinfachte
                        Recycling von Produktionsabfällen."
          />
          <TriangleSpacer variant="topRight" backgroundColor={colors.lightGrey} />
          <Paragraph heading="Veröffentlichungen und weiterführende Links" text="" backgroundColor={colors.lightGrey}>
            <List>
              <ListItem>
                <Typography variant="body1" align="justify">
                  <a
                    href="https://www.stmuv.bayern.de/themen/ressourcenschutz/forcycle/forcycle2/teilprojekt_6.htm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Projektseite (Bayerisches Staatsministerium für Umwelt und Verbraucherschutz)
                  </a>
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant="body1" align="justify">
                  <a
                    href="https://www.recyclingmagazin.de/2019/09/11/mehr-kunststoffe-recyclingfaehig-machen/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Mehr Kunststoffe recyclingfähig machen (RECYCLING magazin)
                  </a>
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant="body1" align="justify">
                  <a
                    href="https://www.kunststoffweb.de/branchen-news/skz_projekt_fuer_recyclinggerechtes_produktdesign_t243364"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    SKZ: Projekt für recyclinggerechtes Produktdesign (Kunststoff Web)
                  </a>
                </Typography>
              </ListItem>
            </List>
          </Paragraph>
          <TriangleSpacer variant="bottomRight" backgroundColor={colors.lightGrey} />


        {/*
        
              <Paragraph heading="Ansprechpartner">
            <Ansprechpartner />
          </Paragraph>
        
        
        */}




        </Grid>
      </Grid>
    </Grid>
  );
};
