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
  const itemsPerPage = 5;

  /* ---------------- MODALS ---------------- */
  const [initiationModalOpen, setInitiationModalOpen] = useState(false);
  const [endModalOpen, setEndModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  /* ---------------- COUNTS ---------------- */
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

  /* ---------------- FETCH WAITLIST ---------------- */
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
    } catch {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ---------------- SEARCH ---------------- */
  const handleSearch = useCallback(async () => {
    if (debouncedSearch.trim().length < 2) {
      setCurrentPage(1);
      activeTab === "Past KYC Calls" ? fetchPastKyc() : fetchWaitlistData();
      return;
    }

    setLoading(true);
    setCurrentPage(1);

    try {
      const res =
        activeTab === "Past KYC Calls"
          ? await searchPastKycCalls(debouncedSearch)
          : await searchKyc(debouncedSearch, activeView);

      setCustomers(res.data || []);
    } catch {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, activeTab, activeView, fetchPastKyc, fetchWaitlistData]);

  /* ---------------- TAB CHANGE ---------------- */
  const handleTabChange = (_, tab) => {
    setActiveTab(tab);
    setSearch("");
    setCurrentPage(1);
    if (tab === "Video KYC Waitlist") setActiveView("live");
  };

  /* ---------------- EFFECTS ---------------- */
  useEffect(() => {
    if (activeTab === "Video KYC Waitlist") {
      fetchCounts();
      fetchWaitlistData();
    } else {
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
        {/* -------- TABS + SEARCH -------- */}
             <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "column",
              md: "row", // ✅ 1024px now becomes single row
            },
            justifyContent: "space-between",
            alignItems: "center",
            // mx: 4,
            gap: 1,
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="standard" // 🔥 remove scrollable
            sx={{
              minHeight: 34,
              "& .MuiTabs-flexContainer": {
                flexWrap: "nowrap",
                gap: 2,
              },
              "& .MuiTabs-indicator": {
                height: 3,
              },
            }}
          >
            <Tab
              value="Video KYC Waitlist"
              label="Video KYC Waitlist"
              icon={<GroupsIcon />}
              iconPosition="start"
              sx={{
                minHeight: 34,
                textTransform: "none",
                flexShrink: 1,
                minWidth: "unset",
                whiteSpace: "wrap",
              }}
            />

            <Tab
              value="Past KYC Calls"
              label="Past KYC Calls"
              icon={<HistoryIcon />}
              iconPosition="start"
              sx={{
                flexDirection: "row",
                gap: "3px",
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
                xs: "100%",
                sm: "100%",
                md: "260px", // fits 1024
              },
              flexShrink: 0, // 🔥 search does NOT shrink
            }}
          />
        </Box>

        <Box my={3} />

        {/* -------- VIDEO KYC -------- */}
        {activeTab === "Video KYC Waitlist" && (
          <>
            <ActionButtons
              activeView={activeView}
              liveCount={liveCount}
              missedCount={missedCount}
              onViewChange={(view) => {
                setActiveView(view);
                setSearch("");
                setCurrentPage(1);
              }}
              onRefresh={() => fetchWaitlistData()}
            />

            {loading ? (
              <Typography align="center">Loading...</Typography>
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

        {/* -------- PAST KYC -------- */}
        {activeTab === "Past KYC Calls" && (
          <>
            <PastKycCallsTable
              data={paginatedCustomers}
              loading={loading}
            />

            <Pagination
              currentPage={currentPage}
              totalItems={customers.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {/* -------- MODALS -------- */}
        {selectedCustomer && (
          <CallInitiationModal
            open={initiationModalOpen}
            customer={selectedCustomer}
            onClose={handleCloseInitiationModal}
            onCloseIconClick={handleCloseIconClick}
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
