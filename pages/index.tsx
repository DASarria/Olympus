import { useEffect } from "react";
import { useRouter } from "next/router";

const Index = () => {
  const router = useRouter();
  const role = "admin_salas";
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwMDAwMDAwIiwidXNlck5hbWUiOiJzYWxhLmFkbWluaXN0cmFkb3IiLCJlbWFpbCI6InNhbGEuYWRtaW5pc3RyYWRvckBlc2N1ZWxhaW5nLmVkdS5jbyIsIm5hbWUiOiJTQUxBX0FETUlOSVNUUkFET1IiLCJyb2xlIjoiU0FMQV9BRE1JTiIsInNwZWNpYWx0eSI6Im51bGwiLCJleHAiOjE3NDc1MzQwOTZ9.NBu0IYjhuv4sdrsA7cA_qGLyuEpLOHnd-cdx37O1REU"

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
