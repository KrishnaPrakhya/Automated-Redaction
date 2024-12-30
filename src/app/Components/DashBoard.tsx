"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ShieldIcon,
  ImageIcon,
  Fingerprint,
  ChevronRight,
  Wand2Icon,
} from "lucide-react";
import Link from "next/link";

const Dashboard = () => {
  const features = [
    {
      title: "Gradational Redaction",
      description:
        "Three-level redaction system with blackout, vanishing, and blur effects",
      icon: ShieldIcon,
      link: "/gradationalRedaction",
    },
    {
      title: "Smart Detection",
      description:
        "AI-powered signature and logo detection using U-Net segmentation",
      icon: Wand2Icon,
      link: "/unet",
    },
    {
      title: "Secure Processing",
      description: "Enterprise-grade security with end-to-end encryption",
      icon: Fingerprint,
      link: "/",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 mt-14">
      <div className="max-w-6xl mx-auto mb-12 text-center opacity-0 animate-fade-in">
        <h1 className="text-4xl font-bold mb-4 text-gray-900  gradient-title">
          Advanced Document Redaction
        </h1>
        <p className="text-xl text-gray-900 mb-8">
          Professional-grade redaction tools with AI-powered detection
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className={`opacity-0 animate-fade-in`}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <Card className="h-full transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                  <CardTitle>
                    <Link href={feature.link}>{feature.title}</Link>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <div
        className="max-w-6xl mx-auto opacity-0 animate-fade-in"
        style={{ animationDelay: "450ms" }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {["Upload Document", "Recent Files", "About Us"].map((action) => (
                <button
                  onClick={() => alert("Coming soon!")}
                  key={action}
                  className="flex items-center justify-between p-4 rounded-lg bg-white border border-gray-200 transition-all duration-300 hover:border-blue-500 hover:bg-blue-50 hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <span className="flex items-center">
                    <ImageIcon className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-medium">{action}</span>
                  </span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
