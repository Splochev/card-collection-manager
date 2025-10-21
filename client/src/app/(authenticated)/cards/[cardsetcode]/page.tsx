"use client";
import { useParams } from "next/navigation";

const Card = () => {
  const { cardsetcode } = useParams();

  return <div>Card Set Page: {cardsetcode}</div>;
};

export default Card;