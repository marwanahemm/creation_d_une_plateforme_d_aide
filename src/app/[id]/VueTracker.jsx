"use client";

import { useEffect } from "react";

export default function VueTracker({ id }) {
  useEffect(() => {
    fetch(`/api/tutoriels/${id}/vues`, { method: "POST" })
      .catch(() => {});
  }, [id]);

  return null;
}