import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/createBlog.css";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) formData.append("image", image);

      await api.post("/blogs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating blog");
    }
  };

  return (
    <div className="create-wrapper">
      <form className="create-box" onSubmit={submitHandler}>
        <h2>Create New Blog ✍️</h2>

        <input
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Write your blog content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        {/* CUSTOM FILE INPUT */}
        <div className="file-upload">
          <label htmlFor="blogImage">Choose Image</label>
          <input
            id="blogImage"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          {image && (
            <span className="file-name">{image.name}</span>
          )}
        </div>

        <button>Create Blog</button>
      </form>
    </div>
  );
}
