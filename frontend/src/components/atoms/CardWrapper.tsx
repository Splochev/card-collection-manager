const CardWrapper = ({ url, name, width = '25rem'}: { url?: string; name?: string, width?: string }) => {
  return (
    <img
      src={url}
      alt={name}
      style={{
        maxWidth: width,
        height: "auto",
        borderRadius: 12,
      }}
    />
  );
};

export default CardWrapper;
