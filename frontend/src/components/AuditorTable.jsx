import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Box,
    useMediaQuery,
    useTheme,
    InputAdornment,
    TextField,
    Typography,
    Button,
    Select,
    MenuItem,
    FormControl,
    Chip
} from "@mui/material";
import {
    Search as SearchIcon,
    FilterList as FilterListIcon
} from "@mui/icons-material";
import Pagination from "../components/Pagination";

const AuditorTable = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [currentPage, setCurrentPage] = useState(1);
    const [activeView, setActiveView] = useState("pending");
    const [filterValue, setFilterValue] = useState("all");
    const navigate = useNavigate();


    // Mock data for Pending view
    const pendingCustomers = [
        {
            id: 1,
            dateOfVerification: "6/13/2025",
            timeOfVerification: "5:28:38 PM",
            clientName: "DigiKhata",
            customerName: "Riddhi Jani",
            vcpId: "255511",
            duration: "00:03:50",
            assignedAgent: "riddhi.jani@paypointindia.net",
            status: "Approved",
        },
        {
            id: 2,
            dateOfVerification: "6/13/2025",
            timeOfVerification: "4:15:22 PM",
            clientName: "DigiKhata",
            customerName: "Rohit Hait",
            vcpId: "255512",
            duration: "00:05:30",
            assignedAgent: "rohit.hait@paypointindia.net",
            status: "Rejected",
        },
        {
            id: 3,
            dateOfVerification: "6/13/2025",
            timeOfVerification: "3:45:10 PM",
            clientName: "DigiKhata",
            customerName: "Tushar Sharma",
            vcpId: "255513",
            duration: "00:02:15",
            assignedAgent: "tushar.sharma@paypointindia.net",
            status: "Approved",
        },
        {
            id: 4,
            dateOfVerification: "6/13/2025",
            timeOfVerification: "2:30:55 PM",
            clientName: "DigiKhata",
            customerName: "Priya Singh",
            vcpId: "255514",
            duration: "00:04:20",
            assignedAgent: "priya.singh@paypointindia.net",
            status: "Rejected",
        },
        {
            id: 5,
            dateOfVerification: "6/13/2025",
            timeOfVerification: "1:20:15 PM",
            clientName: "DigiKhata",
            customerName: "Amit Kumar",
            vcpId: "255515",
            duration: "00:06:10",
            assignedAgent: "amit.kumar@paypointindia.net",
            status: "Approved",
        }
    ];

    // Mock data for Completed view
    const completedCustomers = [
        {
            id: 1,
            dateOfVerification: "6/12/2025",
            timeOfVerification: "3:15:45 PM",
            clientName: "DigiKhata",
            customerName: "Rahul Verma",
            vcpId: "255501",
            duration: "00:04:30",
            assignedAgent: "rahul.verma@paypointindia.net",
            status: "Approved",
        },
        {
            id: 2,
            dateOfVerification: "6/12/2025",
            timeOfVerification: "2:45:20 PM",
            clientName: "DigiKhata",
            customerName: "Sneha Patel",
            vcpId: "255502",
            duration: "00:03:15",
            assignedAgent: "sneha.patel@paypointindia.net",
            status: "Approved",
        },
        {
            id: 3,
            dateOfVerification: "6/12/2025",
            timeOfVerification: "1:30:10 PM",
            clientName: "DigiKhata",
            customerName: "Vikram Shah",
            vcpId: "255503",
            duration: "00:05:45",
            assignedAgent: "vikram.shah@paypointindia.net",
            status: "Rejected",
        }
    ];

    const handleViewChange = (view) => {
        setActiveView(view);
    };

    const handleFilterChange = (event) => {
        setFilterValue(event.target.value);
    };

    // Get current customers based on active view
    const getCurrentCustomers = () => {
        return activeView === "pending" ? pendingCustomers : completedCustomers;
    };

    // Get total items count based on active view
    const getTotalItems = () => {
        return activeView === "pending" ? pendingCustomers.length : completedCustomers.length;
    };

    // Get status chip styling
    const getStatusChipStyles = (status) => {
        if (status === "Approved") {
            return {
                backgroundColor: 'rgba(1, 125, 28, 0.1)',
                color: '#017D1C',
                fontWeight: 500,
                fontSize: '12px',
                height: '22px',
                borderRadius: '4px'
            };
        } else if (status === "Rejected") {
            return {
                backgroundColor: 'rgba(241, 43, 1, 0.1)',
                color: '#F12B01',
                fontWeight: 500,
                fontSize: '12px',
                height: '22px',
                borderRadius: '4px'
            };
        }
        return {};
    };

    return (
        <div className="card">
            <div className="card-body">
                {/* Header */}
                <Box sx={{ mb: 2 }}>
                    <Typography
                        variant="h5"
                        component="h1"
                        sx={{
                            fontWeight: 600,
                            color: '#181818',
                            fontSize: '20px',
                            mb: 2
                        }}
                    >
                        KYC Verification Queue
                    </Typography>
                    {/* Separator Line */}
                    <Box sx={{ borderBottom: '1px solid #181818', mb: 3 }} />
                </Box>

                {/* Action Buttons, Filter and Search - Responsive */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 2, sm: 2 },
                    mb: 3
                }}>
                    {/* Left side: Pending/Completed buttons and Filter */}
                    <Box sx={{
                        display: 'flex',
                        gap: '12px',
                        width: { xs: '100%', sm: 'auto' },
                        alignItems: 'center',
                        flexWrap: { xs: 'wrap', sm: 'nowrap' }
                    }}>
                        {/* View Buttons */}
                        <Box sx={{ display: 'flex', gap: '8px' }}>
                            <Button
                                variant={activeView === "pending" ? "contained" : "outlined"}
                                onClick={() => handleViewChange("pending")}
                                sx={{
                                    textTransform: 'none',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    padding: '8px 20px',
                                    borderRadius: '6px',
                                    backgroundColor: activeView === "pending" ? '#1C43A6' : 'transparent',
                                    color: activeView === "pending" ? '#fff' : '#1C43A6',
                                    borderColor: '#1C43A6',
                                    '&:hover': {
                                        backgroundColor: activeView === "pending" ? '#163a8f' : 'rgba(28, 67, 166, 0.04)',
                                        borderColor: '#1C43A6',
                                    }
                                }}
                            >
                                Pending
                            </Button>
                            <Button
                                variant={activeView === "completed" ? "contained" : "outlined"}
                                onClick={() => handleViewChange("completed")}
                                sx={{
                                    textTransform: 'none',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    padding: '8px 20px',
                                    borderRadius: '6px',
                                    backgroundColor: activeView === "completed" ? '#1C43A6' : 'transparent',
                                    color: activeView === "completed" ? '#fff' : '#1C43A6',
                                    borderColor: '#1C43A6',
                                    '&:hover': {
                                        backgroundColor: activeView === "completed" ? '#163a8f' : 'rgba(28, 67, 166, 0.04)',
                                        borderColor: '#1C43A6',
                                    }
                                }}
                            >
                                Completed
                            </Button>
                        </Box>

                        {/* Filter Dropdown */}
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select
                                value={filterValue}
                                onChange={handleFilterChange}
                                displayEmpty
                                startAdornment={
                                    <InputAdornment position="start">
                                        <FilterListIcon sx={{ fontSize: '20px', color: '#6c757d' }} />
                                    </InputAdornment>
                                }
                                sx={{
                                    height: '40px',
                                    fontSize: '14px',
                                    '& .MuiSelect-select': {
                                        paddingLeft: '8px'
                                    },
                                    '& fieldset': {
                                        borderColor: '#dee2e6',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#1C43A6',
                                    }
                                }}
                            >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="approved">Approved</MenuItem>
                                <MenuItem value="rejected">Rejected</MenuItem>
                                <MenuItem value="today">Today</MenuItem>
                                <MenuItem value="thisWeek">This Week</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Right side: Search */}
                    <Box sx={{
                        width: { xs: '100%', sm: '240px' }
                    }}>
                        <TextField
                            variant="outlined"
                            placeholder="Search customers..."
                            size="small"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#6c757d' }} />
                                    </InputAdornment>
                                ),
                                sx: {
                                    height: '40px',
                                    '& input': {
                                        padding: '8px 8px 8px 0',
                                        fontSize: '14px'
                                    }
                                }
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    paddingLeft: '12px',
                                    '& fieldset': {
                                        borderColor: '#dee2e6',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#1C43A6',
                                    },
                                }
                            }}
                        />
                    </Box>
                </Box>

                {/* Table using standard HTML table structure */}
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date Of Verification</th>
                                <th>Client Name</th>
                                <th>Customer Name</th>
                                <th>VCIP ID</th>
                                <th>Duration</th>
                                <th>Assigned Agent</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getCurrentCustomers().map((customer) => (
                                <tr key={customer.id}>
                                    <td>
                                        <div>
                                            <div style={{ fontWeight: 700 }}>{customer.dateOfVerification}</div>
                                            <div style={{ color: '#6c757d', fontSize: '13px', fontWeight: 600 }}>
                                                {customer.timeOfVerification}
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ fontWeight: 700 }}>{customer.clientName}</td>
                                    <td style={{ fontWeight: 700 }}>{customer.customerName}</td>
                                    <td style={{ fontWeight: 700 }}>{customer.vcpId}</td>
                                    <td style={{ fontWeight: 700 }}>{customer.duration}</td>
                                    <td style={{ fontWeight: 700 }}>{customer.assignedAgent}</td>
                                    <td>
                                        <Chip
                                            label={customer.status}
                                            size="small"
                                            sx={getStatusChipStyles(customer.status)}
                                        />
                                    </td>
                                    <td>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            sx={{
                                                textTransform: "none",
                                                backgroundColor: "#1C43A6",
                                                "&:hover": { backgroundColor: "#163a8f" },
                                                fontSize: "12px"
                                            }}
                                             onClick={() => navigate("/final-report", { state: { showExtra: true } })}
                                        >
                                            View
                                        </Button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalItems={getTotalItems()}
                    itemsPerPage={25}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
        </div>
    );
};

export default AuditorTable;