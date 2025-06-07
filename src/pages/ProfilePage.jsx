import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [workAddress, setWorkAddress] = useState("");

  const fetchProfile = async () => {
    if (!user?.uid) return;
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      setProfile(data);
      setName(data.name || "");
      setHomeAddress(data.homeAddress || "");
      setWorkAddress(data.workAddress || "");
    }
  };

  const handleUpdate = async () => {
    const ref = doc(db, "users", user.uid);
    await updateDoc(ref, {
      name,
      homeAddress,
      workAddress,
    });
    setEditing(false);
    fetchProfile();
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return (
    <div className="max-w-2xl mx-auto mt-5 mb-5 p-8 bg-white shadow-lg rounded-xl border border-gray-200">
      <h2 className="text-3xl font-semibold text-gray-900 mb-6 text-center">
        Your Profile
      </h2>
      {profile ? (
        <>
          {editing ? (
            <div className="space-y-6">
              <div>
                <label className="block text-gray-600 mb-2">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full border-gray-300 rounded-md px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-2">Home Address</label>
                <textarea
                  value={homeAddress}
                  onChange={(e) => setHomeAddress(e.target.value)}
                  placeholder="Enter your home address"
                  className="w-full border-gray-300 rounded-md px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-2">Work Address</label>
                <textarea
                  value={workAddress}
                  onChange={(e) => setWorkAddress(e.target.value)}
                  placeholder="Enter your work address"
                  className="w-full border-gray-300 rounded-md px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={handleUpdate}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all duration-300"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-lg text-gray-700">
                <strong className="font-semibold">Email:</strong>{" "}
                {profile.email}
              </p>
              <p className="text-lg text-gray-700">
                <strong className="font-semibold">Name:</strong> {profile.name}
              </p>
              <p className="text-lg text-gray-700">
                <strong className="font-semibold">Home Address:</strong>{" "}
                {profile.homeAddress || "Not provided"}
              </p>
              <p className="text-lg text-gray-700">
                <strong className="font-semibold">Work Address:</strong>{" "}
                {profile.workAddress || "Not provided"}
              </p>
              <button
                onClick={() => setEditing(true)}
                className="w-full text-blue-600 hover:text-blue-700 text-lg font-medium underline"
              >
                Edit Profile
              </button>
            </div>
          )}

          {/* Order History */}
          {profile.orders && profile.orders.length > 0 && (
            <div className="mt-8">
              <h3 className="text-2xl font-semibold mb-4">Order History</h3>
              <ul className="space-y-4">
                {profile.orders.map((order, index) => (
                  <li
                    key={index}
                    className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-md"
                  >
                    <p className="text-sm text-gray-700">
                      <strong>Order ID:</strong> {order.id}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Date:</strong>{" "}
                      {new Date(order.date).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Total:</strong> ₹{order.total}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Shipping Address:</strong>{" "}
                      {order.shippingAddress || "Not available"}
                    </p>
                    <ul className="list-disc pl-5 mt-2 text-sm">
                      {order.items.map((item, i) => (
                        <li key={i}>
                          {item.ProductName || item.name} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <div className="flex justify-center items-center py-12">
          <div className="w-12 h-12 border-4 border-t-4 border-indigo-600 rounded-full animate-spin"></div>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="mt-8 bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition-all duration-300"
      >
        Logout
      </button>
    </div>
  );
};

export default ProfilePage;
