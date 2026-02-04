// client/src/pages/Home.jsx

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Personal Learning Resource Manager
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Organize your learning resources, set goals, and track your progress all in one place.
          </p>

          <div className="flex justify-center space-x-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition border-2 border-blue-600"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          <div className="mt-20 grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Set Goals</h3>
              <p className="text-gray-600">Define and track your learning objectives</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">Organize Resources</h3>
              <p className="text-gray-600">Keep all your learning materials in one place</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600">Monitor your achievements and stay motivated</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;