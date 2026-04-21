import { useState, useCallback } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { LoadingScreen } from "./components/LoadingScreen";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  const [loading, setLoading] = useState(true);

  const handleFinish = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <AuthProvider>
      {loading && <LoadingScreen onFinish={handleFinish} />}
      <div
        className={`transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"}`}
      >
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  );
}
