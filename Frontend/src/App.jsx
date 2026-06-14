import { Outlet, useLocation } from "react-router-dom";
import "./index.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import fetchUserDetails from "./utils/fetchUserDetails";
import { useEffect } from "react";
import { setUserDetails, logout } from "./store/userSlice";
import { useDispatch } from "react-redux";
import Axios from "./utils/AxiosUser";
import SummaryApi from "./common/SummaryApi";
import ScrollToTop from "./components/ScrollToTop";
import { LogoutModalProvider } from "./components/LogoutModalManager";
import {
  setAllCategory,
  setAllSubCategory,
  setLoadingCategory,
} from "./store/productSlice";
import GlobalProvider from "./provider/GlobalProvider";
// import toast, { Toaster } from "react-hot-toast";
import Livechat from "./components/Livechat";
import ScrollToTopButton from "./components/ScrollToTopButton";

function App() {
  const dispatch = useDispatch();

const fetchUser = async () => {
  try {
    const userData = await fetchUserDetails();
    if (userData?.data) {
      dispatch(setUserDetails(userData.data));
    }
  } catch (error) {
    dispatch(logout());
  }
};

  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true));
      const response = await Axios({ ...SummaryApi.getCategory });
      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(setAllCategory(responseData.data));
      }
    } catch (error) {
      console.error("Fetch category error:", error);
    } finally {
      dispatch(setLoadingCategory(false));
    }
  };

  const fetchSubCategory = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getSubCategory });
      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(setAllSubCategory(responseData.data));
      }
    } catch (error) {
      console.error("Fetch subcategory error:", error);
    }
  };

useEffect(() => {
  const init = async () => {
    try {
      dispatch(setLoadingCategory(true));

      const [userRes, catRes, subCatRes] = await Promise.all([
        fetchUserDetails(),
        Axios({ ...SummaryApi.getCategory }),
        Axios({ ...SummaryApi.getSubCategory }),
      ]);

      // USER
      if (userRes?.data) {
        dispatch(setUserDetails(userRes.data));
      } else {
        dispatch(logout());
      }

      // CATEGORY
      if (catRes?.data?.success) {
        dispatch(setAllCategory(catRes.data.data));
      }

      // SUBCATEGORY
      if (subCatRes?.data?.success) {
        dispatch(setAllSubCategory(subCatRes.data.data));
      }

    } catch (error) {
      console.error("Init error:", error);
    } finally {
      dispatch(setLoadingCategory(false));
    }
  };

  init();
}, []);

  return (
    <LogoutModalProvider>
      {/* <Toaster/> */}
      <GlobalProvider>
        <ScrollToTop />
        <Header />
        <main className="min-h-[78vh]">
          <Outlet />
        </main>
        <ScrollToTopButton />
        <Livechat />
        <Footer />
      </GlobalProvider>
    </LogoutModalProvider>
  );
}

export default App;
