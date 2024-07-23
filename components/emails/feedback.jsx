import * as React from "react";

export const Feedback = ({
  feedback,
  customerName = "",
  customerPhoneNumber = "",
  rating,
  selectedReasons,
  source,
  customer_id,
}) => (
  <div>
    <h1>Feedback, {feedback}!</h1>
    
    {source === "qr_code" && (
      <div>
        <h2>Customer Name, {customerName}!</h2>
        <h3>Customer Phone Number, {customerPhoneNumber}!</h3>
      </div>
    )}

    {source === "campaign" && (
      <div>
        <h2>Customer ID, {customer_id}!</h2>
      </div>
    )}

    <h4>Rating, {rating}!</h4>
    <h5>Reasons Array, {selectedReasons}!</h5>
    <h6>Source, {source}!</h6>
  </div>
);
