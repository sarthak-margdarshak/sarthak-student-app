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
    orders: "orders",
    mockTestAttempts: "mock_test_attempts",
    translatedQuestions: "translated_questions",
    translatedMockTest: "translated_mock_test",
    translatedProducts: "translated_products",
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

export const TEST_STATUS = {
  CREATED: "created",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  IN_EVALUATION: "in_evaluation",
};

export const RAZORPAY_API = {
  keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  secret: process.env.NEXT_PUBLIC_RAZORPAY_SECRET,
};
