const CardWrapper = ({ url, name }: { url?: string; name?: string }) => {
  return (
    <img
      src={url}
      alt={name}
      style={{
        width: "15rem",
        height: "100%",
      }}
    />
  );
};

export default CardWrapper;
