export default function WorkflowStep({ step, title, description, icon }) {
  return (
    <div className="text-center p-8 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300 group">
      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className="text-blue-300 text-sm font-semibold mb-2">Step {step}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-blue-200">{description}</p>
    </div>
  );
}