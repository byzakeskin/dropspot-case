import { useEffect, useState } from "react";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");

  const fetchProducts = () => {
    fetch("http://localhost:3001/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data.products));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h2>Admin Panel</h2>

      <h3>Products</h3>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} — Stock: {p.stock}
          </li>
        ))}
      </ul>
    </div>
  );
}
