import { Container, Grid, List, ListItem, Typography, makeStyles } from "@material-ui/core";

import { Ansprechpartner } from "../../components/Ansprechpartner/Ansprechpartner";
import React from "react";
import { TriangleSpacer } from "../../components/Spacers/TriangleSpacer";
import solution from "../../assets/img/solution.jpg";

const useStyles = makeStyles((theme) => ({
  paragraph: {
    paddingBottom: theme.spacing(4),
    color: "black",
  },
}));

const Heading = (props) => {
  return (
    <>
      <Typography variant={props.variant}>{props.children}</Typography>
      <hr width="25%"></hr>
    </>
  );
};

export const WelcomeText = () => {
  const classes = useStyles();
  return (
    <Container maxWidth="md">
      <Grid container direction="row" justify="center" alignItems="center">
        <TriangleSpacer variant="bottom" />
        <Grid item xs={12} className={classes.paragraph}>
          <Typography variant="h2">Über das Projekt DiMOP</Typography>
        </Grid>

        <Grid item xs={12} className={classes.paragraph}>
          <Typography variant="h6">
            Digitale multikriterielle Materialauswahl zur optimierten Kreislauffähigkeit von Kunststoffprodukten
          </Typography>
        </Grid>
        <TriangleSpacer></TriangleSpacer>

        <Grid item xs={12} className={classes.paragraph}>
          <Heading variant="h4">Hintergrund</Heading>
        </Grid>
        <Grid item xs={12} className={classes.paragraph}>
          <Typography variant="body1" align="justify">
            Um die Ziele der EU-Plastikstrategie zu erreichen, und eine Kreislaufwirtschaft für Kunststoffe zu
            etablieren, muss insbesondere die Recycling- bzw. Kreislauffähigkeit von Kunststoffprodukten signifikant
            verbessert werden. Bisher spielt das Thema „Kreislauffähigkeit“ beim Produktdesign jedoch kaum eine Rolle.
            Produktentwickler treffen am Beginn des Lebenszyklus wichtige Entscheidungen für den weiteren Weg eines
            Produkts. Recycler sollen das „Ergebnis“ dann am Ende des Lebenszyklus verwerten. Allerdings leben beide in
            völlig getrennten Welten, es gibt keinen Austausch. In der Folge werden oftmals Kunststoffmaterialien
            ausgewählt, die beim Recycling zu erheblichen Problemen führen.
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.paragraph}>
          <Heading variant="h4">Aufgabenstellung</Heading>
        </Grid>
        <Grid item xs={12} className={classes.paragraph}>
          <Typography variant="body1" align="justify">
            Um hier Abhilfe zu schaffen, sollen durch das Projekt „Digitale multikriterielle Materialauswahl zur
            optimierten Kreislauffähigkeit von Kunststoffprodukten – DIMOP“ wichtige Informationen zur
            Kreislauffähigkeit verschiedener Kunststoffmaterialien und Materialkombinationen beim Produktdesign zur
            Verfügung gestellt werden. Dadurch können verschiedene Kriterien, z. B. Funktionalität, Ressourceneffizienz
            und Kreislauffähigkeit, gegeneinander abgewogen werden und eine ganzheitlich optimierte Materialauswahl
            getroffen werden. Am Ende des Lebenszyklus ist es möglich, die Produkte besser zu recyceln und die
            Wertstoffe dem Kreislauf erneut zuzuführen.
          </Typography>
        </Grid>

        <Grid item xs={12} className={classes.paragraph}>
          <Heading variant="h4">Lösungsansatz</Heading>
        </Grid>
        <Grid item xs={12} className={classes.paragraph}>
          <Typography variant="body1" align="justify">
            Im Forschungsvorhaben werden für relevante und materialbedingte Problemfelder des Recyclings alternative
            Ansätze für die Materialauswahl erfasst, systematisiert und verallgemeinert. Darauf aufbauend soll eine
            Methode zur multikriteriell optimierten Materialauswahl entwickelt werden. Dabei gilt es, Zielkonflikte zu
            identifizieren und Hilfestellungen zu deren Vermeidung zu geben.
          </Typography>
        </Grid>
        <Grid item>
          <img src={solution} alt="solution" style={{ height: 220, padding: 5 }}></img>
          <Grid item xs={12} className={classes.paragraph}>
            <Typography variant="body1" align="justify">
              <i>Abbildung: Konzeptuelle Darstellung des Lösungsansatzes von DIMOP</i>
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.paragraph}>
          <Heading variant="h4">Ergebnisverwertung und Umsetzung</Heading>
        </Grid>
        <Grid item xs={12} className={classes.paragraph}>
          <Typography variant="body1" align="justify">
            Auf dieser Basis wird ein Software-Tool zur praxistauglichen Umsetzung des erarbeiteten Modells entwickelt.
            Durch Schaffung von Schnittstellen zu Unternehmenssoftware soll die Integration in betriebliche Prozesse
            unterstützt werden. Der Projektfortschritt wird kontinuierlich unter Einbeziehung der beteiligten
            Unternehmen validiert. Die Überprüfung der Praxistauglichkeit der Forschungsergebnisse erfolgt durch die
            Entwicklung einer Pilotanwendung. Als Ergebnis des DIMOP-Projekts sollen allen Unternehmen der bayerischen
            Kunststoffindustrie digitale Werkzeuge zur Verfügung stehen, die eine Entscheidungshilfe bei der
            Materialauswahl für Kunststoffprodukte liefern, um somit deren Kreislauffähigkeit zu steigern.
          </Typography>
        </Grid>

        <Grid item xs={12} className={classes.paragraph}>
          <Heading variant="h4">Beitrag zur Ressourceneffizienz</Heading>
        </Grid>
        <Grid item xs={12} className={classes.paragraph}>
          <Typography variant="body1" align="justify">
            Die Ergebnisse führen durch eine verbesserte Kreislauffähigkeit von Kunststoffen zu einer Steigerung der
            Ressourceneffizienz und Wettbewerbsfähigkeit dieses Werkstoffs in Bayern. So können „grüne“ Produkte
            steigenden Marktanforderungen gerecht werden. Ferner werden Qualität und Verfügbarkeit von
            Sekundärrohstoffen erhöht. Darüber hinaus ergibt sich eine Verbesserung der Materialeffizienz durch das
            vereinfachte Recycling von Produktionsabfällen.
          </Typography>
        </Grid>

        <Grid item xs={12} className={classes.paragraph}>
          <Heading variant="h4">Veröffentlichungen und weiterführende Links</Heading>
        </Grid>

        <Grid item className={classes.paragraph}>
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
        </Grid>

        <Grid item xs={12} className={classes.paragraph}>
          <Heading variant="h4">Ansprechpartner</Heading>
        </Grid>
        <Grid item className={classes.paragraph}>
          <Ansprechpartner />
        </Grid>
      </Grid>
    </Container>
  );
};
