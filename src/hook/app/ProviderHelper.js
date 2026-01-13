import { Query } from "appwrite";
import { appwriteDatabases, appwriteStorage } from "@/hook/auth/AppwriteContext";
import { APPWRITE_API } from "@/config-global";

export class ProviderHelper {
  // =========================================================
  //  QUESTION LOGIC
  // =========================================================

  static async detectChangeInQuestion(questionId) {
    try {
      const questionLocalKey = `question_${questionId}`;
      const localQuestion = JSON.parse(localStorage.getItem(questionLocalKey));

      if (!localQuestion) return true;

      const x = await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.questions,
        questionId,
        [Query.select(["$updatedAt", "translatedLang"])]
      );
      let latestUpdatedAt = x.$updatedAt;

      if (x.translatedLang && x.translatedLang.length > 0) {
        for (let lang of x.translatedLang) {
          const langObj = await appwriteDatabases.listDocuments(
            APPWRITE_API.databaseId,
            APPWRITE_API.collections.translatedQuestions,
            [
              Query.equal("questionId", questionId),
              Query.equal("lang", lang),
              Query.select(["$updatedAt"]),
            ]
          );

          if (
            langObj.documents.length > 0 &&
            latestUpdatedAt < langObj.documents[0].$updatedAt
          ) {
            latestUpdatedAt = langObj.documents[0].$updatedAt;
          }
        }
      }

      return latestUpdatedAt > localQuestion.$updatedAt;
    } catch (error) {
      console.error("Error detecting change in question:", error);
      return true;
    }
  }

  static async downloadQuestion(questionId) {
    const questionLocalKey = `question_${questionId}`;
    try {
      // 1. Check Cache
      if (localStorage.getItem(questionLocalKey)) {
        const changeDetected = await ProviderHelper.detectChangeInQuestion(
          questionId
        );
        if (!changeDetected) {
          return JSON.parse(localStorage.getItem(questionLocalKey));
        }
      }

      // 2. Fetch Document
      const question = await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.questions,
        questionId,
        [Query.select(["qnId"])]
      );

      // 3. Security & Cleanup (Remove Answers & Metadata)
      delete question.answerOptions;
      delete question.contentAnswer;
      delete question.coverAnswer;
      delete question.creator;
      delete question.updater;
      delete question.approver;
      delete question.approvedAt;
      delete question.published;
      delete question.mockTest;
      delete question.bookIndexId;
      delete question.standardId;
      delete question.subjectId;
      delete question.chapterId;
      delete question.conceptId;
      delete question.$createdAt;
      delete question.$collectionId;
      delete question.$databaseId;
      delete question.$permissions;

      // 4. Resolve Images (Cover Question)
      if (question?.coverQuestion) {
        question.coverQuestion = appwriteStorage.getFileDownload(
          APPWRITE_API.buckets.sarthakDatalakeBucket,
          question.coverQuestion
        );
      }

      // 5. Resolve Images (Options)
      const options = [];
      if (question?.coverOptions) {
        for (let i in question.coverOptions) {
          if (question.coverOptions[i]) {
            options.push(
              appwriteStorage.getFileDownload(
                APPWRITE_API.buckets.sarthakDatalakeBucket,
                question.coverOptions[i]
              )
            );
          } else {
            options.push(null);
          }
        }
      }
      question.coverOptions = options;

      // 6. Fetch Translations
      if (question.translatedLang && question.translatedLang.length > 0) {
        for (let lang of question.translatedLang) {
          const langRes = await appwriteDatabases.listDocuments(
            APPWRITE_API.databaseId,
            APPWRITE_API.collections.translatedQuestions,
            [Query.equal("questionId", questionId), Query.equal("lang", lang)]
          );

          if (langRes.documents.length > 0) {
            const langObj = langRes.documents[0];

            question[lang] = {
              contentQuestion: langObj.contentQuestion,
              contentOptions: langObj.contentOptions,
            };

            if (question.$updatedAt < langObj.$updatedAt) {
              question.$updatedAt = langObj.$updatedAt;
            }
          }
        }
      }

      // 7. Save to Local Storage
      localStorage.setItem(questionLocalKey, JSON.stringify(question));

      return question;
    } catch (error) {
      console.error("Error downloading question:", error);
      // Fallback: try to return cached version even if update check failed
      if (localStorage.getItem(questionLocalKey)) {
        return JSON.parse(localStorage.getItem(questionLocalKey));
      }
      return null;
    }
  }

  // =========================================================
  //  MOCK TEST LOGIC
  // =========================================================

  static async detectChangeInMockTest(mockTestId) {
    try {
      const mockTestLocalKey = `mock_test_${mockTestId}`;
      const localMockTest = JSON.parse(localStorage.getItem(mockTestLocalKey));

      if (!localMockTest) return true;

      const x = await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.mockTest,
        mockTestId,
        [Query.select(["$updatedAt", "translatedLang"])]
      );
      let latestUpdatedAt = x.$updatedAt;

      if (x.translatedLang && x.translatedLang.length > 0) {
        for (let lang of x.translatedLang) {
          const langObj = await appwriteDatabases.listDocuments(
            APPWRITE_API.databaseId,
            APPWRITE_API.collections.translatedMockTest,
            [
              Query.equal("mockTestId", mockTestId),
              Query.equal("lang", lang),
              Query.select(["$updatedAt"]),
            ]
          );

          if (
            langObj.documents.length > 0 &&
            latestUpdatedAt < langObj.documents[0].$updatedAt
          ) {
            latestUpdatedAt = langObj.documents[0].$updatedAt;
          }
        }
      }

      return latestUpdatedAt > localMockTest.$updatedAt;
    } catch (error) {
      return true;
    }
  }

  static async downloadMockTest(mockTestId) {
    const mockTestLocalKey = `mock_test_${mockTestId}`;
    try {
      // 1. Check Cache
      if (localStorage.getItem(mockTestLocalKey)) {
        const changeDetected = await ProviderHelper.detectChangeInMockTest(
          mockTestId
        );
        if (!changeDetected) {
          return JSON.parse(localStorage.getItem(mockTestLocalKey));
        }
      }

      // 2. Fetch Document
      const mockTest = await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.mockTest,
        mockTestId
      );

      // 3. Cleanup
      delete mockTest.$collectionId;
      delete mockTest.$databaseId;
      delete mockTest.$permissions;
      delete mockTest.creator;
      delete mockTest.updater;
      delete mockTest.approver;

      // 4. Fetch Translations
      if (mockTest.translatedLang && mockTest.translatedLang.length > 0) {
        for (let lang of mockTest.translatedLang) {
          const langRes = await appwriteDatabases.listDocuments(
            APPWRITE_API.databaseId,
            APPWRITE_API.collections.translatedMockTest,
            [Query.equal("mockTestId", mockTestId), Query.equal("lang", lang)]
          );

          if (langRes.documents.length > 0) {
            const langObj = langRes.documents[0];
            mockTest[lang] = {
              name: langObj.name,
              description: langObj.description,
            };

            if (mockTest.$updatedAt < langObj.$updatedAt) {
              mockTest.$updatedAt = langObj.$updatedAt;
            }
          }
        }
      }

      // 5. Save to Local Storage
      localStorage.setItem(mockTestLocalKey, JSON.stringify(mockTest));

      return mockTest;
    } catch (error) {
      console.error("Error downloading mock test:", error);
      if (localStorage.getItem(mockTestLocalKey)) {
        return JSON.parse(localStorage.getItem(mockTestLocalKey));
      }
      return null;
    }
  }

  // =========================================================
  //  PRODUCT LOGIC
  // =========================================================

  static async detectChangeInProduct(productId) {
    try {
      const productLocalKey = `product_${productId}`;
      const localProduct = JSON.parse(localStorage.getItem(productLocalKey));

      if (!localProduct) return true;

      const x = await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.products,
        productId,
        [Query.select(["$updatedAt", "translatedLang"])]
      );
      let latestUpdatedAt = x.$updatedAt;

      if (x.translatedLang && x.translatedLang.length > 0) {
        for (let lang of x.translatedLang) {
          const langObj = await appwriteDatabases.listDocuments(
            APPWRITE_API.databaseId,
            APPWRITE_API.collections.translatedProducts,
            [
              Query.equal("productId", productId),
              Query.equal("lang", lang),
              Query.select(["$updatedAt"]),
            ]
          );

          if (
            langObj.documents.length > 0 &&
            latestUpdatedAt < langObj.documents[0].$updatedAt
          ) {
            latestUpdatedAt = langObj.documents[0].$updatedAt;
          }
        }
      }

      return latestUpdatedAt > localProduct.$updatedAt;
    } catch (error) {
      return true;
    }
  }

  static async downloadProduct(productId) {
    const productLocalKey = `product_${productId}`;
    try {
      // 1. Check Cache
      if (localStorage.getItem(productLocalKey)) {
        const changeDetected = await ProviderHelper.detectChangeInProduct(
          productId
        );
        if (!changeDetected) {
          return JSON.parse(localStorage.getItem(productLocalKey));
        }
      }

      // 2. Fetch Document
      var product = await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.products,
        productId
      );

      // 3. Cleanup
      delete product.$collectionId;
      delete product.$databaseId;
      delete product.$permissions;
      delete product.$createdAt;
      delete product.approvedAt;
      delete product.creator;
      delete product.updater;
      delete product.approver;
      delete product.published;


      // 4. Resolve Images
      const images = [];
      if (product.images) {
        for (let image of product.images) {
          if (image) {
            images.push(
              appwriteStorage.getFileDownload(
                APPWRITE_API.buckets.sarthakDatalakeBucket,
                image
              )
            );
          } else {
            images.push(null);
          }
        }
      }
      product.images = images;

      product.availableLang = product.translatedLang || [];
      if (product.lang) {
        product.availableLang = [product.lang, ...product.availableLang];
        product[product.lang] = {
          name: product.name,
          description: product.description,
        };
      }

      // 5. Fetch Translations
      for (let lang of product.translatedLang) {
        const langRes = await appwriteDatabases.listDocuments(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.translatedProducts,
          [Query.equal("productId", productId), Query.equal("lang", lang)]
        );

        if (langRes.documents.length > 0) {
          const langObj = langRes.documents[0];
          product[lang] = {
            name: langObj.name,
            description: langObj.description,
          };

          if (product.$updatedAt < langObj.$updatedAt) {
            product.$updatedAt = langObj.$updatedAt;
          }
        }
      }

      if (product.subjectId) {
        const subject = await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.bookIndex,
          product.subjectId
        );
        product.subject = subject;
      }
      if (product.standardId) {
        const standard = await appwriteDatabases.getDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.bookIndex,
          product.standardId
        );
        product.standard = standard;
      }

      // 6. Save to Local Storage
      localStorage.setItem(productLocalKey, JSON.stringify(product));

      return product;
    } catch (error) {
      console.error("Error downloading product:", error);
      if (localStorage.getItem(productLocalKey)) {
        return JSON.parse(localStorage.getItem(productLocalKey));
      }
      return null;
    }
  }
}
