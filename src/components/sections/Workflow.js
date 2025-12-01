import WorkflowStep from '../ui//WorkFlowstep';

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
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Streamlined Workflow</h2>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            From customer order to kitchen preparation and payment - all seamlessly connected
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {workflowSteps.map((step) => (
            <WorkflowStep key={step.step} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}