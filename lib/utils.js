// lib/utils.js

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const test = {
  sentimentLabel: "Positive",
  summary:
    "Michael Alvarez, known as 'the Wolf', offers transformative fitness coaching with proven results in both workout routines and nutrition guidance.",
  peopleLove: [
    "Serious workout regimen",
    "Comprehensive fitness approach",
    "Visible body transformation",
  ],
  peopleHate: [],
  peopleDontLike: [],
  peoplesPains: [],
  reviewTopics: [
    { topic: "Workout", count: 2 },
    { topic: "Results", count: 2 },
    { topic: "Nutrition", count: 1 },
    { topic: "Transformation", count: 1 },
  ],
  highlightedWords: [
    { name: "serious workout", sentiment: "Positive" },
    { name: "proven results", sentiment: "Positive" },
    { name: "transformed", sentiment: "Positive" },
    { name: "amazing body", sentiment: "Positive" },
  ],
  needsImprovement: [],
  businessInsights: {
    customerExperience: {
      strengths: [
        "Effective workouts",
        "Nutritional guidance",
        "Body transformation",
      ],
      weaknesses: [],
    },
    staffMentions: [
      {
        name: "Michael Alvarez",
        context: "Highly effective fitness coach",
        sentiment: "Positive",
      },
    ],
    productServiceFeedback: [
      {
        item: "Workout routine",
        feedback: "Serious and effective",
        sentiment: "Positive",
      },
      {
        item: "Nutrition plan",
        feedback: "Contributes to transformation",
        sentiment: "Positive",
      },
    ],
    competitiveInsights: {
      advantages: [
        {
          advantage: "Proven results",
          context: "proven results from a workout routine to nutrition",
        },
      ],
      disadvantages: [],
    },
    returnLikelihood: {
      indication: "Likely",
      basedOn: "*Proven results* and *visible transformation*",
    },
  },
  businessSpecificCategories: [
    {
      name: "Training Quality",
      positiveMentions: 1,
      positiveContexts: [
        "If you are looking for a serious workout Michael Alvarez the Wolf is the person",
      ],
      negativeMentions: 0,
      negativeContexts: [],
      mixedMentions: 0,
      mixedContexts: [],
      categorySpecificKeywords: [
        { keyword: "Serious workout regimen", sentiment: "Positive" },
      ],
      context:
        "The review emphasizes the high-quality, intense training provided",
    },
    {
      name: "Results",
      positiveMentions: 2,
      positiveContexts: [
        "proven results from a workout routine to nutrition",
        "proven results each time",
      ],
      negativeMentions: 0,
      negativeContexts: [],
      mixedMentions: 0,
      mixedContexts: [],
      categorySpecificKeywords: [
        { keyword: "Consistent proven results", sentiment: "Positive" },
        { keyword: "Visible body transformation", sentiment: "Positive" },
      ],
      context:
        "The review repeatedly mentions proven results and visible transformation",
    },
    {
      name: "Service Quality",
      positiveMentions: 1,
      positiveContexts: [
        "You will be transformed to a new person with amazing body",
      ],
      negativeMentions: 0,
      negativeContexts: [],
      mixedMentions: 0,
      mixedContexts: [],
      categorySpecificKeywords: [
        { keyword: "Transformative fitness coaching", sentiment: "Positive" },
      ],
      context: "The review highlights the transformative nature of the service",
    },
    {
      name: "Staff Expertise",
      positiveMentions: 1,
      positiveContexts: ["Michael Alvarez the Wolf is the person"],
      negativeMentions: 0,
      negativeContexts: [],
      mixedMentions: 0,
      mixedContexts: [],
      categorySpecificKeywords: [
        { keyword: "Expert fitness coach", sentiment: "Positive" },
      ],
      context:
        "The review specifically mentions Michael Alvarez as an expert trainer",
    },
  ],
  detailedSentimentAnalysis: {
    positiveAspects: [
      {
        aspect: "Effective training",
        detail: "*Serious workout* provided by Michael Alvarez",
        impact: "High",
      },
      {
        aspect: "Proven results",
        detail: "*Proven results* in both *workout routine and nutrition*",
        impact: "High",
      },
      {
        aspect: "Body transformation",
        detail: "*Transformed to a new person* with *amazing body*",
        impact: "High",
      },
    ],
    negativeAspects: [],
  },
};
