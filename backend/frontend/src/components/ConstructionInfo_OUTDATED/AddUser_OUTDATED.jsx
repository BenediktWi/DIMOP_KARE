import React, { useContext, useState, useEffect } from "react";

import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider";
import { CircularProgress } from "@material-ui/core";

import { Dropdown } from "semantic-ui-react";

// import context for state management
import { ConstructionContext } from "../../views/Construction/ConstructionContext";
import { APIContext } from "../../APIContext";

import AllUser_JSON from "../../files/addusersearchall.json";
import TableProjektTeam_JSON from "../../files/table_projektteam.json";

// css theme
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(3),
  },
  Button: {
    marginLeft: 20,
  },
  Divider: {
    margin: 0,
    marginTop: 15,
  },
  progress: {
    textAlign: "center",
    justifyContent: "center",
    padding: 15,
  },
}));

export default function AddUser() {
  const classes = useStyles();

  // get debugging API variable
  const { use_API, API_Host } = useContext(APIContext);
  const [useAPI, setUseAPI] = use_API;
  const [APIHost, setAPIHost] = API_Host;

  // get managed states || all data in user
  const { open_add_user, need_refresh_project_team, loaded_cons } = useContext(
    ConstructionContext
  );
  const [openAddUser, setOpenAddUser] = open_add_user;
  const [
    needRefreshProjectTeam,
    setNeedRefreshProjectTeam,
  ] = need_refresh_project_team;
  const [loadedCons, setLoadedCons] = loaded_cons;

  // states for addUser dropdown selected user
  const [dropdownSelected, setDropdownSelected] = useState();
  const [labelUserSearch, setLabelUserSearch] = useState();

  // state for selected user
  const [selectedUser, setSelectedUser] = useState([
    {
      id: "",
      name: "",
      funktion: "",
      organisation: "",
      email: "",
      user_read: false,
      user_write: false,
      user_delete: false,
      funktion_id: "",
      orga_id: "",
      del_kz: "",
    },
  ]);

  // prepare json data allUser for dropdown
  const allUser_json = AllUser_JSON.ConstructionInfoAllUser;
  const [allUser, setAllUser] = useState(allUser_json);
  const [allUserDropDown, setAllUserDropDown] = useState([]);
  const [apiDataLoadedAllUser, setApiDataLoadedAllUser] = useState(false);
  const [apiDataLoadedExistingUser, setApiDataLoadedExistingUser] = useState(
    false
  );

  // transform perp user data for dropdown
  const transformPerpDropdownData = (data) => {
    if (data !== null && data.length !== 0) {
      // get key/text/value as keys for using in dropdown
      const source = data.map((item) => {
        return {
          key: item.user_id,
          text: item.user_id + " - " + item.firstname + " " + item.surname,
          value: item.user_id,
        };
      });
      return source;
    } else return;
  };

  // transform user data for dropdown
  const transformDropdownData = (data) => {
    if (data !== null && data.length !== 0) {
      // get key/text/value as keys for using in dropdown
      const source = data.map((item) => {
        return {
          key: item.id,
          text: item.id + " - " + item.firstname + " " + item.surname,
          value: item.id,
        };
      });
      return source;
    } else return;
  };

  // select only new user // all - existing user for dropdown
  const compareLists = (arrayOne, arrayTwo) => {
    const results = arrayOne.filter(
      ({ value: id1 }) => !arrayTwo.some(({ value: id2 }) => id2 === id1)
    );
    setAllUserDropDown(results);
  };

  // useEffect for API Connection
  useEffect(() => {
    if (useAPI) {
      fetch(APIHost + "/users")
        .then((res) => res.json())
        .then((data) => {
          setAllUser(data);
          const apiuser = transformDropdownData(data);
          if (Object.keys(loadedCons).length !== 0) {
            // get all existing user from kons api
            fetch(APIHost + "/perp/" + loadedCons.id)
              .then((res) => res.json())
              .then((data) => {
                const existinguser = transformPerpDropdownData(data);
                compareLists(apiuser, existinguser);
                const timer = setTimeout(() => {
                  // console.log('This will run after 1 second!')
                  setApiDataLoadedExistingUser(true);
                }, 1000);
                return () => clearTimeout(timer);
              })
              .catch(console.log);
          } else {
            // if no cons loaded, reset dropdown
            setAllUserDropDown([]);
          }
          const timer = setTimeout(() => {
            // console.log('This will run after 1 second!')
            setApiDataLoadedAllUser(true);
          }, 1000);
          return () => clearTimeout(timer);
        })
        .catch(console.log);
    } else {
      // if no api, use json for all and existing user
      const jsonuser = transformDropdownData(allUser_json);
      const jsonexistinguser = TableProjektTeam_JSON.Table_Projekt_Team_Data;
      compareLists(jsonuser, jsonexistinguser);
    }
  }, [loadedCons, needRefreshProjectTeam]);

  // handle addUser dropdown
  const handleDropdownChange = (e) => {
    setDropdownSelected(e.target.value);
  };

  const handleDropdownChangeClick = (e) => {
    setDropdownSelected(e.target.textContent);
  };

  // handle user search button
  const onClickSearchUser = () => {
    if (dropdownSelected && dropdownSelected !== null) {
      getUserData();
    } else {
      setLabelUserSearch("Bitte wählen Sie einen gültigen Nutzer.");
    }
  };

  const getUserData = () => {
    if (
      dropdownSelected !== "" &&
      dropdownSelected !== null &&
      Number.isInteger(Number(dropdownSelected.split(" -")[0]))
    ) {
      setLabelUserSearch();
      const userID = Number(dropdownSelected.split(" -")[0]);
      const sources = [allUser[allUser.findIndex((x) => x.id === userID)]].map(
        (item) => {
          return {
            id: item.id,
            name: item.firstname + " " + item.surname,
            email: item.e_mail,
            organisation: item.orga_name,
            funktion: item.function,
            funktion_id: item.t_function_id,
            orga_id: item.orga_id,
            del_kz: item.del_kz,
          };
        }
      );
      setSelectedUser(sources);
    } else {
      setLabelUserSearch("Bitte wählen Sie einen gültigen Nutzer.");
    }
  };

  // input values new user state
  const handleAddUser = (e) => {
    setSelectedUser([{ ...selectedUser[0], [e.target.id]: e.target.value }]);
  };

  const handleChangeCheck = (e) => {
    setSelectedUser([
      {
        ...selectedUser[0],
        [e.target.name]: e.target.checked,
      },
    ]);
  };

  // reset
  const resetAddUserInputs = () => {
    setLabelUserSearch();
    setSelectedUser([
      {
        id: "",
        name: "",
        funktion: "",
        organisation: "",
        email: "",
        user_read: false,
        user_write: false,
        user_delete: false,
        funktion_id: "",
        orga_id: "",
        del_kz: "",
      },
    ]);
  };

  // Adding selected User to Backend DB
  const transformBoolean = (x) => {
    if (x) {
      return 1;
    } else return 0;
  };

  const handleAddingUser = () => {
    const req = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: selectedUser[0].id,
        orga_id: selectedUser[0].orga_id,
        kons_id: loadedCons.id,
        auth_read: transformBoolean(selectedUser[0].user_read),
        auth_write: transformBoolean(selectedUser[0].user_write),
        auth_delete: transformBoolean(selectedUser[0].user_delete),
        del_kz: selectedUser[0].del_kz,
      }),
    };
    fetch(APIHost + "/perp", req)
      .then((res) => {
        res.json();
      })
      .then((result) => {
        console.log(result);
      });
    const timer = setTimeout(() => {
      // console.log('This will run after 1 second!')
      setNeedRefreshProjectTeam(!needRefreshProjectTeam);
    }, 300);
  };

  // handle closing dialog with ADDING || if invalid values, no closing
  const handleCloseAddUser = () => {
    if (
      (selectedUser[0].name !== "") &
      (selectedUser[0].funktion !== "") &
      (selectedUser[0].organisation !== "") &
      (selectedUser[0].email !== "")
    ) {
      handleAddingUser();
      setOpenAddUser(false);
      resetAddUserInputs();
    } else {
      setLabelUserSearch("Bitte wählen Sie einen gültigen Nutzer.");
    }
  };

  // handle closing withoud ADDING
  const handleCloseAddUserBreak = () => {
    setOpenAddUser(false);
    resetAddUserInputs();
  };

  return (
    <Dialog
      open={openAddUser}
      onClose={handleCloseAddUserBreak}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Hinzufügen</DialogTitle>
      {Object.keys(loadedCons).length === 0 ? (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bitte laden oder erstellen Sie zuvor eine Konstruktion.
          </DialogContentText>
        </DialogContent>
      ) : !apiDataLoadedAllUser && useAPI ? (
        <DialogContent className={classes.progress}>
          <CircularProgress />
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogContentText style={{ color: "black" }}>
            Suchen Sie einen bereits registrierten User.
          </DialogContentText>
          <Dropdown
            search
            selection
            options={allUserDropDown}
            onChange={handleDropdownChangeClick}
            onSearchChange={handleDropdownChange}
          />
          <div>{labelUserSearch}</div>
          <Button
            variant="outlined"
            className={classes.Button}
            onClick={onClickSearchUser}
          >
            Suchen
          </Button>
          <Divider variant="middle" className={classes.Divider} />
          <Grid container>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Name"
                type="name"
                value={selectedUser[0].name || ""}
                onChange={handleAddUser}
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="funktion"
                label="Funktion"
                type="function"
                value={selectedUser[0].funktion || ""}
                onChange={handleAddUser}
                disabled
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="organization"
                label="Organisation"
                type="organization"
                value={selectedUser[0].organisation || ""}
                onChange={handleAddUser}
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="email"
                label="E-Mail"
                type="email"
                value={selectedUser[0].email || ""}
                onChange={handleAddUser}
                disabled
              />
            </Grid>
          </Grid>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend" style={{ color: "black" }}>
              Rechteverwaltung
            </FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedUser[0].user_read || false}
                    onChange={handleChangeCheck}
                    name="user_read"
                  />
                }
                label="Lesen"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedUser[0].user_write || false}
                    onChange={handleChangeCheck}
                    name="user_write"
                  />
                }
                label="Schreiben"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedUser[0].user_delete || false}
                    onChange={handleChangeCheck}
                    name="user_delete"
                  />
                }
                label="Löschen"
              />
            </FormGroup>
          </FormControl>
        </DialogContent>
      )}
      {Object.keys(loadedCons).length === 0 ? (
        <DialogActions>
          <Button
            onClick={handleCloseAddUserBreak}
            variant="outlined"
            style={{ marginLeft: 10 }}
          >
            OK
          </Button>
        </DialogActions>
      ) : (
        <DialogActions>
          <Button
            onClick={handleCloseAddUserBreak}
            variant="outlined"
            style={{ marginLeft: 10 }}
          >
            Abbrechen
          </Button>
          <Button
            onClick={handleCloseAddUser}
            variant="outlined"
            style={{ marginLeft: 10 }}
          >
            Anlegen
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
