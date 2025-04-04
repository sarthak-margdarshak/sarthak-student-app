export const APPWRITE_API = {
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: "sarthak_core_db",
  collections: {
    metadata: "metadata",
    bookIndex: "book_index",
    questions: "questions",
    mockTest: "mock_test",
    products: "products",
  },
  documents: {
    metadataContentDoc: "content_doc",
    testProduct: process.env.NEXT_PUBLIC_TEST_PRODUCT_ID,
  },
  buckets: {
    sarthakDatalakeBucket: "sarthak_datalake_bucket",
  },
  functions: {
    sarthakAPI: "sarthak-api",
  },
};