import ProductCard from "./ProductCard";

const ProductList = ({ products = [], onClick }) => {
  return (
    <div className="grid grid-cols-2    gap-5 mx-2 md:grid-cols-4">
      {products.map((item) =>
       (
        <ProductCard
          key={item._id}
          product={item}
          onClick={() => onClick?.(item._id)}
        />
      ))}
    </div>
  );
};

export default   ProductList;
