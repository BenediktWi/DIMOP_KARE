import React, { createContext, useState } from "react";

// export context for state management
export const APIContext = createContext();

// provider with managed states || add new states
// SET USE API = TRUE IF NO DEBUGGING
export const APIProvider = (props) => {
    // use api or local json?
    const [use_API, setUseAPI] = useState(false);
    // set api host
    const [API_Host, setAPIHost] = useState("http://localhost:5000");
    // set user_id for initial access
    const [API_User, setAPIUser] = useState(5);

    return (
        <APIContext.Provider
            value={{
                use_API: [use_API, setUseAPI],
                API_Host: [API_Host, setAPIHost],
                API_User: [API_User, setAPIUser],
            }}
        >
            {props.children}
        </APIContext.Provider>
    );
};
