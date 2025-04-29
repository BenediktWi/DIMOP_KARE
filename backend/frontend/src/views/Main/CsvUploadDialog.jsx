import React from "react";
import { useContext, useState } from "react";
import * as XLSX from "xlsx";

//Components
import { MainContext } from "./MainContext.jsx";

//Material UI
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { Typography } from "@material-ui/core";
import PublishIcon from "@material-ui/icons/Publish";
import {
  Grid as GridDevExpress,
  Table,
  TableHeaderRow,
} from "@devexpress/dx-react-grid-material-ui";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import WarningIcon from "@material-ui/icons/Warning";

// css theme
const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  buttons: {
    borderColor: "#005000",
    color: "#005000",
    textTransform: "none",
    margin: 20,
    height: 30,
    width: 120,
  },
}));

const CsvUploadDialog = () => {
  const classes = useStyles();

  const {
    csv_upload_open,
    selected_construction_id,
    orga_id,
    new_bom_created,
  } = useContext(MainContext);
  const [selectedConstructionId, setSelectedConstructionId] =
    selected_construction_id;
  const [orgaId, setOrgaId] = orga_id;
  const [csvUploadOpen, setCsvUploadOpen] = csv_upload_open;

  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const [columnsRelations, setColumnsRelations] = useState([]);
  const [dataRelations, setDataRelations] = useState([]);
  const [loadedRelations, setLoadedRelations] = useState(false);
  const [errorOccured, setErrorOccured] = useState(false);

  const [newBomCreated, setNewBomCreated] = new_bom_created;

  const handleClickOpen = () => {
    setCsvUploadOpen(true);
  };

  const handleClose = () => {
    setCsvUploadOpen(false);
  };

  const handleUpload = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data,
        dataRelations,
        selectedConstructionId,
        orgaId,
      }),
      redirect: "follow",
    };

    fetch("/import", requestOptions)
      .then((res) => {
        return res.json();
      })
      .then((d) => {
        console.log(d);

        if (d == 0) {
          setNewBomCreated(!newBomCreated);
          setCsvUploadOpen(false);
          setErrorOccured(false);
          setDataRelations([]);
          setData([]);
        } else {
          setErrorOccured(true);
        }
      });
  };

  // process CSV data
  const processData = (dataString) => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(
      /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
    );

    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(
        /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
      );
      if (headers && row.length == headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] == '"') d = d.substring(1, d.length - 1);
            if (d[d.length - 1] == '"') d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }

        // remove the blank rows
        if (Object.values(obj).filter((x) => x).length > 0) {
          list.push(obj);
        }
      }
    }

    // prepare columns list from headers
    const columns = headers.map((c) => ({
      name: c,
      selector: c,
    }));

    setData(list);
    setColumns(columns);
    setLoaded(true);
  };

  // process CSV data
  const processDataRelations = (dataString) => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(
      /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
    );

    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(
        /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
      );
      if (headers && row.length == headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] == '"') d = d.substring(1, d.length - 1);
            if (d[d.length - 1] == '"') d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }

        // remove the blank rows
        if (Object.values(obj).filter((x) => x).length > 0) {
          list.push(obj);
        }
      }
    }

    // prepare columns list from headers
    const columns = headers.map((c) => ({
      name: c,
      selector: c,
    }));

    setDataRelations(list);
    setColumnsRelations(columns);
    setLoadedRelations(true);
  };

  // handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processData(data);
    };
    reader.readAsBinaryString(file);
  };

  // handle file upload
  const handleFileUploadRelations = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processDataRelations(data);
    };
    reader.readAsBinaryString(file);
  };

  const [exampleColumns] = useState([
    { name: "colName", title: "Spaltenbezeichnung" },
    { name: "colDesc", title: "Spaltenbeschreibung" },
    { name: "colContent", title: "Spalteninhalt" },
    { name: "required", title: "Erforderlich" },
  ]);

  const [tableColumnExtensions] = useState([
    { columnName: "colName", width: 150 },
    { columnName: "colDesc", width: 400, wordWrapEnabled: true },
    { columnName: "colContent", width: 150 },
    { columnName: "required", width: 100 },
  ]);

  const [requiredData, setRequiredData] = useState([
    {
      colName: "id",
      colDesc: "Identifikation eine Komponente innerhalb der Stückliste",
      colContent: "Integer (Ganzzahl)",
      required: "Ja",
    },
    {
      colName: "parent_id",
      colDesc: "Zuordnung der Parentkomponente (deren id)",
      colContent: "Integer (Ganzzahl)",
      required: "Ja",
    },
    {
      colName: "mat_desc",
      colDesc: "Bezeichnung des Materials",
      colContent: "String (Text)",
      required: "Ja",
    },
    {
      colName: "is_atomic",
      colDesc:
        "Handelt es sich um eine Komponente der untersten Stufe? Falls ja, kann der Kompente ein Kunststoff zugeordnet werden. Falls nicht, können weitere Komponenten zugeordnet werden.",
      colContent: "1 (Ja) oder 0 (Nein)",
      required: "Ja",
    },
    {
      colName: "weight",
      colDesc: "Gewicht in g",
      colContent: "Float (Gleitkommazahl)",
      required: "Ja",
    },
    {
      colName: "mat_id_int",
      colDesc: "Interne Materialnummer (z.B. aus ERP-System)",
      colContent: "String (Text)",
      required: "Nein",
    },
    {
      colName: "cad_id",
      colDesc: "Interne Materialnummer aus CAD-System",
      colContent: "String (Text)",
      required: "Nein",
    },
    {
      colName: "plast_desc",
      colDesc:
        'Zugeordneter Kunststoff. Muss der Beschreibung in der Campus-Datenbank entsprechen (z.B. "ACRYMID® TT50").',
      colContent: "String (Text)",
      required: "Nein",
    },
    {
      colName: "plast_fam",
      colDesc:
        'Zugeordnete Kunststofffamilie ("PA66", "PP", "ABS", "TPE-U", "PUR", "PET", "PC", "PE-HD", "PE-LD", "POM", "PA6", "PS HI", "PBT", "PC+ABS", "PS", "SAN").',
      colContent: "String (Text)",
      required: "Nein",
    },
    {
      colName: "height",
      colDesc: "Höhe in mm",
      colContent: "Float (Gleitkommazahl)",
      required: "Nein",
    },
    {
      colName: "width",
      colDesc: "Breite in mm",
      colContent: "Float (Gleitkommazahl)",
      required: "Nein",
    },
    {
      colName: "depth",
      colDesc: "Tiefe in mm",
      colContent: "Float (Gleitkommazahl)",
      required: "Nein",
    },
    {
      colName: "volume",
      colDesc: "Volumen in mm^3",
      colContent: "Float (Gleitkommazahl)",
      required: "Nein",
    },
  ]);

  const [requiredDataRelations, setRequiredDataRelations] = useState([
    {
      colName: "p_id",
      colDesc: "Übergeordnetes Material (Column id aus Stückliste)",
      colContent: "Integer (Ganzzahl)",
      required: "Ja",
    },
    {
      colName: "m1_id",
      colDesc: "Material 1 (Column id aus Stückliste)",
      colContent: "Integer (Ganzzahl)",
      required: "Ja",
    },
    {
      colName: "m2_id",
      colDesc: "Material 2 (Column id aus Stückliste)",
      colContent: "Integer (Ganzzahl)",
      required: "Ja",
    },
    {
      colName: "rel_type",
      colDesc:
        "Verbindungstyp (1 = löslich/direkt, 2 = löslich/indirekt, 3 = nicht löslich/direkt, 4 = nicht löslich/indirekt)",
      colContent: "Integer (Ganzzahl)",
      required: "Ja",
    },
  ]);

  return (
    <div>
      <Button className={classes.buttons} onClick={handleClickOpen}>
        <PublishIcon style={{ marginRight: 5 }}></PublishIcon>
        Upload
      </Button>
      <Dialog
        open={csvUploadOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth={true}
        maxWidth={"md"}
      >
        <div style={{ width: "100%" }}>
          <DialogActions>
            <HighlightOffIcon
              style={{ color: "#005000" }}
              onClick={handleClose}
            ></HighlightOffIcon>
          </DialogActions>
          <DialogTitle id="form-dialog-title">Stückliste uploaden</DialogTitle>
          <DialogContent>
            <Typography>
              Bitte wählen Sie eine csv-Datei aus und achten Sie darauf, dass
              diese korrekt formatiert ist. Sie können auf "Mehr anzeigen"
              klicken, um Hilfe bei der Formatierung zu erhalten.
            </Typography>

            <Grid
              container
              item
              xs={12}
              justify="center"
              style={{ marginTop: 30, marginBottom: 30 }}
            >
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>Mehr anzeigen: Stückliste </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div style={{ marginTop: 20 }}>
                    <GridDevExpress
                      rows={requiredData}
                      columns={exampleColumns}
                    >
                      <Table columnExtensions={tableColumnExtensions} />
                      <TableHeaderRow />
                    </GridDevExpress>
                  </div>
                </AccordionDetails>
              </Accordion>
              <Grid
                container
                item
                xs={12}
                justify="center"
                style={{ marginTop: 20 }}
              ></Grid>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>Mehr anzeigen: Beziehungstypen</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div style={{ marginTop: 20 }}>
                    <GridDevExpress
                      rows={requiredDataRelations}
                      columns={exampleColumns}
                    >
                      <Table columnExtensions={tableColumnExtensions} />
                      <TableHeaderRow />
                    </GridDevExpress>
                  </div>
                </AccordionDetails>
              </Accordion>
            </Grid>

            <Grid container item xs={12} justify="center">
              <Typography>Vorschau: Stückliste</Typography>

              <div style={{ width: "100%" }}>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  style={{ marginBottom: 10 }}
                />
              </div>
            </Grid>

            <Grid
              container
              item
              xs={12}
              justify="center"
              style={{ marginTop: 20 }}
            >
              <div style={{ width: "100%" }}>
                <GridDevExpress rows={data} columns={columns}>
                  <Table />
                  <TableHeaderRow />
                </GridDevExpress>
              </div>
            </Grid>

            <Grid
              container
              item
              xs={12}
              justify="center"
              style={{ marginTop: 20 }}
            >
              <Typography>Vorschau: Beziehungstypen</Typography>

              <div style={{ width: "100%" }}>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUploadRelations}
                  style={{ marginBottom: 10 }}
                />
              </div>
            </Grid>
            <Grid
              container
              item
              xs={12}
              justify="center"
              style={{ marginTop: 20 }}
            >
              <div style={{ width: "100%" }}>
                <GridDevExpress rows={dataRelations} columns={columnsRelations}>
                  <Table />
                  <TableHeaderRow />
                </GridDevExpress>
              </div>
            </Grid>

            <Grid container item xs={12} justify="center">
              {errorOccured ? (
                <div style={{ color: "red", marginTop: 20, marginBottom: 20 }}>
                  <WarningIcon
                    style={{ fontSize: "small", marginRight: 10 }}
                  ></WarningIcon>{" "}
                  Bitte überprüfen Sie, ob Ihre Input-Dateien den Vorgaben entsprechen.
                </div>
              ) : (
                <div />
              )}
            </Grid>

            <Grid container item xs={12} justify="center">
              {loaded && loadedRelations ? (
                <div style={{ marginTop: 20 }}>
                  <Button
                    onClick={() => {
                      handleUpload();
                    }}
                    style={{
                      borderColor: "#005000",
                      color: "#005000",
                      textTransform: "none",
                      margin: 20,
                      height: 30,
                      width: 120,
                    }}
                  >
                    Upload
                  </Button>
                </div>
              ) : (
                <div style={{ marginTop: 20 }}>
                  <Button
                    onClick={handleClose}
                    style={{
                      borderColor: "#005000",
                      color: "#005000",
                      textTransform: "none",
                      margin: 20,
                      height: 30,
                      width: 120,
                    }}
                  >
                    Abbrechen
                  </Button>
                </div>
              )}
            </Grid>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
};
export default CsvUploadDialog;
