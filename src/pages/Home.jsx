import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    api.get("/blogs").then((res) => setBlogs(res.data));
  }, []);

  return (
    <div className="container">
      <h1>Latest Blogs</h1>

      <div className="blog-grid">
        {blogs.map((b) => (
          <div key={b._id} className="card">
            {b.image && (
              <img
                src={`http://localhost:5000/${b.image}`}
                alt={b.title}
                className="blog-img"
              />
            )}

            <div className="card-content">
              <h3>{b.title}</h3>
              <p>{b.content.substring(0, 90)}...</p>
              <Link to={`/blog/${b._id}`}>Read More →</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
