import toast from "react-hot-toast";
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import React, { useContext } from "react";
import "../styles/toastConfirm/toastConfirm.css";
import { userContext } from "../context/UserContext";
/**
 * Show a success toast notification
 * @param {string} message - The message to display
 * @param {number} duration - Duration in milliseconds (default: 4000)
 */
export const showSuccessToast = (message, duration = 4000, isLight = false) => {
  toast.custom(
    (t) => (
      <div
        className={`toast-container success ${
          t.visible ? "animate-enter" : "animate-leave"
        } ${isLight ? "bg-white text-black" : "bg-black text-white"}`}
      >
        <div className="toast-icon-container success">
          <CheckCircle size={18} color={isLight ? "black" : "white"} />
        </div>
        <div className="toast-content">
          <p
            className="toast-title"
            style={{ color: isLight ? "black" : "white" }}
          >
            Success
          </p>
          <p
            className="toast-message"
            style={{ color: isLight ? "black" : "white" }}
          >
            {message}
          </p>
        </div>
        <button className="toast-close" onClick={() => toast.dismiss(t.id)}>
          <X size={16} color={isLight ? "black" : "white"} />
        </button>
      </div>
    ),
    { duration }
  );
};

/**
 * Show an error toast notification
 * @param {string} message - The message to display
 * @param {number} duration - Duration in milliseconds (default: 5000)
 */
export const showErrorToast = (message, duration = 5000, isLight = false) => {
  toast.custom(
    (t) => (
      <div
        className={`toast-container error ${
          t.visible ? "animate-enter" : "animate-leave"
        } ${isLight ? "bg-white text-black" : "bg-black text-white"}`}
      >
        <div className="toast-icon-container error">
          <AlertCircle size={18} color={isLight ? "black" : "white"} />
        </div>
        <div className="toast-content">
          <p className="toast-title" style={{ color: isLight ? "black" : "white" }}>Error</p>
          <p className="toast-message" style={{ color: isLight ? "black" : "white" }}>{message}</p>
        </div>
        <button className="toast-close" onClick={() => toast.dismiss(t.id)}>
          <X size={16} color={isLight ? "black" : "blackwhite"} />
        </button>
      </div>
    ),
    { duration }
  );
};

/**
 * Show an info toast notification
 * @param {string} message - The message to display
 * @param {number} duration - Duration in milliseconds (default: 4000)
 */
export const showInfoToast = (message, duration = 4000, isLight = false) => {
  toast.custom(
    (t) => (
      <div
        className={`toast-container info ${
          t.visible ? "animate-enter" : "animate-leave"
        } ${isLight ? "bg-white text-black" : "bg-black text-white"}`}
      >
        <div className="toast-icon-container info">
          <Info size={18} color={isLight ? "black" : "white"} />
        </div>
        <div className="toast-content">
          <p className="toast-title">Information</p>
          <p className="toast-message">{message}</p>
        </div>
        <button className="toast-close" onClick={() => toast.dismiss(t.id)}>
          <X size={16} color={isLight ? "black" : "black"} />
        </button>
      </div>
    ),
    { duration }
  );
};

/**
 * Show a warning toast notification
 * @param {string} message - The message to display
 * @param {number} duration - Duration in milliseconds (default: 4500)
 */
export const showWarningToast = (message, duration = 4500, isLight = false) => {
  toast.custom(
    (t) => (
      <div
        className={`toast-container warning ${
          t.visible ? "animate-enter" : "animate-leave"
        } ${isLight ? "bg-white text-black" : "bg-black text-white"}`}
      >
        <div className="toast-icon-container warning">
          <AlertTriangle size={18} color={isLight ? "black" : "white"} />
        </div>
        <div className="toast-content">
          <p className="toast-title">Warning</p>
          <p className="toast-message">{message}</p>
        </div>
        <button className="toast-close" onClick={() => toast.dismiss(t.id)}>
          <X size={16} color={isLight ? "black" : "white"} />
        </button>
      </div>
    ),
    { duration }
  );
};

/**
 * Show a confirmation toast with confirm and cancel buttons
 * @param {Object} options - Configuration options
 * @param {string} options.message - The message to display
 * @param {string} options.title - Optional title (default: "Confirmation")
 * @param {Function} options.onConfirm - Callback function when confirmed
 * @param {Function} options.onCancel - Callback function when canceled
 * @param {string} options.confirmText - Text for confirm button (default: "Confirm")
 * @param {string} options.cancelText - Text for cancel button (default: "Cancel")
 */
export const showConfirmToast = ({
  message,
  title = "Confirmation",
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLight = false,
}) => {
  const toastId = toast.custom(
    (t) => {
      return (
        <div
          className={`toast-container confirm ${
            t.visible ? "animate-enter" : "animate-leave"
          } ${isLight ? "bg-white text-black" : "bg-black text-white"}`}
        >
          <div className="toast-content-confirm">
            <p className="toast-title" style={{ color: isLight ? "black" : "white" }}>{title}</p>
            <p className="toast-message" style={{ color: isLight ? "black" : "white" }}>{message || "Are you sure?"}</p>

            <div className="toast-actions">
              <button
                className="toast-button cancel"
                onClick={() => {
                  toast.dismiss(toastId);
                  onCancel?.();
                }}
              >
                {cancelText}
              </button>
              <button
                className="toast-button confirm"
                onClick={() => {
                  toast.dismiss(toastId);
                  onConfirm?.();
                }}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      );
    },
    { duration: 100000 } // Long duration since user needs to interact with it
  );
  return toastId;
};

/**
 * Show a loading toast that can be updated or dismissed
 * @param {string} message - The loading message
 * @returns {string} Toast ID that can be used to update or dismiss the toast
 */
export const showLoadingToast = (message, isLight = false) => {
  return toast.custom(
    (t) => (
      <div
        className={`toast-container loading ${
          t.visible ? "animate-enter" : "animate-leave"
        } ${isLight ? "bg-white text-black" : "bg-black text-white"}`}
      >
        <div className="toast-loading-spinner" style={{ color: isLight ? "black" : "white" }}></div>
        <div className="toast-content">
          <p className="toast-message" style={{ color: isLight ? "black" : "white" }}>{message || "Loading..."}</p>
        </div>
      </div>
    ),
    { duration: Number.POSITIVE_INFINITY }
  );
};

/**
 * Update a loading toast with a success message
 * @param {string} toastId - The ID of the toast to update
 * @param {string} message - The success message
 * @param {number} duration - Duration in milliseconds (default: 2000)
 */
export const updateToastSuccess = (
  toastId,
  message,
  duration = 2000,
  isLight = false
) => {
  toast.custom(
    (t) => (
      <div
        className={`toast-container success ${
          t.visible ? "animate-enter" : "animate-leave"
        } ${isLight ? "bg-white text-black" : "bg-black text-white"}`}
      >
        <div className="toast-icon-container success">
          <CheckCircle size={18} color={isLight ? "black" : "white"} />
        </div>
        <div className="toast-content">
          <p className="toast-title" style={{ color: isLight ? "black" : "white" }}>Success</p>
          <p className="toast-message" style={{ color: isLight ? "black" : "white" }}>{message}</p>
        </div>
        <button className="toast-close" onClick={() => toast.dismiss(t.id)}>
          <X size={16} color={isLight ? "black" : "white"} />
        </button>
      </div>
    ),
    { id: toastId, duration }
  );
};

/**
 * Update a loading toast with an error message
 * @param {string} toastId - The ID of the toast to update
 * @param {string} message - The error message
 * @param {number} duration - Duration in milliseconds (default: 3000)
 */
export const updateToastError = (
  toastId,
  message,
  duration = 3000,
  isLight = false
) => {
  toast.custom(
    (t) => (
      <div
        className={`toast-container error ${
          t.visible ? "animate-enter" : "animate-leave"
        } ${isLight ? "bg-white text-black" : "bg-black text-white"}`}
      >
        <div className="toast-icon-container error">
          <AlertCircle size={18} color={isLight ? "black" : "white"} />
        </div>
        <div className="toast-content">
          <p className="toast-title" style={{ color: isLight ? "black" : "white" }}>Error</p>
          <p className="toast-message" style={{ color: isLight ? "black" : "white" }}>{message}</p>
        </div>
        <button className="toast-close" onClick={() => toast.dismiss(t.id)}>
          <X size={16} color={isLight ? "black" : "white"} />
        </button>
      </div>
    ),
    { id: toastId, duration }
  );
};
