"use client";

import { useEffect, useState } from "react";

export default function Loader() {
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setDone(true);
      setHidden(true);
      const t2 = setTimeout(() => setRemoved(true), 1100);
      return () => clearTimeout(t2);
    }, 1200);
    return () => clearTimeout(t1);
  }, []);

  if (removed) return null;

  return (
    <>
      <div className={`loader${done ? " done" : ""}`}>
        <div className="loader-half" />
        <div className="loader-half" />
      </div>
      <div className={`loader-center${hidden ? " hide" : ""}`}>
        <div className="loader-logo">
          <span>S</span>
          <span>&amp;</span>
          <span>N</span>
        </div>
      </div>
    </>
  );
}
