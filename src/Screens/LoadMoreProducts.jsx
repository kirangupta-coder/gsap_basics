import React, { useEffect, useState } from "react";

const LoadMoreProducts = () => {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState([]);
  const [count, setCount] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const resp = await fetch(
        `https://dummyjson.com/products?limit=10&skip=${
          count === 0 ? 0 : count * 20
        }`
      );
      const respJSON = await resp.json();

      console.log(respJSON.products);

      if (respJSON.products) {
        setProduct(respJSON.products);
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [count]);

  return loading ? (
    <h1>Loading...</h1>
  ) : (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {product.map((item, index) => (
          <div
            key={index}
            className="col-span-1 border rounded-lg shadow-md overflow-hidden"
          >
            <img src={item.thumbnail} alt="product" />
            <h6>{item.title}</h6>
          </div>
        ))}
      </div>
      <button
        onClick={() => setCount(count + 1)}
        disabled={count == 5}
        className={`${count == 5 ? "bg-gray-50" : "bg-black"}`}
      >
        Load More Products
      </button>
    </>
  );
};

export default LoadMoreProducts;
