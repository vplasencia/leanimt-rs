import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from "./App"
import Benchmarks from "./pages/Browser"

export default function Routes(): JSX.Element {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />
    },
    {
      path: "/browser",
      element: <Benchmarks />
    }
  ])

  return <RouterProvider router={router} />
}
