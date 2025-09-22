interface AnalysisResult {
  affordability: "excellent" | "good" | "caution" | "high-risk";
  impact: string;
  recommendation: string;
  monthlyImpact: number;
  savingsImpact: number;
  timeToRecover?: number;
  alternatives?: string[];
  riskLevel: number;
}

export const calculateRentImpact = (rentAmount: number, disposableIncome: number, monthlyIncome: number): AnalysisResult => {
  const impactRatio = rentAmount / disposableIncome;
  const newSavingsRate = Math.max(0, ((disposableIncome - rentAmount) / monthlyIncome) * 100);
  
  let affordability: AnalysisResult['affordability'] = "good";
  let riskLevel = 0;
  
  if (impactRatio <= 0.3) {
    affordability = "excellent";
    riskLevel = 1;
  } else if (impactRatio <= 0.5) {
    affordability = "good";
    riskLevel = 2;
  } else if (impactRatio <= 0.7) {
    affordability = "caution";
    riskLevel = 3;
  } else {
    affordability = "high-risk";
    riskLevel = 4;
  }

  return {
    affordability,
    impact: `${(impactRatio * 100).toFixed(1)}% of your disposable income`,
    recommendation: getHousingRecommendation(impactRatio, newSavingsRate),
    monthlyImpact: rentAmount,
    savingsImpact: (disposableIncome - rentAmount) * 12,
    riskLevel,
    alternatives: impactRatio > 0.5 ? [
      "Look for shared housing options",
      "Consider suburbs with lower rent",
      "Negotiate rent or find a roommate",
      "Explore different neighborhoods"
    ] : undefined,
  };
};

export const calculateCarImpact = (carPrice: number, monthlyPayment: number, downPayment: number, disposableIncome: number, savings: number): AnalysisResult => {
  const impactRatio = monthlyPayment / disposableIncome;
  const downPaymentImpact = downPayment / savings;
  
  let affordability: AnalysisResult['affordability'] = "good";
  let riskLevel = 0;
  
  if (impactRatio <= 0.1 && downPaymentImpact <= 0.2) {
    affordability = "excellent";
    riskLevel = 1;
  } else if (impactRatio <= 0.2 && downPaymentImpact <= 0.3) {
    affordability = "good";
    riskLevel = 2;
  } else if (impactRatio <= 0.3 && downPaymentImpact <= 0.5) {
    affordability = "caution";
    riskLevel = 3;
  } else {
    affordability = "high-risk";
    riskLevel = 4;
  }

  return {
    affordability,
    impact: `${(impactRatio * 100).toFixed(1)}% of disposable income + ${(downPaymentImpact * 100).toFixed(1)}% of savings`,
    recommendation: getCarRecommendation(impactRatio, downPaymentImpact),
    monthlyImpact: monthlyPayment,
    savingsImpact: (disposableIncome - monthlyPayment) * 12,
    riskLevel,
    alternatives: impactRatio > 0.2 ? [
      "Consider a certified pre-owned vehicle",
      "Look into longer loan terms to reduce monthly payment",
      "Explore leasing options",
      "Consider public transportation + occasional car sharing"
    ] : undefined,
  };
};

export const calculateEducationImpact = (totalCost: number, duration: number, disposableIncome: number, savings: number): AnalysisResult => {
  const monthlyEquivalent = totalCost / (duration * 12);
  const impactRatio = monthlyEquivalent / disposableIncome;
  const savingsImpact = totalCost / savings;
  
  let affordability: AnalysisResult['affordability'] = "good";
  let riskLevel = 0;
  
  if (impactRatio <= 0.3 && savingsImpact <= 0.5) {
    affordability = "excellent";
    riskLevel = 1;
  } else if (impactRatio <= 0.5 && savingsImpact <= 0.7) {
    affordability = "good";
    riskLevel = 2;
  } else if (impactRatio <= 0.7 && savingsImpact <= 1.0) {
    affordability = "caution";
    riskLevel = 3;
  } else {
    affordability = "high-risk";
    riskLevel = 4;
  }

  return {
    affordability,
    impact: `${(savingsImpact * 100).toFixed(1)}% of current savings over ${duration} years`,
    recommendation: getEducationRecommendation(impactRatio, savingsImpact, duration),
    monthlyImpact: monthlyEquivalent,
    savingsImpact: savings - totalCost,
    timeToRecover: Math.ceil(totalCost / (disposableIncome * 12)),
    riskLevel,
    alternatives: impactRatio > 0.5 ? [
      "Apply for scholarships and grants",
      "Consider part-time study while working",
      "Look into employer education benefits",
      "Explore online or community college options"
    ] : undefined,
  };
};

export const calculateMovingImpact = (movingCosts: number, newRent: number, monthlyExpenses: number, disposableIncome: number, savings: number): AnalysisResult => {
  const currentRentEstimate = monthlyExpenses * 0.3; // Assume 30% of expenses is housing
  const rentDifference = newRent - currentRentEstimate;
  const oneTimeImpact = movingCosts / savings;
  const monthlyImpact = Math.abs(rentDifference) / disposableIncome;
  
  let affordability: AnalysisResult['affordability'] = "good";
  let riskLevel = 0;
  
  if (monthlyImpact <= 0.2 && oneTimeImpact <= 0.1) {
    affordability = "excellent";
    riskLevel = 1;
  } else if (monthlyImpact <= 0.4 && oneTimeImpact <= 0.2) {
    affordability = "good";
    riskLevel = 2;
  } else if (monthlyImpact <= 0.6 && oneTimeImpact <= 0.3) {
    affordability = "caution";
    riskLevel = 3;
  } else {
    affordability = "high-risk";
    riskLevel = 4;
  }

  return {
    affordability,
    impact: `${(oneTimeImpact * 100).toFixed(1)}% of savings + ${rentDifference > 0 ? '+' : ''}$${Math.abs(rentDifference).toLocaleString()}/month`,
    recommendation: getMovingRecommendation(rentDifference, oneTimeImpact),
    monthlyImpact: newRent,
    savingsImpact: (disposableIncome + currentRentEstimate - newRent) * 12,
    riskLevel,
    alternatives: oneTimeImpact > 0.2 ? [
      "Get quotes from multiple moving companies",
      "Consider a gradual move or shipping belongings",
      "Look for relocation assistance from employer",
      "Sell items instead of moving them"
    ] : undefined,
  };
};

const getHousingRecommendation = (ratio: number, savingsRate: number) => {
  if (ratio <= 0.3) return "Excellent choice! This housing cost leaves plenty of room for savings and other goals.";
  if (ratio <= 0.5) return "Good fit for your budget. You'll still have flexibility for other expenses and savings.";
  if (ratio <= 0.7) return "This will be tight on your budget. Consider if the location/amenities justify the cost.";
  return "This housing cost is too high for your current income. Look for alternatives or increase income.";
};

const getCarRecommendation = (ratio: number, downPaymentRatio: number) => {
  if (ratio <= 0.1 && downPaymentRatio <= 0.2) return "Great choice! This car fits comfortably within your budget.";
  if (ratio <= 0.2 && downPaymentRatio <= 0.3) return "Reasonable purchase that won't strain your finances significantly.";
  if (ratio <= 0.3) return "Consider if you need all the features or if a less expensive option would work better.";
  return "This car payment is too high for your budget. Consider used cars or alternative transportation.";
};

const getEducationRecommendation = (ratio: number, savingsRatio: number, duration: number) => {
  if (ratio <= 0.3) return `Excellent investment! You can afford this education comfortably over ${duration} years.`;
  if (ratio <= 0.5) return "Good investment if it aligns with your career goals and earning potential.";
  if (ratio <= 0.7) return "Significant investment. Ensure the ROI justifies the cost and consider funding options.";
  return "This education cost is very high for your current situation. Explore financial aid and alternatives.";
};

const getMovingRecommendation = (rentDifference: number, oneTimeRatio: number) => {
  if (rentDifference <= 0 && oneTimeRatio <= 0.1) return "Great move! Lower living costs and minimal moving expenses.";
  if (Math.abs(rentDifference) <= 200 && oneTimeRatio <= 0.2) return "Reasonable move with manageable costs.";
  if (rentDifference > 0) return "Consider if the benefits (career, lifestyle) justify the increased living costs.";
  return "High moving costs. Explore ways to reduce expenses or negotiate relocation assistance.";
};