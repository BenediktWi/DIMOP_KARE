import { useEffect, useState } from "react";

import React from "react";

const useWindowSize = () => {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
};

export const TriangleSpacer = (props) => {
  const variant = props.variant || "bottom";
  const color = props.backgroundColor || "white";
  const height = props.height || 64;
  const width = props.width || Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

  const size = useWindowSize();

  useEffect(() => {
    console.log(document.documentElement.clientWidth);
  }, [document.documentElement.clientWidth]);

  return (
    <div>
      {variant == "bottomLeft" ? (
        <div
          style={{
            width: 0,
            height: 0,
            borderStyle: "solid",
            borderWidth: `${size.height / 16}px ${size.width}px 0 0`,
            borderColor: `${color} transparent transparent transparent`,
          }}
        />
      ) : variant == "topRight" ? (
        <div
          style={{
            width: 0,
            height: 0,
            borderStyle: "solid",
            borderWidth: `0 0 ${size.height / 16}px ${size.width}px`,
            borderColor: `transparent transparent ${color} transparent`,
          }}
        />
      ) : variant == "bottomRight" ? (
        <div
          style={{
            width: 0,
            height: 0,
            borderStyle: "solid",
            borderWidth: `0 ${size.width}px ${size.height / 16}px 0`,
            borderColor: `transparent ${color} transparent transparent`,
          }}
        />
      ) : variant == "topLeft" ? (
        <div
          style={{
            width: 0,
            height: 0,
            borderStyle: "solid",
            borderWidth: `${size.height / 16}px 0 0 ${size.width}px`,
            borderColor: `transparent transparent transparent ${color}`,
          }}
        />
      ) : (
        ""
      )}
    </div>
  );
};
