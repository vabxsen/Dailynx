import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
      }}
    >
      <div
        style={{
          background: "#1e293b",
          padding: "40px",
          borderRadius: "12px",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "white", marginBottom: "20px" }}>
          🚀 LifeOS
        </h1>

        <button
          onClick={login}
          style={{
            padding: "12px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}