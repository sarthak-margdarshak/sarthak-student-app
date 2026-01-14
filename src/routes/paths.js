function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = "/auth";
const ROOTS_DASHBOARD = "/dashboard";

export const PATH_AUTH = {
  root: ROOTS_AUTH, // redirect to login
  login: path(ROOTS_AUTH, "/login"),
  resetPassword: path(ROOTS_AUTH, "/reset-password"),
  newPassword: path(ROOTS_AUTH, "/new-password"),
  signup: path(ROOTS_AUTH, "/signup"),
};

export const PATH_PAGE = {
  root: "/",
  maintenance: "/maintenance",
  standard: (standardId) => `/standard/${standardId}`,
  subject: (subjectId) => `/subject/${subjectId}`,
  product: (productId) => `/product/${productId}`,
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD, // redirect to profile
  profile: path(ROOTS_DASHBOARD, "/profile"),
  purchased: path(ROOTS_DASHBOARD, "/purchased"),
  attempt: (attemptId, lang) =>
    lang
      ? path(ROOTS_DASHBOARD, `/attempt/${attemptId}?lang=${lang}`)
      : path(ROOTS_DASHBOARD, `/attempt/${attemptId}`),
  mockTest: (mockTestId, productId, lang) =>
    lang
      ? path(ROOTS_DASHBOARD, `/mockTest/${mockTestId}?productId=${productId}&lang=${lang}`)
      : path(ROOTS_DASHBOARD, `/mockTest/${mockTestId}?productId=${productId}`),
  orders: {
    root: path(ROOTS_DASHBOARD, "/orders"),
    view: (id) => path(ROOTS_DASHBOARD, `/orders/${id}`),
  },
};
