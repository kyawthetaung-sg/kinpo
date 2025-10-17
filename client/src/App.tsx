import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import AdminMain from "./layouts/admin/Main";
import Main from "./layouts/user/Main";
import Error from "./pages/Error";
import {
  Home,
  Login,
} from "./pages/user";
import {
  AdminLogin,
  Dashboard,
  RoleDetail,
  RoleForm,
  RoleList,
  UserDetail,
  UserForm,
  UserList,
  CategoryDetail,
  CategoryForm,
  CategoryList,
  GameDetail,
  GameForm,
  GameList,
} from "./pages/admin";
import { LoadingProvider } from "./contexts/LoadingContext";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Main />,
      errorElement: <Error />,
      children: [
        { index: true, element: <Home /> },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/admin/login",
      element: <AdminLogin />,
    },
    {
      path: "/admin",
      element: (
        <LoadingProvider>
          <AdminMain />
        </LoadingProvider>
      ),
      children: [
        { index: true, element: <Dashboard /> },
        { path: "/admin/roles", element: <RoleList /> },
        { path: "/admin/roles/create", element: <RoleForm /> },
        { path: "/admin/roles/edit/:id", element: <RoleForm /> },
        { path: "/admin/roles/:id", element: <RoleDetail /> },
        { path: "/admin/users", element: <UserList /> },
        { path: "/admin/users/create", element: <UserForm /> },
        { path: "/admin/users/edit/:id", element: <UserForm /> },
        { path: "/admin/users/:id", element: <UserDetail /> },
        { path: "/admin/categories", element: <CategoryList /> },
        { path: "/admin/categories/create", element: <CategoryForm /> },
        { path: "/admin/categories/edit/:id", element: <CategoryForm /> },
        { path: "/admin/categories/:id", element: <CategoryDetail /> },
        { path: "/admin/games", element: <GameList /> },
        { path: "/admin/games/create", element: <GameForm /> },
        { path: "/admin/games/edit/:id", element: <GameForm /> },
        { path: "/admin/games/:id", element: <GameDetail /> },
      ],
    },
  ]);

  return (
    <div>
      <Toaster position="top-right" richColors closeButton />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
