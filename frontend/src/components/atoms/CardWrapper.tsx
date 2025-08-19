const CardWrapper = ({ url, name }: { url?: string; name?: string }) => {
  return (
    <img
      src={url}
      alt={name}
      style={{
        width: "25rem",
        height: "auto",
        borderRadius: 6,
      }}
    />
  );
};

export default CardWrapper;
