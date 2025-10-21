import React from "react";
import { AlertTriangle, Clock, Wrench } from "lucide-react";

const Maintenance = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
            <Wrench className="w-10 h-10 text-orange-600 dark:text-orange-400" />
          </div>
          <AlertTriangle className="w-8 h-8 text-orange-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Under Maintenance
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We're currently performing scheduled maintenance to improve your
            experience. Please check back shortly.
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Estimated Time
            </span>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            We'll be back online as soon as possible
          </p>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>Thank you for your patience!</p>
          <p className="mt-1">Sarthak Margdarshak Team</p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
