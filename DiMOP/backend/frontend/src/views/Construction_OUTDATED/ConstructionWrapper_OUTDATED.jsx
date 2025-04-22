import React from "react";

import { ConstructionProvider } from "./ConstructionContext_OUTDATED";
import Construction from "./Construction_OUTDATED";

// import provider for wrapping and state management in construction Info
function ConstructionWrapper() {
  return (
    <ConstructionProvider>
      <div>
        <Construction></Construction>
      </div>
    </ConstructionProvider>
  );
}

export default ConstructionWrapper;
