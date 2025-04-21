import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  TextField,
  Autocomplete,
  Grid,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Link,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddLinkIcon from "@mui/icons-material/AddLink";
import LanguageIcon from "@mui/icons-material/Language";
import LinkIcon from "@mui/icons-material/Link";
import EditIcon from "@mui/icons-material/Edit";
import { userContext } from "../../context/UserContext";
import { AxiosApi } from "../../services/Api";
import { useNavigate } from "react-router";
import { ArrowBack } from "@mui/icons-material";

const Accounts = () => {
  const { user, setUser } = useContext(userContext);

  const [currentAccounts, setCurrentAccounts] = useState(user?.accounts || {});
  const [newAccountKey, setNewAccountKey] = useState("");
  const [newAccountValue, setNewAccountValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingAccount, setEditingAccount] = useState(null);
  const navigate = useNavigate();

  const topWebsites = ["github", "linkedin", "personal website", "leetcode"];

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
        }
      } catch (err) {
        console.error("Error updating accounts:", err);
        setError(`Failed to update accounts. ${err?.response?.data?.detail || err.message || ""}`);
      } finally {
        setLoading(false);
      }
    },
    [setUser, loading, currentAccounts]
  );

  const handleAddAccount = () => {
    if (!newAccountKey || !newAccountValue) {
      setError("Both website and profile link are required.");
      return;
    }
    try {
      new URL(newAccountValue);
    } catch (_) {
      if (!newAccountValue.startsWith("http://") && !newAccountValue.startsWith("https://")) {
        setError("Profile link should be a valid URL (e.g., start with https://)");
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
    <Box sx={{ m:0, p:0, display: "flex", flexDirection: "column", alignItems: "center", minHeight: "80vh", paddingTop: "10vh"}}>
        <Box sx={{ display: "flex", alignItems: "center", position: 'relative', width: "100%", justifyContent: "center" }}>
        <IconButton
          sx={{ position: 'absolute', top: 0, left: 0 }}
          onClick={() => navigate(-1)}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600}}>
          Accounts
        </Typography>
        </Box>
        <Grid container spacing={4} sx={{padding: "2vw"}}>
      <Grid item xs={12} md={5}>
        <Typography variant="h6" gutterBottom>
          Your Linked Accounts
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {loading && !accountList.length && (
          <CircularProgress size={24} sx={{ display: "block", margin: "20px auto" }} />
        )}
        {accountList.length > 0 ? (
          <List dense sx={{ bgcolor: "background.paper", borderRadius: 1, boxShadow: 1, p: 0 }}>
            {accountList.map(([key, value], index) => (
              <React.Fragment key={key}>
                <ListItem
                  secondaryAction={
                    <>
                    <Tooltip title="Edit Account">
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleEditAccount(key)}
                        disabled={loading}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Account">
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteAccount(key)}
                        disabled={loading}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    </>
                  }
                >
                  <ListItemText
                    primary={key}
                    secondary={
                      value ? (
                        <Link
                          href={ensureUrlProtocol(value)}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ wordBreak: "break-all" }}
                        >
                          {value}
                        </Link>
                      ) : (
                        <Typography variant="caption" color="textSecondary">
                          No link provided
                        </Typography>
                      )
                    }
                  />
                </ListItem>
                {index < accountList.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          !loading && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              No accounts added yet. Use the form to add some!
            </Typography>
          )
        )}
      </Grid>
      <Grid item xs={12} md={7}>
        <Typography variant="h6" gutterBottom>
          Add a New Account
        </Typography>
        <Box component="form" noValidate autoComplete="off" sx={{ mt: 1 }}>
          <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
            <InputLabel id="account-select-label">Website / Platform</InputLabel>
            <Select
              labelId="account-select-label"
              value={newAccountKey}
              onChange={(event) => setNewAccountKey(event.target.value)}
              label="Website / Platform"
              disabled={loading}
              required
            >
              {topWebsites.map((website) => (
                <MenuItem key={website} value={website}>
                  {website}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Profile URL / Link"
            variant="outlined"
            placeholder="https://..."
            value={newAccountValue}
            onChange={(event) => setNewAccountValue(event.target.value)}
            disabled={loading}
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: <LinkIcon color="action" sx={{ mr: 1 }} />,
            }}
            sx={{ mb: 2 }}
            required
          />
          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              disabled={loading || !newAccountKey || !newAccountValue}
              onClick={handleAddAccount}
              startIcon={<AddLinkIcon />}
            >
              {loading ? "Adding..." : "Add Account"}
            </Button>
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
            )}
          </Box>
        </Box>
      </Grid>
    </Grid>
    </Box>
  );
};

export default Accounts;

