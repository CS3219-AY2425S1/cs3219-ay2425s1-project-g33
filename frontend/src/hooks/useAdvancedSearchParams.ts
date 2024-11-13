"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const useAdvancedSearchParams = () => {
  const searchParams = useSearchParams();
  const [params, setParams] = useState(
    () => new URLSearchParams(searchParams.toString())
  );
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    setParams(new URLSearchParams(searchParams.toString()));
  }, [searchParams]);

  const updateSearchParams = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(params);

    if (value === null) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }

    replace(`${pathname}?${newParams.toString()}`);
    setParams(newParams);
  };

  return {
    get: (key: string) => params.get(key),
    getAll: () => params,
    set: updateSearchParams,
    delete: (key: string) => updateSearchParams(key, null),
    has: (key: string) => params.has(key),
  };
};

export default useAdvancedSearchParams;
