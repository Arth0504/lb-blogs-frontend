import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import "../styles/profile.css";

export default function Profile() {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [newPhoto, setNewPhoto] = useState(null);

  useEffect(() => {
    api.get("/auth/profile").then((res) => {
      setUser(res.data);
    });

    api.get("/blogs").then((res) => {
      setBlogs(res.data);
    });
  }, []);

  if (!user) return null;

  const myBlogs = blogs.filter(
    (b) => b.author?._id === user._id
  );

  const deleteHandler = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    await api.delete(`/blogs/${id}`);
    setBlogs(blogs.filter((b) => b._id !== id));
  };

  const updatePhotoHandler = async (e) => {
    e.preventDefault();
    if (!newPhoto) return;

    const formData = new FormData();
    formData.append("profileImage", newPhoto);

    const res = await api.put(
      "/auth/update-photo",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    setUser({ ...user, profileImage: res.data.profileImage });
    setNewPhoto(null);
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        {/* HEADER */}
        <div className="profile-header">
          {user.profileImage ? (
            <img
              src={`http://localhost:5000/${user.profileImage}`}
              className="profile-avatar"
              alt="profile"
            />
          ) : (
            <div className="profile-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="profile-info">
            <h2>{user.name}</h2>
            <p>Total Blogs: {myBlogs.length}</p>

            {/* CHANGE PHOTO */}
            <form onSubmit={updatePhotoHandler}>
              <div className="file-upload">
                <label htmlFor="profileImage">Choose Photo</label>
                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewPhoto(e.target.files[0])}
                />

                {newPhoto && (
                  <span className="file-name">
                    {newPhoto.name}
                  </span>
                )}
              </div>

              <button type="submit">Change Photo</button>
            </form>
          </div>
        </div>

        {/* BLOGS */}
        <div className="myblogs-grid">
          {myBlogs.map((b) => (
            <div key={b._id} className="myblog-card">
              <h4>{b.title}</h4>
              <p>{b.content.substring(0, 80)}...</p>

              <div className="blog-actions">
                <Link to={`/blog/${b._id}`}>View</Link>
                <Link to={`/edit/${b._id}`}>Edit</Link>
                <button onClick={() => deleteHandler(b._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {myBlogs.length === 0 && (
          <p>No blogs created yet.</p>
        )}
      </div>
    </div>
  );
}
