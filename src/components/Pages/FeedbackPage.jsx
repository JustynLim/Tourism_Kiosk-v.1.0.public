import React from "react";
import {FeedbackForm} from "../PageComponents/Feedback/FeedbackForm";

export const FeedbackPage = (props) => {
  return (
    <div>
      <FeedbackForm {...props} />
    </div>
  );
};