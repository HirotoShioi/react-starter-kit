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
import TodosPage from "@/pages/todos-page";
import todosLoader from "@/loaders/todos-loader";
import { getCurrentUser } from "aws-amplify/auth";

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
            loader: async ({ params }) => {
              return protectedRoute(() => todosLoader(params));
            },
          },
          {
            path: "/chat",
            element: <ChatPage />,
            loader: async () => {
              return protectedRoute();
            },
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
