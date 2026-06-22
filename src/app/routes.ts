import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { GeneratePage } from "./pages/GeneratePage";
import { PreviewPage } from "./pages/PreviewPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: GeneratePage },
      { path: "preview/:id", Component: PreviewPage },
    ],
  },
]);
