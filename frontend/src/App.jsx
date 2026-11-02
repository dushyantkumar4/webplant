import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getMe } from "./redux/authSlice.js";
import { RouterProvider } from "react-router/dom";
import router from "./routes/AppRouter.jsx";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  return <RouterProvider router={router} />;
};

export default App;
