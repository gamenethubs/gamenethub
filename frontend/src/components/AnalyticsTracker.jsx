// src/components/AnalyticsTracker.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// ⭐ NEW IMPORT ⭐
import ReactGA from 'react-ga4'; 

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // This sends a 'page_view' event to GA4 whenever the URL changes
    ReactGA.send({ 
      hitType: "pageview",  
      page: location.pathname + location.search 
    });
  }, [location.pathname, location.search]);

  return null; // Doesn't render any UI
};

export default AnalyticsTracker;