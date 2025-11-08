import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [stock, setStock] = useState(0);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchProducts = () => {
    fetch("http://localhost:3001/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          navigate("/login");
        }
        return res.json();
      })
      .then((data) => setProducts(data.products));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();

    fetch("http://localhost:3001/products", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, stock }),
    })
      .then((res) => res.json())
      .then(() => {
        fetchProducts();
        setName("");
        setStock(0);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h2>Admin Panel</h2>

      <h3>Add Product</h3>
      <form onSubmit={handleAddProduct}>
        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /><br /><br />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
        /><br /><br />

        <button type="submit">Add Product</button>
      </form>

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
