/**
 * Written By - Ritesh Ranjan
 * Website - https://sagittariusk2.github.io/
 *
 *  /|||||\    /|||||\   |||||||\   |||||||||  |||   |||   /|||||\   ||| ///
 * |||        |||   |||  |||   |||     |||     |||   |||  |||   |||  |||///
 *  \|||||\   |||||||||  |||||||/      |||     |||||||||  |||||||||  |||||
 *       |||  |||   |||  |||  \\\      |||     |||   |||  |||   |||  |||\\\
 *  \|||||/   |||   |||  |||   \\\     |||     |||   |||  |||   |||  ||| \\\
 *
 */

// ----------------------------------------------------------------------
function path(root, sublink) {
  return `${root}${sublink}`;
}

// ----------------------------------------------------------------------

const ROOTS_AUTH = "/auth";
const ROOTS_DASHBOARD = "/dashboard";

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, "/login"),
  signUp: path(ROOTS_AUTH, "/sign-up"),
  forgotPassword: path(ROOTS_AUTH, "/forgot-password"),
};

// ----------------------------------------------------------------------

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  preferences: path(ROOTS_DASHBOARD, "/preferences"),
  category: {
    standards: path(ROOTS_DASHBOARD, "/category/standards"),
    subjects: path(ROOTS_DASHBOARD, "/category/subjects"),
    chapters: path(ROOTS_DASHBOARD, "/category/chapters"),
  },
  product: {
    list: path(ROOTS_DASHBOARD, "/product/list"),
    view: (id) => path(ROOTS_DASHBOARD, `/product/${id}`),
  },
  orders: {
    list: path(ROOTS_DASHBOARD, "/orders/order-list"),
    view: (id) => path(ROOTS_DASHBOARD, `/orders/${id}`),
  },
  mockTest: {
    list: (productId) =>
      path(ROOTS_DASHBOARD, `/mockTest/list/product/${productId}`),
    attempts: (mockTestId) =>
      path(ROOTS_DASHBOARD, `/mockTest/attempt/list/${mockTestId}`),
    attempReport: (attemptId) =>
      path(ROOTS_DASHBOARD, `/mockTest/attempt/report/${attemptId}`),
    appear: (attemptId) =>
      path(ROOTS_DASHBOARD, `/mockTest/appear/${attemptId}`),
  },
};
