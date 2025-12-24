import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import "../styles/editBlog.css";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
// netlify-fix

  useEffect(() => {
    api.get(`/blogs/${id}`).then((res) => {
      setTitle(res.data.title);
      setContent(res.data.content);
    });
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    await api.put(`/blogs/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    navigate(`/blog/${id}`);
  };

  return (
    <div className="edit-wrapper">
      <form className="edit-box" onSubmit={submitHandler}>
        <h2>Edit Blog ✏️</h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button>Update Blog</button>
      </form>
    </div>
  );
}
