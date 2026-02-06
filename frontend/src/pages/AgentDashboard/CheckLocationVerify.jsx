import { useState } from "react";
import VideoCallAgentSection from "../../components/VideoCallAgentSection"
import VideoCallCustomerSection from "../../components/VideoCallCustomerSection"
import VerificationChecklist from "../../components/VerificationChecklist"
import HorizontalStepper from "../../components/HorizontalStepper"

const CheckLocationVerify = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenToggle = (fullScreenState) => {
    setIsFullScreen(fullScreenState);
  };

  return (
    <>
      <div className="row">
        {/* <HorizontalStepper/> */}
        <div className={isFullScreen ? "col-md-9 mt-5" : "col-md-3 mt-5"}>
          <VideoCallAgentSection onFullScreenToggle={handleFullScreenToggle}/>
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