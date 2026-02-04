import { useState } from "react";
import VideoCallAgentSection from "../../components/VideoCallAgentSection"
import VideoCallCustomerSection from "../../components/VideoCallCustomerSection"
import VerificationChecklist from "../../components/VerificationChecklist"
import HorizontalStepper from "../../components/HorizontalStepper"
import { useSelector } from "react-redux"; 

const CheckLocationVerify = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenToggle = (fullScreenState) => {
    setIsFullScreen(fullScreenState);
  };

  //! via redux
  const customer = useSelector(
    (state) => state.customer.activeCustomer
  );
  console.log("Redux customer:", customer);

  return (
    <>
      <div className="row">
        {/* <HorizontalStepper/> */}
        <div className={isFullScreen ? "col-md-9 mt-5" : "col-md-3 mt-5"}>
          <VideoCallAgentSection customer={customer} onFullScreenToggle={handleFullScreenToggle}/>
        </div>
        {!isFullScreen && (
          <div className="col-md-3 mt-5">
            <VideoCallCustomerSection/>
          </div>
        )}
        <div className={isFullScreen ? "col-md-3 mt-5" : "col-md-6 mt-5"}>
          <VerificationChecklist/>
        </div>
      </div>
    </>
  )
}

export default CheckLocationVerify;