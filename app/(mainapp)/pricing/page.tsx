import { Check, X, HelpCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AppNavbar from "@/components/AppNavbar";

const plans = [
  {
    name: "Free",
    description: "No credit card needed",
    price: "$0",
    credits: "200 credits per month",
    tasks: "1 task waiting in queue",
    priority: "Limited queue priority",
    assets: "Assets are under CC BY 4.0 license",
    apiAccess: true,
    textureEditing: true,
    downloadModels: false,
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
    gradient: "from-[#C2E74B] to-[#A3D66E]", // Gradient for Free plan
  },
  {
    name: "Pro",
    description: "Best for individual creators",
    price: "$16",
    originalPrice: "$20",
    period: "/Month",
    subtext: "$160 / 100 credits • Billed yearly",
    credits: "1,000 credits per month",
    tasks: "10 tasks waiting in queue",
    priority: "Standard queue priority",
    assets: "Assets are private & customer owned",
    apiAccess: true,
    textureEditing: true,
    downloadModels: true,
    buttonText: "Subscribe Now",
    buttonVariant: "default" as const,
    gradient: "from-[#4B9AE7] to-[#73B3EA]", // Gradient for Pro plan
  },
  {
    name: "Enterprise",
    description: "Best for studios and teams",
    price: "$48",
    originalPrice: "$60",
    period: "/Month",
    subtext: "$120 / 100 credits • Billed yearly",
    credits: "4,000 credits per month",
    tasks: "20 tasks waiting in queue",
    priority: "Maximized queue priority",
    assets: "Assets are private & customer owned",
    apiAccess: true,
    textureEditing: true,
    downloadModels: true,
    buttonText: "Subscribe Now",
    buttonVariant: "default" as const,
    gradient: "from-[#B54BE7] to-[#C27AE7]", // Gradient for Max plan
  },
];

export default function PricingTable() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <AppNavbar />
      <div className="container mx-auto px-4 py-16 mb-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12 mt-10 md:mt-6">
          Choose Your Plan
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card
              key={plan.name}
              className={`bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg transition-all hover:shadow-xl`}
            >
              <CardHeader className="text-center pb-4 ">
                <CardTitle
                  className={`text-2xl font-bold bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}
                >
                  {plan.name}
                </CardTitle>
                <p className="text-sm text-gray-900 dark:text-gray-400">
                  {plan.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6 text-gray-900 dark:text-gray-400">
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  {plan.originalPrice && (
                    <span className="ml-2 text-sm line-through text-gray-900 dark:text-gray-400">
                      {plan.originalPrice}
                    </span>
                  )}
                  {plan.period && (
                    <span className="ml-1 text-sm text-gray-900 dark:text-gray-400">
                      {plan.period}
                    </span>
                  )}
                </div>
                {plan.subtext && (
                  <p className="text-xs text-gray-900 dark:text-gray-400 text-center">
                    {plan.subtext}
                  </p>
                )}
                <ul className="space-y-2 mt-4 text-gray-900 dark:text-gray-400">
                  <PlanFeature text={plan.credits} />
                  <PlanFeature text={plan.tasks} />
                  <PlanFeature
                    text={plan.priority}
                    tooltip="Queue priority affects how quickly your tasks are processed"
                  />
                  <PlanFeature text={plan.assets} />
                  <PlanFeature text="API access" checked={plan.apiAccess} />
                  <PlanFeature
                    text="AI texture editing"
                    checked={plan.textureEditing}
                  />
                  <PlanFeature
                    text="Download community models"
                    checked={plan.downloadModels}
                  />
                </ul>
              </CardContent>
              <CardFooter className="pt-0 px-6 pb-6">
                <Button
                  variant={plan.buttonVariant}
                  className={`w-full text-white bg-gradient-to-r ${plan.gradient} hover:opacity-90 transition duration-200`}
                >
                  {plan.buttonText} <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlanFeature({
  text,
  checked,
  tooltip,
}: {
  text: string;
  checked?: boolean;
  tooltip?: string;
}) {
  const feature = (
    <div className="flex items-center">
      {checked === undefined ? (
        <Check className="w-5 h-5 mr-2 text-[#C2E74B]" />
      ) : checked ? (
        <Check className="w-5 h-5 mr-2 text-[#C2E74B]" />
      ) : (
        <X className="w-5 h-5 mr-2 text-red-500" />
      )}
      <span className="text-sm text-gray-900 dark:text-gray-400">{text}</span>
      {tooltip && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="w-4 h-4 ml-2 text-gray-400 cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-white">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );

  return <li>{feature}</li>;
}
