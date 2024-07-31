import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import { AuthContextProvider } from "./AuthContext";
import RegisterPage from "./pages/register";

const router = createBrowserRouter([
  {
    path: import.meta.env.BASE_URL,
    element: <Outlet />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
    ],
  }
]);

function App () {
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  )
}

export default App
