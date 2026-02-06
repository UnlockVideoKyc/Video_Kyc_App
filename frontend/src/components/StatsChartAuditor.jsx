import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { 
  ArrowDropDown as ChevronDown
} from '@mui/icons-material';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const StatsChartAuditor = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("all");
  
  const chartData = {
    labels: ["Approved", "Rejected", "Discrepancy"],
    datasets: [{
      data: [10, 2, 10],
      backgroundColor: ["#28a745", "#dc3545", "#ffc107"],
      borderWidth: 0
    }]
  };

  const total = chartData.datasets[0].data.reduce((sum, item) => sum + item, 0);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const selectOption = (option) => {
    setSelectedOption(option);
    setDropdownOpen(false);
  };

  return (
    <Card sx={{ 
      height: '100%',
      boxShadow: 'none',
      border: '1px solid #e0e0e0',
      borderRadius: '8px'
    }}>
      <CardContent sx={{ padding: '16px' }}>
        {/* Header with title and dropdown */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '16px'
        }}>
          <Box component="h5" sx={{ 
            margin: 0,
            fontSize: '1.25rem',
            fontWeight: 500,
            lineHeight: 1.2,
            color: '#212529'
          }}>
            Agent Dashboard
          </Box>
          <Box sx={{ position: 'relative' }}>
            <button 
              onClick={toggleDropdown}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                border: '1px solid #dee2e6',
                color: '#212529',
                backgroundColor: 'transparent',
                padding: '0.25rem 0.75rem',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              {selectedOption}
              <ChevronDown fontSize="small" />
            </button>
            
            {dropdownOpen && (
              <div 
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  minWidth: '120px',
                  backgroundColor: '#fff',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  zIndex: 1000,
                  marginTop: '4px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <button 
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.5rem 1rem',
                    fontSize: '14px',
                    backgroundColor: selectedOption === "Today" ? '#f8f9fa' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#212529'
                  }}
                  onClick={() => selectOption("Today")}
                >
                  Today
                </button>
                <button 
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.5rem 1rem',
                    fontSize: '14px',
                    backgroundColor: selectedOption === "This Week" ? '#f8f9fa' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#212529'
                  }}
                  onClick={() => selectOption("This Week")}
                >
                  This Week
                </button>
                <button 
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.5rem 1rem',
                    fontSize: '14px',
                    backgroundColor: selectedOption === "This Month" ? '#f8f9fa' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#212529'
                  }}
                  onClick={() => selectOption("This Month")}
                >
                  This Month
                </button>
              </div>
            )}
          </Box>
        </Box>

        <hr style={{ 
          marginTop: 0,
          marginBottom: '16px',
          border: 0,
          borderTop: '1px solid ',
          borderColor: 'divider'
        }} />

        {/* Enlarged Pie Chart */}
        <Box sx={{ 
          height: isMobile ? '220px' : '280px', 
          position: 'relative'
        }}>
          <Pie
            data={chartData}
            options={{
              maintainAspectRatio: false,
              cutout: isMobile ? '60%' : '50%',
              plugins: {
                legend: {
                  display: false
                },
                tooltip: {
                  enabled: false
                }
              }
            }}
          />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <h2 style={{ 
              margin: 0,
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#212529'
            }}>{total}</h2>
            <small style={{ 
              fontSize: '14px',
              color: '#6c757d'
            }}>{selectedOption}</small>
          </div>
        </Box>

        {/* Legend */}
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'space-around',
          marginTop: '16px',
          paddingTop: '16px',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          gap: isMobile ? '8px' : 0
        }}>
          {chartData.labels.map((label, index) => (
            <Box 
              key={index} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                flex: isMobile ? '1 0 40%' : 'none'
              }}
            >
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: chartData.datasets[0].backgroundColor[index],
                marginRight: '8px'
              }} />
              <small style={{ marginRight: '4px', fontSize: '14px' }}>{label}:</small>
              <small style={{ fontWeight: 'bold', fontSize: '14px' }}>{chartData.datasets[0].data[index]}</small>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsChartAuditor;