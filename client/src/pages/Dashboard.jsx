// client/src/pages/Dashboard.jsx

import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600">Ready to continue your learning journey?</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600">
          <h3 className="text-lg font-semibold text-gray-700 mb-1">Total Goals</h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>
        <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-600">
          <h3 className="text-lg font-semibold text-gray-700 mb-1">Completed</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-600">
          <h3 className="text-lg font-semibold text-gray-700 mb-1">Resources</h3>
          <p className="text-3xl font-bold text-purple-600">0</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Goals</h2>
          <p className="text-gray-500 text-center py-8">No goals yet. Start by creating one!</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Resources</h2>
          <p className="text-gray-500 text-center py-8">No resources yet. Add your first resource!</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;