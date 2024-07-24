import React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export const ReviewRequest = ({ customer, href_campaign }) => {
  return (
    <Html>
      <Head />
      <Preview>Your insights matter: Share your experience with us</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Feedback Request</Heading>
          <Section>
            <Text style={text}>Dear {customer.name},</Text>
            <Text style={text}>
              We hope this message finds you well. As a valued customer, your
              opinion is incredibly important to us. We're reaching out to
              kindly request your feedback on your recent experience with our
              services.
            </Text>
            <Text style={text}>
              Your insights will help us understand what we're doing right and
              where we can improve. It'll only take a few minutes of your time,
              but it will make a significant impact on our ability to serve you
              and others better.
            </Text>
            <Button px={20} py={12} style={button} href={href_campaign}>
              Share Your Feedback
            </Button>
            <Text style={smallText}>
              Your input is crucial in shaping our services. We appreciate your
              time and look forward to hearing from you.
            </Text>
            <Text style={smallText}>
              If you have any questions or need assistance, please don't
              hesitate to reach out. We're here to help.
            </Text>
            <Text style={signature}>
              Best regards,
              <br />
              The [Your Company] Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f4f4f5",
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  width: "580px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

const heading = {
  fontSize: "28px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#1f2937",
  marginBottom: "24px",
  textAlign: "center",
};

const text = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#4b5563",
  marginBottom: "24px",
};

const button = {
  backgroundColor: "#3b82f6",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center",
  display: "inline-block",
  width: "auto",
  padding: "12px 24px",
  margin: "0 auto 24px",
  transition: "background-color 0.3s ease",
};

const smallText = {
  fontSize: "14px",
  lineHeight: "1.5",
  color: "#6b7280",
  marginTop: "24px",
};

const signature = {
  fontSize: "14px",
  lineHeight: "1.5",
  color: "#4b5563",
  marginTop: "32px",
  fontStyle: "italic",
};
