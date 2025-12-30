import WorkflowStep from '../ui/WorkFlowstep';

export default function Workflow() {
  const workflowSteps = [
    { 
      step: '1', 
      title: 'Order Taking', 
      description: 'Waiters take orders via tablet or mobile', 
      icon: '📱' 
    },
    { 
      step: '2', 
      title: 'Kitchen Display', 
      description: 'Chefs receive orders in real-time', 
      icon: '👨‍🍳' 
    },
    { 
      step: '3', 
      title: 'Preparation', 
      description: 'Track order status and preparation time', 
      icon: '⏱️' 
    },
    { 
      step: '4', 
      title: 'Payment', 
      description: 'Instant billing and multiple payment options', 
      icon: '💳' 
    }
  ];

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
      {/* Hero-like background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800">
        {/* Grid pattern like Hero */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293722_1px,transparent_1px),linear-gradient(to_bottom,#1f293722_1px,transparent_1px)] bg-[size:60px_60px] opacity-40"></div>
        
        {/* Gradient orbs like Hero */}
        <div className="absolute top-1/4 left-10 w-[400px] h-[400px] bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-[300px] h-[300px] bg-gradient-to-r from-blue-500/15 to-purple-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          {/* Hero-like badge */}
          <div className="inline-flex items-center bg-gradient-to-r from-indigo-600/20 to-blue-600/20 backdrop-blur-lg border border-indigo-500/30 px-6 py-3 rounded-full shadow-xl mb-8">
            <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full mr-2"></div>
            <span className="text-sm font-semibold bg-gradient-to-r from-indigo-200 to-blue-200 bg-clip-text text-transparent">
              Seamless Process
            </span>
          </div>
          
          {/* Hero-like headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white">
            Streamlined <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Workflow</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            From customer order to kitchen preparation and payment - all seamlessly connected
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflowSteps.map((step) => (
            <div 
              key={step.step}
              className="group relative bg-gradient-to-b from-gray-800/50 to-gray-900/30 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-8 hover:border-indigo-500/50 transition-all duration-300"
            >
              {/* Corner accents like Hero stats */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-indigo-500/30 rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-indigo-500/30 rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-indigo-500/30 rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-indigo-500/30 rounded-br-lg"></div>
              
              <div className="text-4xl mb-4">{step.icon}</div>
              <div className="text-lg font-bold text-white mb-2">{step.title}</div>
              <p className="text-gray-400 text-sm">{step.description}</p>
              
              {/* Step number - Hero style */}
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                {step.step}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}