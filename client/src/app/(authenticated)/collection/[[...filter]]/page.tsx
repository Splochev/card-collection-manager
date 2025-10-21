"use client";
import { useParams } from "next/navigation";

const Collection = () => {
  const { filter } = useParams();

  return <div>Collection Page: {filter}</div>;
};

export default Collection;