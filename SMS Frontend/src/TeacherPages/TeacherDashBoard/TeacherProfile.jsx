import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Mail,
    User,
    Phone,
    MapPin,
    GraduationCap,
    Briefcase,
    BookOpen,
} from "lucide-react";
import Avtar from "../../assets/Avtar.png";

const BASE_URL = import.meta.env.VITE_APP_URL
// ---------------- Edit Teacher Form ----------------
const EditTeacherForm = ({ teacher, onClose, onSave }) => {
    const [formData, setFormData] = useState({ ...teacher });
    const [preview, setPreview] = useState( teacher?.image ? `${BASE_URL}${teacher?.image}` : Avtar);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // handle image change
    const handleFileChange = (e) => {
        const uploaded = e.target.files[0];
        if (uploaded) {
            setFile(uploaded);
            setPreview(URL.createObjectURL(uploaded));
        }
    };

    // handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const form = new FormData();
            Object.keys(formData).forEach((key) => {
                form.append(key, formData[key]);
            });
            if (file) {
                form.append("image", file);
            }

            const res = await axios.post(`/api/teachers/${teacher._id}`, form, {
                headers: { "Content-Type": "multipart/form-data" },

            });

            if (res.data) {
                onSave(res.data);
                onClose();
                window.location.reload()
            }
        } catch (err) {
            console.error(err);
            setError("Failed to update teacher. Try again!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-2xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Edit Teacher Profile
                </h2>

                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Profile Image */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-28 h-28 rounded-full border-4 border-indigo-200 shadow-md overflow-hidden">
                            <img
                                src={preview}
                                alt="Profile Preview"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <label className="cursor-pointer text-sm text-indigo-600 font-medium hover:underline">
                            Change Photo
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Name */}
                    <div className="flex flex-col md:flex-row md:items-center md:gap-3">
                        <label htmlFor="name" className="block w-32 text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name || ""}
                            onChange={handleChange}
                            className="flex-1 border rounded-lg px-3 py-2"
                            placeholder="Full Name"
                        />
                    </div>

                    {/* Username */}
                    <div className="flex flex-col md:flex-row md:items-center md:gap-3">
                        <label htmlFor="username" className="block w-32 text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username || ""}
                            onChange={handleChange}
                            className="flex-1 border rounded-lg px-3 py-2"
                            placeholder="Username"
                        />
                    </div>

                    {/* Qualification */}
                    <div className="flex flex-col md:flex-row md:items-center md:gap-3">
                        <label htmlFor="qualification" className="block w-32 text-sm font-medium text-gray-700">
                            Qualification
                        </label>
                        <input
                            type="text"
                            id="qualification"
                            name="qualification"
                            value={formData.qualification || ""}
                            onChange={handleChange}
                            className="flex-1 border rounded-lg px-3 py-2"
                            placeholder="Qualification"
                        />
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col md:flex-row md:items-center md:gap-3">
                        <label htmlFor="phone" className="block w-32 text-sm font-medium text-gray-700">
                            Phone
                        </label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone || ""}
                            onChange={handleChange}
                            className="flex-1 border rounded-lg px-3 py-2"
                            placeholder="Phone"
                        />
                    </div>

                    {/* Address */}
                    <div className="flex flex-col md:flex-row md:items-center md:gap-3">
                        <label htmlFor="address" className="block w-32 text-sm font-medium text-gray-700">
                            Address
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address || ""}
                            onChange={handleChange}
                            className="flex-1 border rounded-lg px-3 py-2"
                            placeholder="Address"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// ---------------- Teacher Profile ----------------
const TeacherProfile = ({ teacher }) => {
    const [teacherData, setTeacherData] = useState(teacher);
    const [isEditing, setIsEditing] = useState(false);


    useEffect(() => {
        if (teacher) setTeacherData(teacher);
    }, [teacher]);

    if (!teacherData) {
        return <p className="text-center text-gray-500">Loading teacher data...</p>;
    }

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden relative">
            {/* Header Banner */}
            <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 h-32">
                <div className="absolute -bottom-12 left-6">
                    <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden">
                        <img
                            src={teacherData?.image ? `${BASE_URL}${teacherData.image}` : Avtar}
                            alt={teacherData?.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* Edit Button */}
            <button
                onClick={() => setIsEditing(true)}
                className="absolute top-4 right-4 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
            >
                Edit Profile
            </button>

            <div className="p-6 mt-12">
                <h1 className="text-2xl font-bold text-gray-800">{teacherData.name}</h1>
                <p className="text-gray-600">{teacherData.designation}</p>
                <p className="text-gray-600">{teacherData.department}</p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                    <div className="flex items-center gap-2">
                        <Mail className="text-indigo-500" />
                        <span>{teacherData.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <User className="text-indigo-500" />
                        <span>{teacherData.username}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone size={18} className="text-indigo-500" />
                        <span>{teacherData.phone || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-indigo-500" />
                        <span>{teacherData.address || "Not Provided"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Briefcase size={18} className="text-indigo-500" />
                        <span>{teacherData.collegeName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <GraduationCap size={18} className="text-indigo-500" />
                        <span>{teacherData.qualification}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <BookOpen size={18} className="text-indigo-500" />
                        <span>
                            {teacherData.dateOfJoining
                                ? new Date(teacherData.dateOfJoining).toLocaleDateString("en-IN")
                                : "N/A"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <EditTeacherForm
                    teacher={teacherData}
                    onClose={() => setIsEditing(false)}
                    onSave={(updated) => setTeacherData(updated)}
                />
            )}
        </div>
    );
};

export default TeacherProfile;
