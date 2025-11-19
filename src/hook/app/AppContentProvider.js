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

export const appwriteClient = new Client()
  .setEndpoint(APPWRITE_API.backendUrl)
  .setProject(APPWRITE_API.projectId);
export const appwriteStorage = new Storage(appwriteClient);
export const appwriteDatabases = new Databases(appwriteClient);

const initialState = {
  top3Products: [],
  standards: {},
  subjects: {},
  products: {},
  currentPage: "",
  setCurrentPageName: () => {},
};

const reducer = (state, action) => {
  if (action.type === "UPDATE_TOP_3_PRODUCTS") {
    return {
      ...state,
      top3Products: action.payload.top3Products,
    };
  } else if (action.type === "UPDATE_STANDARDS") {
    return {
      ...state,
      standards: action.payload.standards,
    };
  } else if (action.type === "UPDATE_SUBJECTS") {
    return {
      ...state,
      subjects: action.payload.subjects,
    };
  } else if (action.type === "UPDATE_PRODUCTS") {
    return {
      ...state,
      products: action.payload.products,
    };
  } else if (action.type === "UPDATE_CURRENT_PAGE") {
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

      dispatch({
        type: "UPDATE_TOP_3_PRODUCTS",
        payload: {
          top3Products: [],
        },
      });

      dispatch({
        type: "UPDATE_STANDARDS",
        payload: {
          standards: {},
        },
      });

      dispatch({
        type: "UPDATE_SUBJECTS",
        payload: {
          subjects: {},
        },
      });

      dispatch({
        type: "UPDATE_PRODUCTS",
        payload: {
          products: {},
        },
      });

      const tempProducts = await appwriteDatabases.listDocuments(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.products,
        [
          Query.limit(100),
          Query.orderDesc("approvedAt"),
          Query.equal("published", true),
          Query.notEqual("$id", APPWRITE_API.documents.testProduct),
        ]
      );

      const tempProductsID = tempProducts.documents.slice(0, 3).map((p) => p.$id);

      const processedProducts = await Promise.all(
        tempProducts.documents.map(async (product) => {
          const standard = await appwriteDatabases.getDocument(
            APPWRITE_API.databaseId,
            APPWRITE_API.collections.bookIndex,
            product.standardId
          );

          let subject = null;
          if (product.subjectId !== null) {
            subject = await appwriteDatabases.getDocument(
              APPWRITE_API.databaseId,
              APPWRITE_API.collections.bookIndex,
              product.subjectId
            );
          }

          const images = product.images.map((image) =>
            appwriteStorage.getFileDownload(
              APPWRITE_API.buckets.sarthakDatalakeBucket,
              image
            )
          );

          return {
            ...product,
            standard,
            subject,
            images,
          };
        })
      );

      let tempStandards = {};
      let tempSubjects = {};
      let productsFinal = {};

      processedProducts.forEach((product) => {
        if (tempStandards[product.standard.$id] === undefined) {
          tempStandards[product.standard.$id] = {
            name: product.standard["standard"],
            productIDs: [],
            subjects: [],
          };
        }

        if (product.subject) {
          tempStandards[product.standard.$id].subjects.push(
            product.subject.$id
          );
          if (tempSubjects[product.subject.$id] === undefined) {
            tempSubjects[product.subject.$id] = {
              name: product.subject["subject"],
              productIDs: [],
            };
          }
          tempSubjects[product.subject.$id].productIDs.push(product.$id);
        } else {
          tempStandards[product.standard.$id].productIDs.push(product.$id);
        }

        productsFinal[product.$id] = product;
      });

      for (let i in tempStandards) {
        tempStandards[i].subjects = [...new Set(tempStandards[i].subjects)];
      }

      state.top3Products = tempProductsID;
      state.standards = tempStandards;
      state.subjects = tempSubjects;
      state.products = productsFinal;

      dispatch({
        type: "UPDATE_TOP_3_PRODUCTS",
        payload: {
          top3Products: state.top3Products,
        },
      });

      dispatch({
        type: "UPDATE_STANDARDS",
        payload: {
          standards: state.standards,
        },
      });

      dispatch({
        type: "UPDATE_SUBJECTS",
        payload: {
          subjects: state.subjects,
        },
      });

      dispatch({
        type: "UPDATE_PRODUCTS",
        payload: {
          products: state.products,
        },
      });

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

  const memoizedValue = useMemo(
    () => ({
      top3Products: state.top3Products,
      standards: state.standards,
      subjects: state.subjects,
      products: state.products,
      currentPage: state.currentPage,
      setCurrentPageName,
    }),
    [
      state.top3Products,
      state.standards,
      state.subjects,
      state.products,
      state.currentPage,
      setCurrentPageName,
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
