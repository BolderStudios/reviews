import * as React from "react";

export const Feedback = ({
  feedback,
  customerName,
  customerPhoneNumber,
  rating,
  selectedReasons,
}) => (
  <div>
    <h1>Feedback, {feedback}!</h1>
    <h2>Customer Name, {customerName}!</h2>
    <h3>Customer Phone Number, {customerPhoneNumber}!</h3>
    <h4>Rating, {rating}!</h4>
    <h5>Reasons Array, {selectedReasons}!</h5>
  </div>
);
