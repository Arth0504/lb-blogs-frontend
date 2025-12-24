import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState("");
  const token = localStorage.getItem("token");

  // 🔐 token se user id
  const getUserId = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id;
    } catch {
      return null;
    }
  };

  const userId = getUserId();

  const fetchBlog = async () => {
    const res = await api.get(`/blogs/${id}`);
    setBlog(res.data);
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const likeHandler = async () => {
    await api.put(`/blogs/${id}/like`);
    fetchBlog();
  };

  const commentHandler = async (e) => {
    e.preventDefault();
    if (!comment) return;

    await api.post(`/blogs/${id}/comment`, { text: comment });
    setComment("");
    fetchBlog();
  };

  const deleteHandler = async () => {
    if (!window.confirm("Delete this blog?")) return;
    await api.delete(`/blogs/${id}`);
    navigate("/");
  };

  const editHandler = () => {
    navigate(`/edit/${id}`);
  };

  if (!blog) return <p>Loading...</p>;

  const isAuthor = userId && blog.author?._id === userId;
  const isLiked = userId && blog.likes.includes(userId);

  return (
    <div style={{ padding: "30px" }}>
      {blog.image && (
        <img
          src={`http://localhost:5000/${blog.image}`}
          alt={blog.title}
          style={imgStyle}
        />
      )}

      <h2>{blog.title}</h2>
      <p>{blog.content}</p>

      {/* AUTHOR */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {blog.author?.profileImage && (
          <img
            src={`http://localhost:5000/${blog.author.profileImage}`}
            alt="author"
            style={profileImg}
          />
        )}
        <b>{blog.author?.name}</b>
      </div>

      {/* ✏️ EDIT / DELETE */}
      {isAuthor && (
        <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
          <button style={btnStyle} onClick={editHandler}>✏️ Edit</button>
          <button
            style={{ ...btnStyle, background: "#333" }}
            onClick={deleteHandler}
          >
            🗑️ Delete
          </button>
        </div>
      )}

      {/* ❤️ LIKE STATUS */}
      {token && (
        <button onClick={likeHandler} style={btnStyle}>
          {isLiked ? "❤️ Liked" : "🤍 Like"} ({blog.likes.length})
        </button>
      )}

      <hr />

      {/* 💬 COMMENTS */}
      <h3>Comments</h3>
      {blog.comments.length === 0 && <p>No comments yet</p>}

      {blog.comments.map((c, i) => (
        <div key={i} style={commentBox}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {c.user?.profileImage && (
              <img
                src={`http://localhost:5000/${c.user.profileImage}`}
                alt="user"
                style={commentImg}
              />
            )}
            <b>{c.user?.name}</b>
          </div>
          <p>{c.text}</p>
        </div>
      ))}

      {/* ➕ ADD COMMENT */}
      {token && (
        <form onSubmit={commentHandler}>
          <input
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
          <button style={btnStyle}>Comment</button>
        </form>
      )}
    </div>
  );
}

const imgStyle = {
  width: "100%",
  maxHeight: "300px",
  objectFit: "cover",
  marginBottom: "15px",
};

const profileImg = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
};

const btnStyle = {
  marginTop: "10px",
  padding: "6px 12px",
  background: "#ff6666",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};

const commentBox = {
  borderBottom: "1px solid #ddd",
  marginBottom: "10px",
  paddingBottom: "5px",
};

const commentImg = {
  width: "30px",
  height: "30px",
  borderRadius: "50%",
};
