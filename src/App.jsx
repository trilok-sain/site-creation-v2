import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import * as paths from "./routes";
import FetchLocation from "./pages/FetchLocation";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/drag" element={<Drag/>}/> */}
        {/* <Route path="/carousel" element={<ShowCarouselP/>}/> */}

        <Route path="/" element={<paths.NewAddSite/>}/>
        <Route path="/fetch-location" element={<FetchLocation/>}/>
        <Route path="additional-info/:siteId" element={<paths.AdditionalInfo />} />
        <Route path="/login" element={<paths.Login />} />
        <Route path="/" element={<paths.Layout />}>
          <Route path="all" element={<paths.AllData />} />
          <Route path="approval-list" element={<paths.ApprovalList/>} />
          <Route path="pending" element={<paths.Pending />} />
          <Route path="penAdmSupAdmList" element={<paths.PenAdmSupAdmList />} />
          <Route path="approve" element={<paths.Approve />} />
          <Route path="rejected" element={<paths.Rejected />} />
          <Route path="view-details/:siteId" element={<paths.ViewDetails />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
