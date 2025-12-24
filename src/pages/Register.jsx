import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";
// netlify-fix

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      await api.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-wrapper">
      <form className="register-box" onSubmit={submitHandler}>
        <h2>Create Account 🚀</h2>

        <input
          placeholder="Full Name"
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* CUSTOM PROFILE IMAGE UPLOAD */}
        <div className="file-upload">
          <label htmlFor="profileImage">Choose Profile Image</label>
          <input
            id="profileImage"
            type="file"
            accept="image/*"
            onChange={(e) => setProfileImage(e.target.files[0])}
          />

          {profileImage && (
            <span className="file-name">{profileImage.name}</span>
          )}
        </div>

        <button>Register</button>
      </form>
    </div>
  );
}
