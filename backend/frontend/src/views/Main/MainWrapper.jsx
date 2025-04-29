
// Import react components
import React from "react";

//Import main components
import { MainProvider } from "./MainContext";
import Main from "./Main";

// Import provider for wrapping and state management in construction info
function MainWrapper() {
  return (
    <MainProvider>
      <div>
        <Main></Main>
      </div>
    </MainProvider>
  );
}

export default MainWrapper;