import CustomerTable from "../../components/CustomerTable";
import StatsChart from "../../components/StatsChart"



const WorkDashboard = () => {
  return (
    <>
    <div className="row">
      <div className="col-md-4 mt-5">
        <StatsChart />
      </div>
      <div className="col-md-8 mt-5">
        <CustomerTable />
      </div>
    </div>
    
    </>

    
  )
}

export default WorkDashboard;