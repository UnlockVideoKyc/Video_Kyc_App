
// import React, { useState, useEffect } from 'react';
// import { fetchDashboardData } from "../api/dashboard.api";
// import { 
//   Box, 
//   Card, 
//   CardContent, 
//   useMediaQuery,
//   useTheme
// } from '@mui/material';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import { Pie } from 'react-chartjs-2';
// import { ArrowDropDown as ChevronDown } from '@mui/icons-material';

// ChartJS.register(ArcElement, Tooltip, Legend);

// const StatsChart = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   // ✅ FIX 1: define states FIRST
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [selectedOption, setSelectedOption] = useState("Today");

//   // ✅ FIX 2: missing state (this was crashing the component)
//   const [chartValues, setChartValues] = useState({
//     approved: 0,
//     rejected: 0,
//     discrepancy: 0,
//   });

//   // ✅ FIX 3: useEffect AFTER states
//   useEffect(() => {
//     const loadDashboard = async () => {
//       try {
//         let range = "today";
//         if (selectedOption === "This Week") range = "week";
//         if (selectedOption === "This Month") range = "month";

//         const res = await fetchDashboardData(range);

//         setChartValues({
//           approved: res?.data?.approved ?? 0,
//           rejected: res?.data?.rejected ?? 0,
//           discrepancy: res?.data?.discrepancy ?? 0,
//         });
//       } catch (error) {
//         console.error("Dashboard error:", error);
//       }
//     };

//     loadDashboard();
//   }, [selectedOption]);

//   // 🔹 SAME chartData structure
//   const chartData = {
//     labels: ["Approved", "Rejected", "Discrepancy"],
//     datasets: [{
//       data: [
//         chartValues.approved,
//         chartValues.rejected,
//         chartValues.discrepancy
//       ],
//       backgroundColor: ["#28a745", "#dc3545", "#ffc107"],
//       borderWidth: 0
//     }]
//   };

//   const total = chartData.datasets[0].data.reduce(
//     (sum, item) => sum + item,
//     0
//   );

//   const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
//   const selectOption = (option) => {
//     setSelectedOption(option);
//     setDropdownOpen(false);
//   };

//   // 🔽 EVERYTHING BELOW IS YOUR ORIGINAL JSX + CSS
//   return (
//     <Card sx={{ 
//       height: '100%',
//       boxShadow: 'none',
//       border: '1px solid #e0e0e0',
//       borderRadius: '8px'
//     }}>
//       <CardContent sx={{ padding: '16px' }}>
//         <Box sx={{ 
//           display: 'flex', 
//           justifyContent: 'space-between', 
//           alignItems: 'center', 
//           marginBottom: '16px'
//         }}>
//           <Box component="h5" sx={{ 
//             margin: 0,
//             fontSize: '1.25rem',
//             fontWeight: 500,
//             lineHeight: 1.2,
//             color: '#212529'
//           }}>
//             Work Dashboard
//           </Box>

//           <Box sx={{ position: 'relative' }}>
//             <button 
//               onClick={toggleDropdown}
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '4px',
//                 border: '1px solid #dee2e6',
//                 color: '#212529',
//                 backgroundColor: 'transparent',
//                 padding: '0.25rem 0.75rem',
//                 borderRadius: '4px',
//                 fontSize: '14px',
//                 cursor: 'pointer'
//               }}
//             >
//               {selectedOption}
//               <ChevronDown fontSize="small" />
//             </button>

//             {dropdownOpen && (
//               <div style={{
//                 position: 'absolute',
//                 right: 0,
//                 top: '100%',
//                 minWidth: '120px',
//                 backgroundColor: '#fff',
//                 border: '1px solid #dee2e6',
//                 borderRadius: '4px',
//                 zIndex: 1000,
//                 marginTop: '4px',
//                 boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//               }}>
//                 {["Today", "This Week", "This Month"].map(option => (
//                   <button
//                     key={option}
//                     onClick={() => selectOption(option)}
//                     style={{
//                       width: '100%',
//                       textAlign: 'left',
//                       padding: '0.5rem 1rem',
//                       fontSize: '14px',
//                       backgroundColor: selectedOption === option ? '#f8f9fa' : 'transparent',
//                       border: 'none',
//                       cursor: 'pointer',
//                       color: '#212529'
//                     }}
//                   >
//                     {option}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </Box>
//         </Box>

//         <hr style={{
//           marginTop: 0,
//           marginBottom: '16px',
//           border: 0,
//           borderTop: '1px solid',
//           borderColor: 'divider'
//         }} />

//         {/* <Box sx={{ height: isMobile ? '220px' : '280px', position: 'relative' }}> */}
//  {/* <Pie
//   data={chartData}
//   options={{
//     maintainAspectRatio: false,
//     cutout: isMobile ? '60%' : '50%',
//     plugins: {
//       legend: {
//         display: false
//       },
//       tooltip: {
//         enabled: true,
//         callbacks: {
//           label: function (context) {
//             const label = context.label || '';
//             const value = context.parsed || 0;
//             return `${label}: ${value}`;
//           }
//         },
//         backgroundColor: '#212529',
//         titleColor: '#fff',
//         bodyColor: '#fff',
//         padding: 10,
//         cornerRadius: 6
//       }
//     },
//     hover: {
//       mode: 'nearest',
//       intersect: true
//     }
//   }}
// />


//           <div style={{
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             textAlign: 'center'
//           }}>
//             <h2 style={{ margin: 0 }}>{total}</h2>
//             <small>{selectedOption}</small>
//           </div>
//         </Box> */}

//         {/* Footer legend */}
// <Box sx={{ 
//   display: 'flex',
//   justifyContent: 'space-around',
//   marginTop: '16px',
//   paddingTop: '16px',
//   borderTop: '1px solid #e0e0e0',
//   flexWrap: isMobile ? 'wrap' : 'nowrap',
//   gap: isMobile ? '8px' : 0
// }}>
//   {chartData.labels.map((label, index) => (
//     <Box 
//       key={index}
//       sx={{ 
//         display: 'flex',
//         alignItems: 'center'
//       }}
//     >
//       <div
//         style={{
//           width: '12px',
//           height: '12px',
//           borderRadius: '50%',
//           backgroundColor: chartData.datasets[0].backgroundColor[index],
//           marginRight: '8px'
//         }}
//       />
//       <small style={{ marginRight: '4px', fontSize: '14px' }}>
//         {label}:
//       </small>
//       <small style={{ fontWeight: 'bold', fontSize: '14px' }}>
//         {chartData.datasets[0].data[index]}
//       </small>
//     </Box>
//   ))}
// </Box>

//       </CardContent>
//     </Card>
//   );
// };

// export default StatsChart;



import React, { useState, useEffect } from 'react';
import { fetchDashboardData } from "../api/dashboard.api";
import { 
  Box, 
  Card, 
  CardContent, 
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { ArrowDropDown as ChevronDown } from '@mui/icons-material';

ChartJS.register(ArcElement, Tooltip, Legend);

const StatsChart = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Today");
  const [chartValues, setChartValues] = useState({
    approved: 0,
    rejected: 0,
    discrepancy: 0,
  });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        let range = "today";
        if (selectedOption === "This Week") range = "week";
        if (selectedOption === "This Month") range = "month";

        const res = await fetchDashboardData(range);

        setChartValues({
          approved: res?.data?.approved ?? 0,
          rejected: res?.data?.rejected ?? 0,
          discrepancy: res?.data?.discrepancy ?? 0,
        });
      } catch (error) {
        console.error("Dashboard error:", error);
      }
    };

    loadDashboard();
  }, [selectedOption]);

  const chartData = {
    labels: ["Approved", "Rejected", "Discrepancy"],
    datasets: [{
      data: [
        chartValues.approved,
        chartValues.rejected,
        chartValues.discrepancy
      ],
      backgroundColor: ["#28a745", "#dc3545", "#ffc107"],
      borderWidth: 0,
      hoverOffset: 10
    }]
  };

  const total = chartData.datasets[0].data.reduce(
    (sum, item) => sum + item,
    0
  );

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
        {/* Header */}
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
            color: '#212529'
          }}>
            Work Dashboard
          </Box>

          <Box sx={{ position: 'relative' }}>
            <button 
              onClick={toggleDropdown}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                border: '1px solid #dee2e6',
                background: 'transparent',
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
              <div style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                minWidth: '120px',
                backgroundColor: '#fff',
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                marginTop: '4px',
                zIndex: 10
              }}>
                {["Today", "This Week", "This Month"].map(option => (
                  <button
                    key={option}
                    onClick={() => selectOption(option)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 1rem',
                      textAlign: 'left',
                      border: 'none',
                      background: selectedOption === option ? '#f8f9fa' : 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </Box>
        </Box>

        <hr style={{ marginBottom: '16px' }} />

        {/* Pie Chart */}
        <Box sx={{ height: isMobile ? '220px' : '280px', position: 'relative' }}>
          <Pie
            data={chartData}
            options={{
              maintainAspectRatio: false,
              cutout: isMobile ? '60%' : '50%',
              plugins: {
                legend: { display: false },
                tooltip: {
                  enabled: true,
                  callbacks: {
                    label: (context) => `${context.label}: ${context.parsed}`
                  }
                }
              }
            }}
          />

          {/* Center text */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: 0 }}>{total}</h2>
            <small>{selectedOption}</small>
          </div>
        </Box>

        {/* ✅ FOOTER (Approved / Rejected / Discrepancy) */}
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'space-around',
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid #e0e0e0',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          gap: isMobile ? '8px' : 0
        }}>
          {chartData.labels.map((label, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: chartData.datasets[0].backgroundColor[index],
                marginRight: '8px'
              }} />
              <small style={{ marginRight: '4px' }}>{label}:</small>
              <small style={{ fontWeight: 'bold' }}>
                {chartData.datasets[0].data[index]}
              </small>
            </Box>
          ))}
        </Box>

      </CardContent>
    </Card>
  );
};

export default StatsChart;
