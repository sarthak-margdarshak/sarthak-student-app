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

const langPath = {
  app: {
    dashboard: {
      layout: {
        stackTitle: `app_dashboard_layout_stackTitle`,
      },
      preferences: {
        title: `app_dashboard_preferences_title`,
      },
      orders: {
        title: `app_dashboard_orders_title`,
        list: {
          empty: {
            title: `app_dashboard_orders_list_empty_title`,
            description: `app_dashboard_orders_list_empty_desc`,
          },
        },
      },
    },
  },
  section: {
    dashboard: {
      dashboardFragments: {
        settingsFragments: {
          language: `section_dashboard_settings_lang`,
          about: `section_dashboard_settings_about`,
          rate_app: `section_dashboard_settings_rateApp`,
          send_feedback: `section_dashboard_settings_sendFeedback`,
          help_center: `section_dashboard_settings_helpCenter`,
          theme: `section_dashboard_settings_theme`,
          themeType: {
            system_default: `section_dashboard_settings_tsd`,
            light: `section_dashboard_settings_tl`,
            dark: `section_dashboard_settings_td`,
          },
        },
        ProfileFragments: {
          pers_info: `section_dashboard_profile_personalInfo`,
          fullName: `section_dashboard_profile_fullName`,
          contactInfo: `section_dashboard_profile_contactInfo`,
          emailId: `section_dashboard_profile_emailID`,
          yourOrders: `section_dashboard_profile_yourOrders`,
        },
        purchased: {
          noData: {
            title: `section_dashboard_purchased_title`,
            description: `section_dashboard_purchased_description`,
          },
        },
        cart: {
          empty: {
            title: `section_dashboard_cart_title`,
            description: `section_dashboard_cart_description`,
          },
        },
        exploreMockBtn: `section_dashboard_exploreMockBtn`,
      },
    },
  },
  auth: {
    logOut: `auth_logOut`,
  },
};

export default langPath;
