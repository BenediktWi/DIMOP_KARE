import React, { useContext } from "react";
import Button from "@material-ui/core/Button";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { ConstructionContext } from "../../views/Construction/ConstructionContext";
import TableProjektTeam from "./Table_ProjektTeam_OUTDATED";
import TableProjektInfo from "./Table_ProjektInfo_OUTDATED";
import DeleteUser from "./DeleteUser_OUTDATED";
import EditUser from "./EditUser_OUTDATED";
import AddUser from "./AddUser";
import DeleteAlternative from "./DeleteAlternative_OUTDATED";
import EditAlternative from "./EditAlternative_OUTDATED";
import AddAlternative from "./AddAlternative";

// css theme
const useStyles = makeStyles((theme) => ({
  headline: {
    textAlign: "left",
    fontSize: 20,
    paddingBottom: 15,
  },
  container_main: {
    padding: 20,
    minheight: "calc(100vh - 115px - 100px)",
  },
  buttonbox: {
    textAlign: "right",
    paddingTop: 15,
    paddingBottom: 15,
  },
  buttons: {
    borderColor: "#005000",
    color: "#005000",
    textTransform: "none",
    marginLeft: 20,
  },
}));

export default function ConstructionInfo() {
  const classes = useStyles();

  // get managed states from context
  const {
    open_delete_user,
    open_add_user,
    open_edit_user,
    edited_user,
    selected_user,

    open_delete_alternative,
    open_add_alternative,
    open_edit_alternative,
    edited_alternative,
    selected_alternative,
  } = useContext(ConstructionContext);

  const [openDeleteUser, setOpenDeleteUser] = open_delete_user;
  const [openAddUser, setOpenAddUser] = open_add_user;
  const [openEditUser, setOpenEditUser] = open_edit_user;
  const [editedUser, setEditedUser] = edited_user;
  const [selectedUser, setSelectedUser] = selected_user;

  const [
    openDeleteAlternative,
    setOpenDeleteAlternative,
  ] = open_delete_alternative;
  const [openAddAlternative, setOpenAddAlternative] = open_add_alternative;
  const [openEditAlternative, setOpenEditAlternative] = open_edit_alternative;
  const [editedAlternative, setEditedAlternative] = edited_alternative;
  const [selectedAlternative, setSelectedAlternative] = selected_alternative;

  // handle open dialogs for project team|| edit dialog takes default values from selected
  const handleClickOpenDeleteUser = () => {
    setOpenDeleteUser(true);
  };

  const handleClickOpenAddUser = () => {
    setOpenAddUser(true);
  };

  const handleClickOpenEditUser = () => {
    resetEditUserInput();
    setEditedUser(selectedUser[0]);
    setOpenEditUser(true);
  };

  const resetEditUserInput = () => {
    setEditedUser({});
  };

  // handle open dialogs for project info || edit dialog takes default values from selected
  const handleClickOpenDeleteAlternative = () => {
    setOpenDeleteAlternative(true);
  };

  const handleClickOpenAddAlternative = () => {
    setOpenAddAlternative(true);
  };

  const handleClickOpenEditAlternative = () => {
    resetEditAlternativeInput();
    setEditedAlternative(selectedAlternative[0]);
    setOpenEditAlternative(true);
  };

  const resetEditAlternativeInput = () => {
    setEditedAlternative({});
  };

  // html structure for info page with dialogs
  return (
    <div className={classes.container_main}>
      <Grid container>
        <Grid item xs={12} className={classes.headline}>
          Projektteam
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <TableProjektTeam></TableProjektTeam>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <div className={classes.buttonbox}>
            <Button
              variant="outlined"
              className={classes.buttons}
              onClick={handleClickOpenDeleteUser}
            >
              Löschen
            </Button>
            <Button
              variant="outlined"
              className={classes.buttons}
              onClick={handleClickOpenEditUser}
            >
              Bearbeiten
            </Button>
            <Button
              variant="outlined"
              className={classes.buttons}
              onClick={handleClickOpenAddUser}
            >
              Hinzufügen
            </Button>
          </div>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <TableProjektInfo></TableProjektInfo>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <div className={classes.buttonbox}>
            <Button variant="outlined" className={classes.buttons}>
              Duplizieren*
            </Button>
            <Button
              variant="outlined"
              className={classes.buttons}
              onClick={handleClickOpenDeleteAlternative}
            >
              Löschen
            </Button>
            <Button
              variant="outlined"
              className={classes.buttons}
              onClick={handleClickOpenEditAlternative}
            >
              Bearbeiten
            </Button>
            <Button
              variant="outlined"
              className={classes.buttons}
              onClick={handleClickOpenAddAlternative}
            >
              Hinzufügen
            </Button>
          </div>
        </Grid>
      </Grid>
      <DeleteUser />
      <EditUser />
      <AddUser />
      <DeleteAlternative />
      <EditAlternative />
      <AddAlternative />
    </div>
  );
}
