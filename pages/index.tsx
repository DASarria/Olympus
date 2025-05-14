import { useEffect } from "react";
import { useRouter } from "next/router";

const Index = () => {
  const router = useRouter();
  const role = "admin_salas";
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwMDAwMDAwIiwidXNlck5hbWUiOiJzYWxhLmFkbWluaXN0cmFkb3IiLCJlbWFpbCI6InNhbGEuYWRtaW5pc3RyYWRvckBlc2N1ZWxhaW5nLmVkdS5jbyIsIm5hbWUiOiJTQUxBX0FETUlOSVNUUkFET1IiLCJyb2xlIjoiU2FsYV9BZG1pbmlzdHJhdG9yIiwic3BlY2lhbHR5IjoibnVsbCIsImV4cCI6MTc0NzE5NzA4MX0.5Lzp0k83Jp4SDyRQIPmwdO8c6fU5o36fHZNLqvA4GpA"

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("token", token);
    }
  }, []);

  const handleLogin = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("role", role);
    }
    router.push("/Dashboard");
  };

  return (
    <div>
      <button className="border-1 rounded" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};

export default Index;
