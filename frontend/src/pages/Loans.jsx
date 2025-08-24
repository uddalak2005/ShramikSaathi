import { useState } from "react";
import {
  CreditCard,
  TrendingUp,
  Shield,
  Calculator,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  PiggyBank,
  Calendar,
  Users,
} from "lucide-react";
import Customloader from "../components/loaderContent/loader";

const Loans = () => {
  const [loanAmount, setLoanAmount] = useState(10000);
  const [loanTenure, setLoanTenure] = useState(6);
  const [activeTab, setActiveTab] = useState("browse-loans");
  const [loanApply,setloanApply] = useState(false);

  const LoanApplication = async() => {
    try {
      console.log("Calling loan")
      const res = await fetch(`${import.meta.env.VITE_LOAN_URL}/worker_forecast`,{
        method: 'POST',
        headers:{
          'Content-Type' : 'Application/json'
        },
        body:JSON.stringify({
            worker_id: 1
        })
      });

      if(res.ok){
        const data = await res.json();
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const loanOptions = [
    {
      id: "1",
      name: "Quick Cash Loan",
      provider: "MicroFinance Plus",
      minAmount: 5000,
      maxAmount: 25000,
      interestRate: 18,
      tenure: "3-12 months",
      processingTime: "2 hours",
      requirements: ["Valid ID", "Phone verification", "Basic income proof"],
      features: ["Instant approval", "No collateral", "Flexible repayment"],
      rating: 4.5,
      totalUsers: "25K+",
    },
    {
      id: "2",
      name: "Worker Advance Loan",
      provider: "SafeLend Microfinance",
      minAmount: 10000,
      maxAmount: 50000,
      interestRate: 15,
      tenure: "6-18 months",
      processingTime: "24 hours",
      requirements: ["Employment proof", "Salary slip", "Bank statement"],
      features: ["Lower interest", "Higher amount", "Longer tenure"],
      rating: 4.7,
      totalUsers: "15K+",
    },
    {
      id: "3",
      name: "Emergency Fund",
      provider: "WorkerCare Financial",
      minAmount: 3000,
      maxAmount: 15000,
      interestRate: 22,
      tenure: "1-6 months",
      processingTime: "30 minutes",
      requirements: ["Valid phone", "Basic KYC"],
      features: ["Ultra fast", "Minimal documents", "Emergency focused"],
      rating: 4.2,
      totalUsers: "8K+",
    },
  ];

  const activeLoans = [
    {
      id: "L001",
      amount: 15000,
      provider: "SafeLend Microfinance",
      emi: 2850,
      nextDueDate: "2025-01-15",
      remainingAmount: 8550,
      totalInstallments: 6,
      completedInstallments: 3,
    },
    {
      id: "L002",
      amount: 8000,
      provider: "MicroFinance Plus",
      emi: 1420,
      nextDueDate: "2025-01-20",
      remainingAmount: 2840,
      totalInstallments: 6,
      completedInstallments: 4,
    },
  ];

  const safetyTips = [
    {
      title: "Verify Lender Credibility",
      description:
        "Always check if the lender is RBI registered and has proper licenses",
      icon: Shield,
    },
    {
      title: "Read All Terms Carefully",
      description:
        "Understand interest rates, hidden charges, and penalty fees before signing",
      icon: BookOpen,
    },
    {
      title: "Borrow Only What You Need",
      description:
        "Don't over-borrow. Calculate your repayment capacity before applying",
      icon: Calculator,
    },
    {
      title: "Keep Documents Safe",
      description:
        "Store all loan documents safely and keep digital copies as backup",
      icon: CheckCircle,
    },
  ];

  const creditScore = {
    score: 720,
    status: "Good",
  };

  return (
    <div className="min-h-screen bg-background">

    {loanApply && <div className="absolute inset-0 flex items-center justify-center bg-white/30 z-50">
    <Customloader onClose={()=> {
      setloanApply(false)
      alert("Mail submitted to banks!")
    }}/>
    </div>}
    
      {/* Header */}
      <div className="bg-gradient-hero">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-primary-foreground">
                Micro Loan Marketplace
              </h1>
              <p className="text-primary-foreground/80">
                Safe, transparent loans designed for workers like you
              </p>
            </div>

            <div className="flex gap-3">
              <button className="flex items-center px-4 py-2 border rounded-lg border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Calculator className="h-4 w-4 mr-2" />
                Loan Calculator
              </button>
              <button className="flex items-center px-4 py-2 rounded-lg bg-secondary 
              hover:bg-secondary-dark text-secondary-foreground font-semibold"
              onClick={() => {
                setloanApply(true)
                LoanApplication()
              }}>
                <CreditCard className="h-4 w-4 mr-2" />
                Apply for Loan
              </button>
            </div>
          </div>

          {/* Credit Score Overview */}
          <div className="bg-primary rounded-2xl p-6 shadow-medium">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-success rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-success-foreground">
                    {creditScore.score}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground">Credit Score</h3>
                <p className="text-success text-sm">{creditScore.status} Range</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-warm rounded-full flex items-center justify-center mx-auto mb-3">
                  <PiggyBank className="h-8 w-8 text-secondary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground">Available Limit</h3>
                <p className="text-secondary text-sm">₹45,000</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground">Active Loans</h3>
                <p className="text-foreground text-sm">{activeLoans.length} Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-4 border-b">
          {["browse-loans", "my-loans", "calculator", "learn"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 text-center font-medium ${
                activeTab === tab
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {tab === "browse-loans" && "Browse Loans"}
              {tab === "my-loans" && `My Loans (${activeLoans.length})`}
              {tab === "calculator" && "Calculator"}
              {tab === "learn" && "Learn & Tips"}
            </button>
          ))}
        </div>

        {/* --- Browse Loans --- */}
        {activeTab === "browse-loans" && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-2">Available Loan Options</h2>
            <p className="text-muted-foreground mb-6">
              Choose from verified lenders with transparent terms
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {loanOptions.map((loan) => (
                <div
                  key={loan.id}
                  className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
                >
                  <div className="flex justify-between mb-3">
                    <h3 className="text-lg text-foreground font-semibold">{loan.name}</h3>
                    <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                      ⭐ {loan.rating}
                    </span>
                  </div>
                  <p className="text-foreground">{loan.provider}</p>
                  <p className="flex items-center text-sm text-muted-foreground mt-1">
                    <Users className="h-4 w-4 mr-1" />
                    {loan.totalUsers} users
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Amount</p>
                      <p className="font-semibold">
                        ₹{loan.minAmount} - ₹{loan.maxAmount}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Rate</p>
                      <p className="font-semibold">{loan.interestRate}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tenure</p>
                      <p className="font-semibold">{loan.tenure}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Processing</p>
                      <p className="font-semibold text-success">{loan.processingTime}</p>
                    </div>
                  </div>
                  <button className="mt-4 w-full bg-secondary text-white py-2 rounded-lg font-semibold">
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other tabs ("my-loans", "calculator", "learn") would follow the same conversion pattern */}
      </div>
    </div>
  );
};

export default Loans;
