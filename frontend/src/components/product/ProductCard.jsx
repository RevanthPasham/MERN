const ProductCard = ({ product, onClick }) => {
  return (
    <div onClick={onClick} className="cursor-pointer">
      <img
        src={product.url}
        className="w-full h-[200px] rounded-xl"
        alt={product.name}
      />

      
      <p>{product.name}</p>
      <p>{product.price?.[0]}</p>
    </div>
  );
};

export default ProductCard;
