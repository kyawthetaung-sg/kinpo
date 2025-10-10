import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from "./layouts/user/Main";
import Error from "./pages/Error";
import {
  Home,
  VideoPlayer,
} from "./pages/user";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Main />,
      errorElement: <Error />,
      children: [
        { index: true, element: <Home /> },
        { path: "/players", element: <VideoPlayer /> },
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
