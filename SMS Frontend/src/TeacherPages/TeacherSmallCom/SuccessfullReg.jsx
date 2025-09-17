import { CheckCircle } from "lucide-react";

export default function SuccessfullReg() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-green-100 via-green-50 to-green-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md">
        <CheckCircle className="mx-auto text-green-500 w-16 h-16 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800">
          Teacher Registered Successfully 🎉
        </h1>
        <p className="mt-2 text-gray-600">
          Your details have been saved securely. You can now proceed to the
          dashboard.
        </p>
        <button
          onClick={() => (window.location.href = "/admin/dashboard")}
          className="mt-6 px-6 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
