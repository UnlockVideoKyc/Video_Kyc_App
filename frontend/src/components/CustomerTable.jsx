import { useEffect, useState, useCallback } from "react";
import PastKycCallsTable from "../pages/AgentDashboard/PastKycCallsTable";

import {
  Box,
  Tabs,
  Tab,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import {
  Groups as GroupsIcon,
  History as HistoryIcon,
  EditNote as EditNoteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

import ActionButtons from "../components/ActionButtons";
import LiveScheduleTable from "./LiveScheduleTable";
import MissedCallsTable from "../components/MissedCallsTable";
import Pagination from "../components/Pagination";
import CallInitiationModal from "../components/CallInitiationModal";
import CallEndModal from "../components/CallEndModal";

import {
  getLiveSchedule,
  getMissedCalls,
  searchKyc,
} from "../api/videoKycWaitlist.api";

import getPastKycCalls from "../api/kyc.api";
import searchPastKycCalls from "../api/pastsearch";

/* ---------------- debounce hook ---------------- */
const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
};

const CustomerTable = () => {
  const [activeTab, setActiveTab] = useState("Video KYC Waitlist");
  const [activeView, setActiveView] = useState("live");

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  /* ✅ MODAL STATES */
  const [initiationModalOpen, setInitiationModalOpen] = useState(false);
  const [endModalOpen, setEndModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  /* COUNTS */
  const [liveCount, setLiveCount] = useState(0);
  const [missedCount, setMissedCount] = useState(0);

  /* ---------------- FETCH COUNTS ---------------- */
  const fetchCounts = useCallback(async () => {
    const [live, missed] = await Promise.all([
      getLiveSchedule(),
      getMissedCalls(),
    ]);
    setLiveCount(live.data?.length ?? 0);
    setMissedCount(missed.data?.length ?? 0);
  }, []);

  /* ---------------- FETCH LIVE / MISSED ---------------- */
  const fetchWaitlistData = useCallback(async () => {
    setLoading(true);
    try {
      const res =
        activeView === "live"
          ? await getLiveSchedule()
          : await getMissedCalls();
      setCustomers(res.data || []);
    } catch {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [activeView]);

  /* ---------------- FETCH PAST KYC ---------------- */
  const fetchPastKyc = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPastKycCalls();
      setCustomers(res.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ---------------- SEARCH ---------------- */

  const handleSearch = useCallback(async () => {
    // ✅ SEARCH CLEARED
    if (debouncedSearch.trim().length < 2) {
      setCurrentPage(1);

      // 🔁 reload correct list
      if (activeTab === "Video KYC Waitlist") {
        fetchWaitlistData();
      } else if (activeTab === "Past KYC Calls") {
        fetchPastKyc();
      }

      return;
    }

    // ✅ SEARCH MODE
    setLoading(true);
    setCurrentPage(1);

    try {
      let res;

      if (activeTab === "Past KYC Calls") {
        res = await searchPastKycCalls(debouncedSearch);
      } else {
        res = await searchKyc(debouncedSearch, activeView);
      }

      setCustomers(res.data || []);
    } catch (err) {
      console.error(err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, activeTab, activeView, fetchWaitlistData, fetchPastKyc]);

  /* ---------------- TAB CHANGE ---------------- */
  const handleTabChange = (_, tab) => {
    setActiveTab(tab);
    setSearch("");
    setCurrentPage(1);

    if (tab === "Video KYC Waitlist") {
      setActiveView("live");
    }
  };

  /* ---------------- EFFECTS ---------------- */
  useEffect(() => {
    if (activeTab === "Video KYC Waitlist") {
      fetchCounts();
      fetchWaitlistData();
    } else if (activeTab === "Past KYC Calls") {
      fetchPastKyc();
    }
  }, [activeTab, fetchCounts, fetchWaitlistData, fetchPastKyc]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  /* ---------------- PAGINATION ---------------- */
  const start = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = customers.slice(start, start + itemsPerPage);

  /* ---------------- MODAL HANDLERS ---------------- */
  const handleOpenInitiationModal = (customer) => {
    setSelectedCustomer(customer);
    setInitiationModalOpen(true);
  };

  const handleCloseInitiationModal = () => {
    setInitiationModalOpen(false);
  };

  const handleCloseIconClick = () => {
    setInitiationModalOpen(false);
    setEndModalOpen(true);
  };

  const handleEndCall = () => {
    setEndModalOpen(false);
  };

  return (
    <div className="card">
      <div className="card-body">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-evenly"
          gap={2}
          flexWrap="wrap"
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTabs-flexContainer": {
                gap: 3,
              },
            }}
          >
            <Tab
              value="Video KYC Waitlist"
              label="Video KYC Waitlist"
              icon={<GroupsIcon />}
              iconPosition="start"
              sx={{
                flexDirection: "row",
                gap: "6px",
                textTransform: "none",
                minHeight: 34,
                "& .MuiTab-iconWrapper": {
                  marginBottom: "0 !important",
                },
              }}
            />

            <Tab
              value="Past KYC Calls"
              label="Past KYC Calls"
              icon={<HistoryIcon />}
              iconPosition="start"
              sx={{
                flexDirection: "row",
                gap: "6px",
                textTransform: "none",
                minHeight: 34,
                "& .MuiTab-iconWrapper": {
                  marginBottom: "0 !important",
                },
              }}
            />

            <Tab
              value="Draft List"
              label="Draft List"
              icon={<EditNoteIcon />}
              iconPosition="start"
              sx={{
                flexDirection: "row",
                textTransform: "none",
                minHeight: 34,
                "& .MuiTab-iconWrapper": {
                  marginBottom: "0 !important",
                },
              }}
            />
          </Tabs>

          {/* Search */}
          <TextField
            size="small"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              width: {
                xs: "400px", // 📱 mobile
                sm: "240px", // tablet
                md: "280px", // desktop
              },
              mt: {
                xs: 1,
                sm: 0,
              },
            }}
          />
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: "divider", my: 3 }} />

        {activeTab === "Video KYC Waitlist" && (
          <>
            <ActionButtons
              activeView={activeView}
              onViewChange={(view) => {
                setActiveView(view);
                setSearch("");
                setCurrentPage(1);
              }}
              liveCount={liveCount}
              missedCount={missedCount}
              onRefresh={() => {
                setSearch("");
                setCurrentPage(1);
                fetchWaitlistData();
              }}
            />

            {loading ? (
              <Typography align="center">Loading...</Typography>
            ) : customers.length === 0 ? (
              <Box textAlign="center" py={5}>
                <Typography colSpan={6} align="center">
                  No records found
                </Typography>
              </Box>
            ) : activeView === "live" ? (
              <LiveScheduleTable
                customers={paginatedCustomers}
                onInitiateCall={handleOpenInitiationModal}
              />
            ) : (
              <MissedCallsTable
                customers={paginatedCustomers}
                onInitiateCall={handleOpenInitiationModal}
              />
            )}

            <Pagination
              currentPage={currentPage}
              totalItems={customers.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {activeTab === "Past KYC Calls" && (
          <PastKycCallsTable data={customers} loading={loading} />
        )}

        {/* MODALS */}
        {selectedCustomer && (
          <CallInitiationModal
            open={initiationModalOpen}
            onClose={handleCloseInitiationModal}
            onCloseIconClick={handleCloseIconClick}
            customer={selectedCustomer}
          />
        )}

        <CallEndModal
          open={endModalOpen}
          onClose={() => setEndModalOpen(false)}
          onConfirm={handleEndCall}
        />
      </div>
    </div>
  );
};

export default CustomerTable;
