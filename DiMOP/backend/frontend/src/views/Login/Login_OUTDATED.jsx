import React, { useState, useContext, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Grid } from "@material-ui/core";
import { CircularProgress } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Link from "@material-ui/core/Link";

import { APIContext } from "../../APIContext";
import PartnerLogos from "../../components/PartnerLogos/PartnerLogos";
import NavBar from "../../components/NavBar/NavBar";
import orgas_json from "../../files/old/orgas.json";
import funktion_json from "../../files/old/funktion.json";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    container_navbar: {
        background: "#007F3D",
        marginBottom: 5,
    },
    container_main: {
        marginTop: 5,
        marginBottom: 5,
    },
    container_footer: {
        marginTop: 5,
    },

    // height max-footer-header
    container_main_login: {
        background: "#007F3D",
        height: "calc(100vh - 115px - 100px)",
    },
    container_main_register: {
        background: "#007F3D",
        height: "calc(100vh - 115px - 100px)",
    },
    container_main_headline: {
        height: "calc((100vh - 115px - 100px) / 4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontSize: 25,
    },
    container_main_login_body: {
        height: "calc((100vh - 115px - 100px) / 4 * 3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
    },
    container_main_login_body_content: {
        display: "flex",
        width: "33%",
        marginTop: -40,
    },
    container_main_registration_body: {
        height: "calc((100vh - 115px - 100px) / 4 * 3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    container_main_registration_body_content: {
        display: "flex",
        width: "80%",
        marginTop: -50,
    },
    textfield: {
        "&:hover": {
            border: 0,
        },
        root: {
            "&$focused $notchedOutline": {
                borderColor: "black",
                borderWidth: 1,
            },
            color: "white",
        },
        color: "white",
        width: "100%",
        paddingBottom: 5,
    },
    input: {
        background: "white",
        fontColor: "white",
    },
    text: {
        color: "white",
        textAlign: "left",
        paddingBottom: 5,
    },
    text1: {
        color: "white",
        textAlign: "left",
        paddingBottom: 5,
        fontSize: 13,
    },
    buttons: {
        borderColor: "white",
        color: "white",
        textTransform: "none",
    },
    autocomplete: {
        color: "black",
        "& .MuiOutlinedInput-notchedOutline": {
            border: 0,
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            border: 0,
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: 0,
        },
    },
    textfield1: { margin: 0, padding: 0, background: "white" },
    progress: {
        textAlign: "center",
        justifyContent: "center",
        padding: 5,
    },
}));

export default function Login() {
    // get debugging API variable
    const { use_API, API_Host, API_User } = useContext(APIContext);
    const [useAPI, setUseAPI] = use_API;
    const [APIHost, setAPIHost] = API_Host;
    const [APIUser, setAPIUser] = API_User;

    // other states for get api calling
    const classes = useStyles();
    const [apidataloadedorgas, setapidataloadedorgas] = useState(false);
    const [apidataloadedfunction, setapidataloadedfunction] = useState(false);

    const [orgaDataSource, setOrgaDataSource] = useState([]);
    const [funktionDataSource, setFunktionDataSource] = useState([]);

    const [forgotPasswordMail, setForgotPasswordMail] = useState("");
    const [forgotPassword, setForgotPassword] = useState(false);

    // get/set login inputs in loginInput State
    const [loginInput, setLoginInput] = useState({
        Username: "",
        Passwort: "",
        LoginButton: false,
    });

    const onLoginInput = (e) => {
        setLoginInput({ ...loginInput, [e.target.id]: e.target.value });
    };

    const onLoginButton = () => {
        setLoginInput({ ...loginInput, LoginButton: !loginInput.LoginButton });
    };

    // get/set register inputs in registerInput dict state
    const [registerInput, setRegisterInput] = useState({
        Vorname: "",
        Nachname: "",
        Organisation: "",
        Funktion: "",
        Email: "",
        Passwort: "",
        PasswortConfirm: "",
    });

    // triggered by typing input values in textfields
    const onRegisterInput = (e) => {
        setRegisterInput({ ...registerInput, [e.target.id]: e.target.value });
    };

    // get Values from dropdown inputs / set register input at organisation or function
    const handleDropdownInputs = (e) => {
        if (e.target.value === "" || e.target.value === 0) {
            const filter = e.target.id.split("-")[0];
            setRegisterInput({
                ...registerInput,
                [filter]: e.target.textContent,
            });
        } else {
            const filter = e.target.id.split("-")[0];
            setRegisterInput({ ...registerInput, [filter]: e.target.value });
        }
    };

    const [userRegistered, setUserRegistered] = useState(false);
    const [wrongInputs, setWrongInputs] = useState(false);

    // click register button -> POST Api Call
    const onRegisterButton = () => {
        if (
            registerInput.Vorname !== null &&
            registerInput.Nachname !== null &&
            registerInput.Organisation !== null &&
            registerInput.Funktion !== null &&
            registerInput.Email !== null &&
            registerInput.Passwort !== null &&
            registerInput.PasswortConfirm !== null &&
            registerInput.Vorname !== "" &&
            registerInput.Nachname !== "" &&
            registerInput.Organisation !== "" &&
            registerInput.Funktion !== "" &&
            registerInput.Email !== "" &&
            registerInput.Passwort !== "" &&
            registerInput.PasswortConfirm !== "" &&
            registerInput.Passwort === registerInput.PasswortConfirm
        ) {
            setWrongInputs(false);
            setUserRegistered(false);
            registerUser();
        } else {
            setWrongInputs(true);
            setUserRegistered(false);
        }
    };

    const registerUser = () => {
        const req = {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                firstname: registerInput.Vorname,
                surname: registerInput.Nachname,
                e_mail: registerInput.Email,
                orga_id: registerInput["Organisation"].split(" - ")[0],
                t_function_id: registerInput["Funktion"].split(" - ")[0],
                del_kz: 1,
                password: registerInput.Passwort,
            }),
        };
        if (useAPI) {
            fetch(APIHost + "/user", req)
                .then((res) => {
                    res.json();
                    setUserRegistered(true);
                    setRegisterInput({
                        Vorname: "",
                        Nachname: "",
                        Organisation: "",
                        Funktion: "",
                        Email: "",
                        Passwort: "",
                        PasswortConfirm: "",
                    });
                })
                .then((result) => {
                    console.log(result);
                });
            const timer = setTimeout(() => {
                // console.log('This will run after 1 second!')
            }, 300);
        } else {
            setUserRegistered(true);
        }
    };

    // get ORGA  dropdown options
    const getColNamesOptionsOrga = () => {
        const options = orgaDataSource
            .filter((option) => option.id !== null)
            .map((option) =>
                String(
                    option.id +
                        " - " +
                        option.orga_nr +
                        " - " +
                        option.orga_name
                )
            );
        return options;
    };

    // get FUNKTION  dropdown options
    const getColNamesOptionsFunktion = () => {
        const options = funktionDataSource
            .filter((option) => option.id !== null)
            .map((option) => String(option.id + " - " + option.function));
        return options;
    };

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
            console.log("orga json");
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
            console.log("funktion json");

            setFunktionDataSource(funktion_json);
            setapidataloadedfunction(true);
        }
    }, []);

    const handleForgotPasswordInput = (event) => {
        setForgotPasswordMail(event.target.value);
    };
    const onResetPassword = () => {
        console.log(forgotPasswordMail);
        console.log("RESET!");
        setForgotPasswordMail("");
    };

    return (
        <div>
            <Grid container>
                <Grid item xs={12} className={classes.container_navbar}>
                    <NavBar></NavBar>
                </Grid>
                <Grid item xs={12} className={classes.container_main}>
                    <Grid container>
                        <Grid
                            item
                            xs={6}
                            style={{
                                paddingRight: 5,
                            }}
                        >
                            <Grid
                                container
                                className={classes.container_main_login}
                            >
                                <Grid item xs={12}>
                                    <div
                                        className={
                                            classes.container_main_headline
                                        }
                                    >
                                        Anmeldung
                                    </div>

                                    <div
                                        className={
                                            classes.container_main_login_body
                                        }
                                    >
                                        <Grid
                                            container
                                            className={
                                                classes.container_main_login_body_content
                                            }
                                        >
                                            <Grid item xs={12}>
                                                <div className={classes.text}>
                                                    E-Mail*
                                                </div>
                                            </Grid>
                                            <TextField
                                                required
                                                id="Username"
                                                label=""
                                                defaultValue=""
                                                onChange={onLoginInput}
                                                className={classes.textfield}
                                                InputProps={{
                                                    className: classes.input,
                                                }}
                                            />
                                            <Grid item xs={12}>
                                                <div className={classes.text}>
                                                    Passwort*
                                                </div>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    required
                                                    id="Passwort"
                                                    label=""
                                                    defaultValue=""
                                                    className={
                                                        classes.textfield
                                                    }
                                                    onChange={onLoginInput}
                                                    InputProps={{
                                                        className:
                                                            classes.input,
                                                    }}
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                xs={12}
                                                style={{ paddingTop: 10 }}
                                            >
                                                <Button
                                                    variant="outlined"
                                                    className={classes.buttons}
                                                    onClick={onLoginButton}
                                                >
                                                    Anmelden
                                                </Button>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={12}
                                                className={classes.text}
                                                style={{
                                                    textAlign: "center",
                                                    paddingTop: 5,
                                                }}
                                            >
                                                <Link
                                                    component="button"
                                                    variant="body2"
                                                    color="inherit"
                                                    onClick={() => {
                                                        setForgotPassword(
                                                            !forgotPassword
                                                        );
                                                        console.info(
                                                            "Vergessen"
                                                        );
                                                    }}
                                                >
                                                    Passwort vergessen?
                                                </Link>
                                            </Grid>
                                            {loginInput.LoginButton ? (
                                                <div>
                                                    Hello i am{" "}
                                                    {loginInput.Username} and my
                                                    password is
                                                    {loginInput.Passwort}
                                                </div>
                                            ) : (
                                                <div />
                                            )}
                                            {forgotPassword ? (
                                                <div>
                                                    <p />
                                                    <Grid item xs={12}>
                                                        <div
                                                            className={
                                                                classes.text1
                                                            }
                                                        >
                                                            Bitte geben Sie ihre
                                                            gültige E-Mail ein.
                                                        </div>
                                                    </Grid>
                                                    <TextField
                                                        required
                                                        id="forgotPasswordMail"
                                                        className={
                                                            classes.textfield
                                                        }
                                                        onChange={
                                                            handleForgotPasswordInput
                                                        }
                                                        InputProps={{
                                                            className:
                                                                classes.input,
                                                        }}
                                                        value={
                                                            forgotPasswordMail
                                                        }
                                                    />
                                                    <Button
                                                        variant="outlined"
                                                        className={
                                                            classes.buttons
                                                        }
                                                        onClick={
                                                            onResetPassword
                                                        }
                                                    >
                                                        Passwort zurücksetzen
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div />
                                            )}
                                        </Grid>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={6} style={{ paddingLeft: 5 }}>
                            <Grid
                                container
                                className={classes.container_main_register}
                            >
                                <Grid item xs={12}>
                                    <div
                                        className={
                                            classes.container_main_headline
                                        }
                                    >
                                        Registrierung
                                    </div>
                                    {useAPI &&
                                    (!apidataloadedorgas ||
                                        !apidataloadedfunction) ? (
                                        <div className={classes.progress}>
                                            <CircularProgress
                                                className={classes.progress}
                                            />
                                            <br />
                                        </div>
                                    ) : (
                                        <div
                                            className={
                                                classes.container_main_registration_body
                                            }
                                        >
                                            <Grid
                                                container
                                                className={
                                                    classes.container_main_registration_body_content
                                                }
                                            >
                                                <Grid item xs={6}>
                                                    <Grid
                                                        container
                                                        style={{
                                                            paddingRight: 20,
                                                        }}
                                                    >
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            className={
                                                                classes.text
                                                            }
                                                        >
                                                            Vorname*
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <TextField
                                                                required
                                                                id="Vorname"
                                                                label=""
                                                                value={
                                                                    registerInput.Vorname
                                                                }
                                                                onChange={
                                                                    onRegisterInput
                                                                }
                                                                className={
                                                                    classes.textfield
                                                                }
                                                                InputProps={{
                                                                    className:
                                                                        classes.input,
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            className={
                                                                classes.text
                                                            }
                                                        >
                                                            Nachname*
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <TextField
                                                                required
                                                                id="Nachname"
                                                                label=""
                                                                onChange={
                                                                    onRegisterInput
                                                                }
                                                                className={
                                                                    classes.textfield
                                                                }
                                                                value={
                                                                    registerInput.Nachname
                                                                }
                                                                InputProps={{
                                                                    className:
                                                                        classes.input,
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            className={
                                                                classes.text
                                                            }
                                                        >
                                                            Organisation*
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Autocomplete
                                                                disableClearable
                                                                value={
                                                                    registerInput.Organisation
                                                                }
                                                                onChange={
                                                                    handleDropdownInputs
                                                                }
                                                                id="Organisation"
                                                                size="small"
                                                                className={
                                                                    classes.autocomplete
                                                                }
                                                                options={getColNamesOptionsOrga()}
                                                                renderInput={(
                                                                    params
                                                                ) => (
                                                                    <TextField
                                                                        {...params}
                                                                        value={
                                                                            registerInput.Organisation
                                                                        }
                                                                        placeholder="Organisation"
                                                                        margin="dense"
                                                                        variant="outlined"
                                                                        className={
                                                                            classes.textfield1
                                                                        }
                                                                    />
                                                                )}
                                                            />
                                                        </Grid>
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            className={
                                                                classes.text
                                                            }
                                                        >
                                                            Funktion*
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Autocomplete
                                                                disableClearable
                                                                value={
                                                                    registerInput.Funktion
                                                                }
                                                                onChange={
                                                                    handleDropdownInputs
                                                                }
                                                                id="Funktion"
                                                                size="small"
                                                                className={
                                                                    classes.autocomplete
                                                                }
                                                                options={getColNamesOptionsFunktion()}
                                                                renderInput={(
                                                                    params
                                                                ) => (
                                                                    <TextField
                                                                        {...params}
                                                                        value={
                                                                            registerInput.Funktion
                                                                        }
                                                                        placeholder="Funktion"
                                                                        margin="dense"
                                                                        variant="outlined"
                                                                        className={
                                                                            classes.textfield1
                                                                        }
                                                                    />
                                                                )}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Grid
                                                        container
                                                        style={{
                                                            paddingLeft: 20,
                                                        }}
                                                    >
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            className={
                                                                classes.text
                                                            }
                                                        >
                                                            E-Mail*
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <TextField
                                                                required
                                                                id="Email"
                                                                label=""
                                                                value={
                                                                    registerInput.Email
                                                                }
                                                                onChange={
                                                                    onRegisterInput
                                                                }
                                                                className={
                                                                    classes.textfield
                                                                }
                                                                InputProps={{
                                                                    className:
                                                                        classes.input,
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            className={
                                                                classes.text
                                                            }
                                                        >
                                                            Passwort*
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <TextField
                                                                required
                                                                id="Passwort"
                                                                label=""
                                                                value={
                                                                    registerInput.Passwort
                                                                }
                                                                onChange={
                                                                    onRegisterInput
                                                                }
                                                                className={
                                                                    classes.textfield
                                                                }
                                                                InputProps={{
                                                                    className:
                                                                        classes.input,
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            className={
                                                                classes.text
                                                            }
                                                        >
                                                            Passwort
                                                            (Bestätigung)*
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <TextField
                                                                required
                                                                id="PasswortConfirm"
                                                                label=""
                                                                value={
                                                                    registerInput.PasswortConfirm
                                                                }
                                                                onChange={
                                                                    onRegisterInput
                                                                }
                                                                className={
                                                                    classes.textfield
                                                                }
                                                                InputProps={{
                                                                    className:
                                                                        classes.input,
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            style={{
                                                                paddingTop: 10,
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        >
                                                            <Button
                                                                variant="outlined"
                                                                className={
                                                                    classes.buttons
                                                                }
                                                                onClick={
                                                                    onRegisterButton
                                                                }
                                                            >
                                                                Registrieren
                                                            </Button>
                                                        </Grid>
                                                        {userRegistered ? (
                                                            <p>
                                                                {" "}
                                                                Neuer User
                                                                angelegt.{" "}
                                                            </p>
                                                        ) : wrongInputs ? (
                                                            <p>
                                                                {" "}
                                                                Bitte überprüfen
                                                                Sie ihre
                                                                Eingaben.{" "}
                                                            </p>
                                                        ) : (
                                                            <div />
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </div>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} className={classes.container_footer}>
                    <PartnerLogos />
                </Grid>
            </Grid>
        </div>
    );
}
