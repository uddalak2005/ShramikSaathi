import { useState } from "react";
import { 
  Scale, FileText, HelpCircle, Users, Phone, MessageCircle,
  CheckCircle, Clock, AlertTriangle, BookOpen, Gavel, Shield
} from "lucide-react";

const Legal = () => {
  const [isQueryDialogOpen, setIsQueryDialogOpen] = useState(false);

  const legalResources = [
    {
      title: "Know Your Rights as a Worker",
      description: "Essential rights every migrant worker should know about minimum wages, working hours, and safety.",
      icon: Shield,
      color: "bg-primary",
      topics: ["Minimum Wage Laws", "Working Hour Limits", "Workplace Safety", "Break & Rest Rights"]
    },
    {
      title: "Understanding Employment Contracts", 
      description: "What to look for in job contracts and how to protect yourself from unfair terms.",
      icon: FileText,
      color: "bg-secondary",
      topics: ["Contract Basics", "Salary Terms", "Notice Period", "Termination Clauses"]
    },
    {
      title: "Wage & Payment Issues",
      description: "How to handle delayed payments, wage cuts, and other compensation problems.",
      icon: Gavel,
      color: "bg-green-600", 
      topics: ["Payment Delays", "Wage Deductions", "Overtime Pay", "Final Settlement"]
    },
    {
      title: "Document & Legal Procedures",
      description: "Important documents you need and legal procedures for various situations.",
      icon: BookOpen,
      color: "bg-purple-600",
      topics: ["Work Permits", "PF & ESI", "Legal Documentation", "Court Procedures"]
    }
  ];

  const faqData = [
    {
      id: "1",
      question: "My employer is not paying minimum wage. What can I do?",
      answer: "Under the Minimum Wages Act, every worker is entitled to minimum wage as per their state government rates. You can file a complaint with the Labour Commissioner office in your area. Document your work hours and current pay rate as evidence.",
      category: "Wages",
      askedBy: "Ramesh K.",
      answeredBy: "Legal Expert",
      votes: 45,
      isAnswered: true
    },
    {
      id: "2", 
      question: "Can my employer terminate me without notice?",
      answer: "No, employers must give proper notice as per the Industrial Disputes Act. For workers with less than 1 year service, 1 month notice is required. For more than 1 year, the notice period should be mentioned in your appointment letter or employment contract.",
      category: "Employment",
      askedBy: "Priya S.",
      answeredBy: "Legal Expert", 
      votes: 38,
      isAnswered: true
    },
    {
      id: "3",
      question: "What should I do if I get injured at workplace?",
      answer: "Immediately report the injury to your supervisor and seek medical attention. Your employer is responsible for medical costs under the Workmen's Compensation Act. Keep all medical records and file a claim within 2 years of the incident.",
      category: "Safety",
      askedBy: "Mohammed A.",
      answeredBy: "Legal Expert",
      votes: 52,
      isAnswered: true
    },
    {
      id: "4",
      question: "Is overtime work mandatory? Can I refuse extra hours?",
      answer: "Overtime cannot be forced beyond legal limits. As per Factories Act, no worker can work more than 60 hours per week. You have the right to refuse excessive overtime, and if paid, overtime should be at double the normal wage rate.",
      category: "Working Hours", 
      askedBy: "Sunita D.",
      answeredBy: "Legal Expert",
      votes: 29,
      isAnswered: true
    },
    {
      id: "5",
      question: "My PF money has not been deposited. How to check and complain?",
      answer: "You can check your PF balance through EPFO portal or SMS. If contributions are not deposited, file complaint with EPFO grievance portal. Your employer is legally bound to deposit PF within 15 days of salary payment.",
      category: "Benefits",
      askedBy: "Vikram P.",
      answeredBy: "Waiting for expert response",
      votes: 18,
      isAnswered: false
    }
  ];

  const recentQueries = [
    {
      id: "1",
      title: "Salary not paid for 2 months, what are my options?",
      description: "I work at a construction site in Mumbai and haven't received salary for 2 months. Employer keeps giving excuses...",
      status: "in-review",
      submittedDate: "2024-12-20",
      category: "Payment Issues"
    },
    {
      id: "2", 
      title: "Need help with PF withdrawal process",
      description: "I'm changing jobs and want to withdraw my PF amount. What documents do I need and what's the process?",
      status: "answered",
      submittedDate: "2024-12-18", 
      category: "Benefits"
    },
    {
      id: "3",
      title: "Workplace safety concerns - no safety equipment provided",
      description: "My employer doesn't provide safety helmets or other protective gear. Is this legal? What can I do?",
      status: "expert-assigned",
      submittedDate: "2024-12-15",
      category: "Safety"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-review':
        return 'bg-yellow-100 text-yellow-800';
      case 'answered':
        return 'bg-green-100 text-green-800';
      case 'expert-assigned':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'in-review':
        return <Clock className="h-3 w-3" />;
      case 'answered':
        return <CheckCircle className="h-3 w-3" />;
      case 'expert-assigned':
        return <Users className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl text-foreground font-bold">Legal Support</h1>
              <p className="opacity-80 text-foreground">Know your rights, get legal advice, 
              and protect yourself at work</p>
            </div>

            <div className="flex gap-3">
              <button className="border border-white text-white px-4 py-2 rounded-lg flex items-center hover:bg-white hover:text-blue-600">
                <Phone className="h-4 w-4 mr-2" />
                Emergency Helpline
              </button>

              <button 
                className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold flex items-center"
                onClick={() => setIsQueryDialogOpen(true)}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Ask Legal Question
              </button>
            </div>
          </div>

          {/* Emergency Alert */}
          <div className="bg-foreground border border-red-300 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-200" />
              <div>
                <h3 className="font-semibold text-red-200">Emergency Legal Helpline</h3>
                <p className="text-sm text-red-600">
                  For urgent legal issues call: <span className="font-bold">1800-11-3333</span> (24/7 Free Support)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Query Modal */}
      {isQueryDialogOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Submit Your Legal Query</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Category</label>
                <select className="w-full border rounded px-3 py-2">
                  <option>Wage & Payment Issues</option>
                  <option>Employment Contracts</option>
                  <option>Workplace Safety</option>
                  <option>Benefits & PF</option>
                  <option>Job Termination</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Question Title</label>
                <input className="w-full border rounded px-3 py-2" placeholder="Brief title for your question" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Detailed Description</label>
                <textarea className="w-full border rounded px-3 py-2 min-h-[120px]" placeholder="Describe your situation in detail..." />
              </div>
              <div>
                <label className="block mb-1 font-medium">Urgency Level</label>
                <select className="w-full border rounded px-3 py-2">
                  <option>High - Need immediate help</option>
                  <option>Medium - Within a week</option>
                  <option>Low - General guidance</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setIsQueryDialogOpen(false)} className="flex-1 border rounded px-4 py-2">Cancel</button>
                <button className="flex-1 bg-blue-600 text-white rounded px-4 py-2">Submit Query</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 border-b mb-6">
          <button className="px-4 py-2 border-b-2 border-blue-600 font-semibold">Legal Resources</button>
          <button className="px-4 py-2">Community Q&A</button>
          <button className="px-4 py-2">My Queries</button>
        </div>

        {/* Legal Resources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {legalResources.map((resource, index) => (
            <div key={index} className="p-6 shadow-lg bg-white rounded-xl hover:shadow-lg transition cursor-pointer">
              <div className="flex gap-4">
                <div className={`w-14 h-14 ${resource.color} rounded-xl flex items-center justify-center`}>
                  <resource.icon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{resource.title}</h3>
                  <p className="text-sm text-gray-600">{resource.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {resource.topics.map((t, i) => (
                      <span key={i} className="text-xs border rounded px-2 py-1">{t}</span>
                    ))}
                  </div>
                  <button className="mt-4 text-blue-600 hover:underline">Learn More →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Legal;
