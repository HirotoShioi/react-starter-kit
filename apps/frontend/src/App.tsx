import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "@/pages/error-page";
import IndexPage from "@/pages/index-page";
import ChatPage from "@/pages/chat-page";
import Root from "@/routes/root";
import Providers from "@/providers/providers";
import SignInPage from "@/pages/sign-in-page";
import TodosPage, {
  loader as todosLoader,
  action as todosAction,
} from "@/pages/todos-page";
import { getCurrentUser } from "aws-amplify/auth";
import { NFTPage } from "./pages/nft-page";

async function protectedRoute<T>(loader?: () => Promise<T>) {
  const user = await getCurrentUser().catch(() => null);
  if (user === null) {
    return redirect("/sign-in");
  }
  if (loader !== undefined) {
    return loader();
  } else {
    return null;
  }
}

async function redirectIfAuthenticated() {
  const user = await getCurrentUser().catch(() => null);
  if (user !== null) {
    return redirect("/todos");
  }
  return null;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <IndexPage />,
            loader: redirectIfAuthenticated,
          },
          {
            path: "/sign-in",
            element: <SignInPage />,
            loader: redirectIfAuthenticated,
          },
          {
            path: "/todos",
            element: <TodosPage />,
            loader: async () => {
              return protectedRoute(todosLoader);
            },
            action: todosAction,
          },
          {
            path: "/chat",
            element: <ChatPage />,
            loader: async () => {
              return protectedRoute();
            },
          },
          {
            path: "/nft",
            loader: async () => {
              return protectedRoute();
            },
            element: <NFTPage />,
          },
          { path: "*", element: <ErrorPage /> },
        ],
      },
    ],
  },
]);

export default function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}
