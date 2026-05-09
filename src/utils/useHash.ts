"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const useHash = () => {
  const params = useParams();
  const [hash, setHash] = useState<string | undefined>();

  useEffect(() => {
    const currentHash = window.location.hash.replace("#", "");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHash(currentHash);
  }, [params]);

  return hash;
};

export default useHash;
