import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  FiArrowLeft,
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiLink,
  FiGithub,
  FiLinkedin,
  FiGlobe,
  FiCode,
  FiAlertCircle,
  FiCheckCircle,
  FiLoader,
  FiExternalLink,
} from "react-icons/fi"
import { motion, AnimatePresence } from "framer-motion"
import { userContext } from "../../context/UserContext";
import { AxiosApi } from "../../services/Api";
import { useNavigate } from "react-router";
import {showConfirmToast, showSuccessToast, showWarningToast, showErrorToast} from "../../confirmAlert/toastConfirm";
import '../../styles/user/accounts.css';
const Accounts = () => {
  const { user, setUser ,isLight} = useContext(userContext);

  const [currentAccounts, setCurrentAccounts] = useState(user?.accounts || {});
  const [newAccountKey, setNewAccountKey] = useState("");
  const [newAccountValue, setNewAccountValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingAccount, setEditingAccount] = useState(null);
  const navigate = useNavigate();
  const [success, setSuccess] = useState(null)
  const topWebsites = ["github", "linkedin", "personal website", "leetcode"];
   // Get icon based on account type
   const getAccountIcon = (accountType) => {
    switch (accountType.toLowerCase()) {
      case "github":
        return <FiGithub />
      case "linkedin":
        return <FiLinkedin />
      case "personal website":
        return <FiGlobe />
      case "leetcode":
        return <FiCode />
      default:
        return <FiLink />
    }
  }

  useEffect(() => {
    setCurrentAccounts(user?.accounts || {});
  }, [user?.accounts]);

  const updateAccounts = useCallback(
    async (updatedAccountsData) => {
      if (loading) return;
      setLoading(true);
      setError(null);
      try {
        await AxiosApi.patch(`user/profile/`, { accounts: updatedAccountsData });
        setUser((prev) => ({ ...prev, accounts: updatedAccountsData }));
        if (Object.keys(updatedAccountsData).length > Object.keys(currentAccounts).length) {
          setNewAccountKey("");
          setNewAccountValue("");
         showSuccessToast("Account added successfully!",isLight)
        } else if (editingAccount) {
          showSuccessToast("Account updated successfully!",

          )
        setEditingAccount(null)
       } else {
        setSuccess("Account removed successfully!",isLight
        )
        showSuccessToast("Account removed successfully!",isLight)
      }
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
      } catch (err) {
        console.error("Error updating accounts:", err);
        showSuccessToast(`Failed to update accounts. ${err?.response?.data?.detail || err.message || ""}`,isLight);
      } finally {
        setLoading(false);
      }
    },
    [setUser, loading, currentAccounts,editingAccount]
  );

  const handleAddAccount = () => {
    if (!newAccountKey || !newAccountValue) {
      setError("Both website and profile link are required.");
      showWarningToast("Both website and profile link are required.",isLight)
      return;
    }
    try {
      new URL(newAccountValue);
    } catch (_) {
      if (!newAccountValue.startsWith("http://") && !newAccountValue.startsWith("https://")) {
        setError("Profile link should be a valid URL (e.g., start with https://)");
        showErrorToast("Profile link should be a valid URL (e.g., start with https://)",isLight)
        return;
      }
    }

    if (currentAccounts[newAccountKey] === newAccountValue) {
      setError(`Account for '${newAccountKey}' with this exact link already exists.`);
      return;
    }

    const updatedAccounts = {
      ...currentAccounts,
      [newAccountKey.trim()]: newAccountValue.trim(),
    };

    updateAccounts(updatedAccounts);
  };

  const handleDeleteAccount = (keyToDelete) => {
    const { [keyToDelete]: _, ...remainingAccounts } = currentAccounts;
    updateAccounts(remainingAccounts);
  };

  const handleEditAccount = (keyToEdit) => {
    const accountToEdit = currentAccounts[keyToEdit];
    setNewAccountKey(keyToEdit);
    setNewAccountValue(accountToEdit);
    setEditingAccount(keyToEdit);
  };

  const ensureUrlProtocol = (url) => {
    if (!url) return "#";
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const accountList = Object.entries(currentAccounts);

  return (
    <div className={`accounts-container ${isLight ? "light-mode" : "dark-mode"}`}>
      <div className="background-pattern"></div>
      <motion.div
        className="accounts-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="accounts-header">
          <button className="back-button" onClick={() => navigate('/applicant/profile')} aria-label="Go back">
            <FiArrowLeft />
          </button>
          <h1>Linked Accounts</h1>
        </div>

        <div className="accounts-grid">
          <div className="accounts-list-section">
            <div className="section-header">
              <h2>Your Accounts</h2>
              <div className="accounts-count">{accountList.length} accounts</div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  className="alert error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <FiAlertCircle />
                  <span>{error}</span>
                </motion.div>
              )}

              {success && (
                <motion.div
                  className="alert success"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <FiCheckCircle />
                  <span>{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {loading && !accountList.length && (
              <div className="loading-container">
                <div className="loader"></div>
              </div>
            )}

            <AnimatePresence>
              {accountList.length > 0 ? (
                <motion.ul
                  className="accounts-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.1 }}
                >
                  {accountList.map(([key, value], index) => (
                    <motion.li
                      key={key}
                      className="account-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="account-icon">{getAccountIcon(key)}</div>
                      <div className="account-details">
                        <h3>{key}</h3>
                        <div className="link-container">
                          <a href={ensureUrlProtocol(value)} target="_blank" rel="noopener noreferrer" className="account-link">
                            {value}
                            <FiExternalLink className="external-link-icon" />
                          </a>
                        </div>
                      </div>
                      <div className="account-actions">
                        <button
                          className="edit-button"
                          onClick={() => handleEditAccount(key)}
                          disabled={loading}
                          aria-label={`Edit ${key} account`}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteAccount(key)}
                          disabled={loading}
                          aria-label={`Delete ${key} account`}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
              ) : (
                !loading && (
                  <motion.div className="no-accounts" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="empty-state-icon">
                      <FiLink className="no-accounts-icon" />
                    </div>
                    <p>No accounts added yet. Use the form to add some!</p>
                    <button 
                      className="add-first-account-btn"
                      onClick={() => document.getElementById('account-platform').focus()}
                    >
                      <FiPlus /> Add Your First Account
                    </button>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>

          <div className="accounts-form-section">
            <div className="section-header">
              <h2>{editingAccount ? "Edit Account" : "Add a New Account"}</h2>
              {editingAccount && <div className="editing-badge">Editing</div>}
            </div>
            <form className="accounts-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="account-platform">Website / Platform</label>
                <div className="select-wrapper">
                  <select
                    id="account-platform"
                    value={newAccountKey}
                    onChange={(e) => setNewAccountKey(e.target.value)}
                    disabled={loading}
                    required
                  >
                    <option value="" disabled>
                      Select a platform
                    </option>
                    {topWebsites.map((website) => (
                      <option key={website} value={website}>
                        {website}
                      </option>
                    ))}
                  </select>
                  <div className="select-icon">{newAccountKey ? getAccountIcon(newAccountKey) : <FiLink />}</div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="account-url">Profile URL / Link</label>
                <div className="input-wrapper">
                  <FiLink className="input-icon" />
                  <input
                    id="account-url"
                    type="text"
                    placeholder="https://..."
                    value={newAccountValue}
                    onChange={(e) => setNewAccountValue(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                {editingAccount && (
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => {
                      setEditingAccount(null)
                      setNewAccountKey("")
                      setNewAccountValue("")
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="button"
                  className={`submit-button ${loading ? "loading" : ""}`}
                  disabled={loading || !newAccountKey || !newAccountValue}
                  onClick={handleAddAccount}
                >
                  {loading ? (
                    <FiLoader className="spinner" />
                  ) : editingAccount ? (
                    <>
                      <FiEdit2 />
                      Update Account
                    </>
                  ) : (
                    <>
                      <FiPlus />
                      Add Account
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Accounts;

