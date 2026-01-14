"use client";

import { Client, Databases, Query, Storage } from "appwrite";
import { APPWRITE_API } from "@/config-global";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import LoadingSpinner from "@/components/sections/loading-spinner";
import { ProviderHelper } from "@/hook/app/ProviderHelper";

export const appwriteClient = new Client()
  .setEndpoint(APPWRITE_API.backendUrl)
  .setProject(APPWRITE_API.projectId);
export const appwriteStorage = new Storage(appwriteClient);
export const appwriteDatabases = new Databases(appwriteClient);

const initialState = {
  products: {},
  currentPage: "",
  setCurrentPageName: () => { },
  getTop5Products: async () => { },
  getProducts: async (bookIndexId) => { },
  getAvailableStandards: async () => { },
  getAvailableSubjects: async (standardId) => { },
  getBookIndex: async (bookIndexId) => { },
  getQuestion: async (questionId) => { },
  getMockTest: async (mockTestId) => { },
  getProduct: async (productId) => { },
};

const reducer = (state, action) => {
  if (action.type === "UPDATE_CURRENT_PAGE") {
    return {
      ...state,
      currentPage: action.payload.currentPage,
    };
  }
  return state;
};

export const AppContentContext = createContext(initialState);

export function AppContentProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (!localStorage.getItem("old_variables_deleted")) {
        localStorage.clear();
        localStorage.setItem("old_variables_deleted", "true");
      }
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setCurrentPageName = useCallback((newPage) => {
    dispatch({
      type: "UPDATE_CURRENT_PAGE",
      payload: {
        currentPage: newPage,
      },
    });
  }, []);

  const getTop5Products = useCallback(async () => {
    const tempProducts = (await appwriteDatabases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.products,
      [
        Query.limit(5),
        Query.orderDesc("approvedAt"),
        Query.equal("published", true),
        Query.notEqual("$id", APPWRITE_API.documents.testProduct),
        Query.select(["$id"])
      ]
    )).documents;
    return tempProducts.map((p) => p.$id);
  }, []);

  const getProducts = useCallback(async (bookIndexId) => {
    const tempProducts = (await appwriteDatabases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.products,
      [
        Query.limit(100),
        Query.orderDesc("approvedAt"),
        Query.equal("published", true),
        Query.notEqual("$id", APPWRITE_API.documents.testProduct),
        Query.select(["$id"]),
        Query.equal("bookIndexId", bookIndexId)
      ]
    )).documents;
    return tempProducts.map((p) => p.$id);
  }, []);

  const getAvailableStandards = useCallback(async () => {
    const availableStandards = (await appwriteDatabases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.bookIndex,
      [
        Query.limit(100),
        Query.orderAsc("standard"),
        Query.equal("anyProductPublished", true),
        Query.isNull("subject")
      ]
    )).documents;
    return availableStandards;
  }, []);

  const getAvailableSubjects = useCallback(async (standardId) => {
    const availableSubjects = (await appwriteDatabases.listDocuments(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.bookIndex,
      [
        Query.limit(100),
        Query.orderAsc("subject"),
        Query.equal("anyProductPublished", true),
        Query.equal("standard", standardId),
        Query.isNull("chapter")
      ]
    )).documents;
    return availableSubjects;
  }, []);

  const getBookIndex = useCallback(async (bookIndexId) => {
    return await appwriteDatabases.getDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.bookIndex,
      bookIndexId
    );
  }, []);

  const getQuestion = useCallback(async (questionId) => {
    return await ProviderHelper.downloadQuestion(questionId);
  }, []);

  const getMockTest = useCallback(async (mockTestId) => {
    return await ProviderHelper.downloadMockTest(mockTestId);
  }, []);

  const getProduct = useCallback(async (productId) => {
    return await ProviderHelper.downloadProduct(productId);
  }, []);

  const memoizedValue = useMemo(
    () => ({
      products: state.products,
      currentPage: state.currentPage,
      setCurrentPageName,
      getTop5Products,
      getProducts,
      getAvailableStandards,
      getAvailableSubjects,
      getBookIndex,
      getQuestion,
      getMockTest,
      getProduct,
    }),
    [
      state.products,
      state.currentPage,
      setCurrentPageName,
      getTop5Products,
      getProducts,
      getAvailableStandards,
      getAvailableSubjects,
      getBookIndex,
      getQuestion,
      getMockTest,
      getProduct,
    ]
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AppContentContext.Provider value={memoizedValue}>
      {children}
    </AppContentContext.Provider>
  );
}
