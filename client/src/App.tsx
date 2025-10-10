import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from "./layouts/user/Main";
import Error from "./pages/Error";
import {
  Home,
} from "./pages/user";

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
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
