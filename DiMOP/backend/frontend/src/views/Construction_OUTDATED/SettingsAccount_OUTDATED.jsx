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

import { ConstructionContext } from "./ConstructionContext";
import { APIContext } from "../../APIContext";

import orgas_json from "../../files/old/orgas.json";
import funktion_json from "../../files/old/funktion.json";

const useStyles = makeStyles((theme) => ({
  textbox: {
    //textAlign: "center",
    //justifyContent: "center",
  },
  progress: {
    textAlign: "center",
    justifyContent: "center",
  },
}));

export default function SettingsAccount() {
  // get debugging API variable
  const { use_API, API_Host, API_User } = useContext(APIContext);
  const [useAPI, setUseAPI] = use_API;
  const [APIHost, setAPIHost] = API_Host;
  const [APIUser, setAPIUser] = API_User;

  // construction context states
  const { open_settings_account } = useContext(ConstructionContext);
  const [openSettingsAccount, setOpenSettingsAccount] = open_settings_account;

  const classes = useStyles();

  const [apidataloaded, setapidataloaded] = useState(false);
  const [editedAccount, setEditedAccount] = useState({
    firstname: "",
    surname: "",
    e_mail: "",
    orga_id: "",
    t_function_id: "",
  });

  const handleCloseSettingsAccount = () => {
    if (
      editedAccount.firstname !== null &&
      editedAccount.firstname !== "" &&
      editedAccount.surname !== null &&
      editedAccount.surname !== "" &&
      editedAccount.e_mail !== null &&
      editedAccount.e_mail !== "" &&
      editedAccount.orga_id !== null &&
      editedAccount.orga_id !== "" &&
      editedAccount.t_function_id !== null &&
      editedAccount.t_function_id !== ""
    ) {
      editAccount(editedAccount);
      setOpenSettingsAccount(false);
    } else {
      setOpenSettingsAccount(true);
    }
  };

  const handleCloseSettingsAccountBreak = () => {
    setOpenSettingsAccount(false);
  };

  const editAccount = (account) => {
    if (useAPI) {
      const req = {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: account.firstname,
          surname: account.surname,
          e_mail: account.e_mail,
          orga_id: Number(String(account.orga_id).split(" - ")[0]),
          t_function_id: Number(String(account.t_function_id).split(" - ")[0]),
        }),
      };
      fetch(APIHost + "/user/" + APIUser, req)
        .then((res) => {
          res.json();
        })
        .then((result) => console.log(result));
    }
  };

  const handleAccountInputs = (event) => {
    setEditedAccount({
      ...editedAccount,
      [event.target.id]: event.target.value,
    });
  };

  useEffect(() => {
    if (useAPI) {
      fetch(APIHost + "/user/" + APIUser)
        .then((res) => res.json())
        .then((data) => {
          transformData(data);
          const timer = setTimeout(() => {
            // console.log('This will run after 1 second!')
            setapidataloaded(true);
          }, 1000);
          return () => clearTimeout(timer);
        })

        .catch(console.log);
    }
  }, []);

  // transform JSON/API Data
  const transformData = (data) => {
    const source = data.map((item) => {
      return {
        firstname: item.firstname,
        surname: item.surname,
        e_mail: item.e_mail,
        orga_id: item.orga_id,
        t_function_id: item.t_function_id,
      };
    });
    setEditedAccount(source[0]);
  };

  const [orgaDataSource, setOrgaDataSource] = useState();
  const [apidataloadedorgas, setapidataloadedorgas] = useState(false);
  const [funktionDataSource, setFunktionDataSource] = useState();
  const [apidataloadedfunction, setapidataloadedfunction] = useState(false);

  // useEffect for get orga data
  useEffect(() => {
    if (useAPI) {
      fetch(APIHost + "/orgas")
        .then((res) => res.json())
        .then((data) => {
          setOrgaDataSource(data);
          const timer = setTimeout(() => {
            setapidataloadedorgas(true);
            // console.log('This will run after 1 second!')
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

  // useEffect for get functions data
  useEffect(() => {
    if (useAPI) {
      fetch(APIHost + "/functions")
        .then((res) => res.json())
        .then((data) => {
          setFunktionDataSource(data);
          const timer = setTimeout(() => {
            setapidataloadedfunction(true);
            // console.log('This will run after 1 second!')
          }, 1000);
          setapidataloadedfunction(false);
          return () => clearTimeout(timer);
        })
        .catch(console.log);
    } else {
      setFunktionDataSource(funktion_json);
      setapidataloadedfunction(true);
    }
  }, []);

  // get ORGA  dropdown options
  const getColNamesOptionsOrga = () => {
    if (orgaDataSource !== null && orgaDataSource !== undefined) {
      const options = orgaDataSource
        .filter((option) => option.id !== null)
        .map((option) =>
          String(option.id + " - " + option.orga_nr + " - " + option.orga_name)
        );
      return options;
    } else return [];
  };

  // get FUNKTION  dropdown options
  const getColNamesOptionsFunktion = () => {
    if (funktionDataSource !== null && funktionDataSource !== undefined) {
      const options = funktionDataSource
        .filter((option) => option.id !== null)
        .map((option) => String(option.id + " - " + option.function));
      return options;
    } else return [];
  };

  // get ORGA  dropdown default option
  const getDefaultOptionsOrga = (orga_id) => {
    if (orgaDataSource !== null && orgaDataSource !== undefined) {
      const options = orgaDataSource
        .filter((option) => option.id !== null)
        .map((option) =>
          String(option.id + " - " + option.orga_nr + " - " + option.orga_name)
        );
      return options[Number(String(orga_id).split(" - ")[0]) - 1];
    } else return [];
  };

  // get FUNKTION default  dropdown option
  const getDefaultOptionsFunktion = (funktion_id) => {
    if (funktionDataSource !== null && funktionDataSource !== undefined) {
      const options = funktionDataSource
        .filter((option) => option.id !== null)
        .map((option) => String(option.id + " - " + option.function));
      return options[Number(String(funktion_id).split(" - ")[0]) - 1];
    } else return [];
  };

  // get Values from dropdown inputs / set register input at organisation or function
  const handleDropdownInputs = (e) => {
    if (e.target.value === "" || e.target.value === 0) {
      const filter = e.target.id.split("-")[0];
      setEditedAccount({ ...editedAccount, [filter]: e.target.textContent });
    } else {
      const filter = e.target.id.split("-")[0];
      setEditedAccount({ ...editedAccount, [filter]: e.target.value });
    }
  };

  return (
    <Dialog
      open={openSettingsAccount}
      onClose={handleCloseSettingsAccountBreak}
      aria-labelledby="form-dialog-title"
      fullWidth={true}
    >
      <DialogTitle id="form-dialog-title">Account bearbeiten</DialogTitle>
      <DialogContent>
        <DialogContentText style={{ color: "black" }}>
          Bearbeiten Sie die Daten ihres Accounts.
        </DialogContentText>
        {!apidataloaded &&
        !apidataloadedorgas &&
        !apidataloadedfunction &&
        useAPI ? (
          <div className={classes.progress}>
            <CircularProgress />
            <br />
          </div>
        ) : (
          <Grid container className={classes.textbox}>
            <Grid item xs={4}>
              <TextField
                autoFocus
                margin="dense"
                id="firstname"
                label="Vorname"
                type="name"
                onChange={handleAccountInputs}
                value={editedAccount.firstname}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                autoFocus
                margin="dense"
                id="surname"
                label="Nachname"
                type="name"
                onChange={handleAccountInputs}
                value={editedAccount.surname}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                autoFocus
                margin="dense"
                id="e_mail"
                label="E-Mail"
                type="name"
                onChange={handleAccountInputs}
                value={editedAccount.e_mail}
              />
            </Grid>
          </Grid>
        )}
        {!apidataloaded &&
        !apidataloadedorgas &&
        !apidataloadedfunction &&
        useAPI ? (
          <div className={classes.progress}>
            <CircularProgress />
            <br />
          </div>
        ) : (
          <Grid container className={classes.textbox}>
            <Grid item xs={6}>
              <Grid container>
                <Grid item xs={12}>
                  Organisation
                </Grid>
                <Grid item xs={11}>
                  <Autocomplete
                    disableClearable
                    value={getDefaultOptionsOrga(editedAccount.orga_id)}
                    onChange={handleDropdownInputs}
                    id="orga_id"
                    size="small"
                    options={getColNamesOptionsOrga()}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        value={getDefaultOptionsOrga(editedAccount.orga_id)}
                        placeholder="Organisation"
                        margin="dense"
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid container>
                <Grid item xs={12}>
                  Funktion
                </Grid>
                <Grid item xs={11}>
                  <Autocomplete
                    disableClearable
                    value={getDefaultOptionsFunktion(
                      editedAccount.t_function_id
                    )}
                    onChange={handleDropdownInputs}
                    id="t_function_id"
                    size="small"
                    options={getColNamesOptionsFunktion()}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        value={getDefaultOptionsFunktion(
                          editedAccount.t_function_id
                        )}
                        placeholder="Funktion"
                        margin="dense"
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      {!apidataloaded &&
      !apidataloadedorgas &&
      !apidataloadedfunction &&
      useAPI ? (
        <DialogActions>
          <Button
            onClick={handleCloseSettingsAccountBreak}
            variant="outlined"
            style={{ marginLeft: 10 }}
          >
            Abbrechen
          </Button>
        </DialogActions>
      ) : (
        <DialogActions>
          <Button
            onClick={handleCloseSettingsAccountBreak}
            variant="outlined"
            style={{ marginLeft: 10 }}
          >
            Abbrechen
          </Button>
          <Button
            onClick={handleCloseSettingsAccount}
            variant="outlined"
            style={{ marginLeft: 10 }}
          >
            Ändern
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
