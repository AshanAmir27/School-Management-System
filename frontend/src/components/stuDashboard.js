import React from "react";

function StuDashboard() {
  return (
    <div className="p-8 bg-gray-50">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard</h1>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-700 mb-3">
            Total Courses
          </h2>
          <p className="text-3xl font-semibold text-blue-600">12</p>
          <p className="text-gray-500 text-sm">Courses you are enrolled in</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-700 mb-3">
            Assignments Due
          </h2>
          <p className="text-3xl font-semibold text-red-600">4</p>
          <p className="text-gray-500 text-sm">
            Assignments that need to be submitted
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-700 mb-3">
            Upcoming Exams
          </h2>
          <p className="text-3xl font-semibold text-yellow-600">2</p>
          <p className="text-gray-500 text-sm">Exams scheduled for this week</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Recent Activity
        </h2>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <ul className="space-y-4">
            <li className="flex justify-between items-center">
              <span className="text-gray-700">
                Completed Assignment: Math Homework
              </span>
              <span className="text-sm text-gray-500">Just Now</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-700">
                Course Enrolled: React Development
              </span>
              <span className="text-sm text-gray-500">2 days ago</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-700">Exam Reminder: History Exam</span>
              <span className="text-sm text-gray-500">5 days ago</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default StuDashboard;
