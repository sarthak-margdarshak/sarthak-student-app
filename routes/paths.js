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
  category: {
    root: path(ROOTS_DASHBOARD, "/category"),
    standards: path(ROOTS_DASHBOARD, "/category/standards"),
    subjects: path(ROOTS_DASHBOARD, "/category/subjects"),
    chapters: path(ROOTS_DASHBOARD, "/category/chapters"),
  },
  product: {
    root: path(ROOTS_DASHBOARD, "/product"),
    list: path(ROOTS_DASHBOARD, "/product/list"),
    view: (id) => path(ROOTS_DASHBOARD, `/product/${id}`),
  },
  cart: {
    root: path(ROOTS_DASHBOARD, "/cart"),
  },
};
