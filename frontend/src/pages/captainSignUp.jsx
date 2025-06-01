import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CaptainDataContext } from "../context/captainContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const CaptainSignup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
  });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");

  const [vehicleName, setVehicleName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const { setCaptain } = React.useContext(CaptainDataContext);

  const validatePassword = (pass) => {
    setPasswordValidation({
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
    });
  };

  const validateForm = () => {
    const errors = {};

    if (firstName.length < 3) {
      errors.firstName = "First name must be at least 3 characters long";
    }
    if (lastName.length < 3) {
      errors.lastName = "Last name must be at least 3 characters long";
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!passwordValidation.length) {
      errors.password = "Password must be at least 8 characters long";
    } else if (
      !passwordValidation.uppercase ||
      !passwordValidation.lowercase ||
      !passwordValidation.number
    ) {
      errors.password = "Password doesn't meet all requirements";
    }

    if (!address) {
      errors.address = "Address is required";
    }
    if (!vehicleName || vehicleName.length < 3) {
      errors.vehicleName =
        "Vehicle name is required and must be at least 3 characters";
    }
    if (!vehicleNumber || vehicleNumber.length < 3) {
      errors.vehicleNumber =
        "Vehicle number is required and must be at least 3 characters";
    }
    if (!vehicleModel || vehicleModel.length < 3) {
      errors.vehicleModel =
        "Vehicle model is required and must be at least 3 characters";
    }
    if (!vehicleColor || vehicleColor.length < 3) {
      errors.vehicleColor =
        "Vehicle color is required and must be at least 3 characters";
    }
    if (!vehiclePlate || vehiclePlate.length < 3) {
      errors.vehiclePlate =
        "Vehicle plate is required and must be at least 3 characters";
    }
    if (
      !vehicleYear ||
      vehicleYear < 1900 ||
      vehicleYear > new Date().getFullYear()
    ) {
      errors.vehicleYear = "Vehicle year must be between 1900 and current year";
    }
    if (!vehicleCapacity || vehicleCapacity < 1) {
      errors.vehicleCapacity = "Vehicle capacity must be at least 1";
    }
    if (!vehicleType) {
      errors.vehicleType = "Vehicle type is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setValidationErrors({});

    if (!validateForm()) {
      console.log("Form validation failed:", validationErrors);
      toast.error("Please fix the validation errors before submitting.");
      return;
    }

    try {
      const captainData = {
        fullName: {
          firstName: firstName,
          lastName: lastName,
        },
        email: email,
        password: password,
        address: address,
        vehicle: {
          vehicleName: vehicleName,
          vehicleNumber: vehicleNumber,
          vehicleModel: vehicleModel,
          vehicleColor: vehicleColor,
          vehiclePlate: vehiclePlate,
          vehicleYear: parseInt(vehicleYear),
          vehicleCapacity: parseInt(vehicleCapacity),
          vehicleType: vehicleType,
        },
      };

      // Log the exact data being sent
      console.log(
        "Full registration data:",
        JSON.stringify(captainData, null, 2)
      );

      const response = await axios.post(
        `http://localhost:5000/captains/register`,
        captainData
      );

      console.log("Registration response:", response.data);

      if (response.status === 201) {
        const { captain, token } = response.data;
        setCaptain(captain);
        localStorage.setItem("token", token);
        Cookies.set("token", token, {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });
        // Show success toast instead of alert
        toast.success("Captain account created successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate("/captain-home");
      }
    } catch (error) {
      console.error("Registration error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      // Log the validation errors in detail
      if (error.response?.data?.errors) {
        console.log(
          "Validation errors:",
          JSON.stringify(error.response.data.errors, null, 2)
        );
        const serverErrors = {};
        error.response.data.errors.forEach((err) => {
          if (err.path === "fullName.firstName")
            serverErrors.firstName = err.msg;
          if (err.path === "fullName.lastName") serverErrors.lastName = err.msg;
          if (err.path === "email") serverErrors.email = err.msg;
          if (err.path === "password") serverErrors.password = err.msg;
          if (err.path === "address") serverErrors.address = err.msg;
          if (err.path === "vehicle.vehicleName")
            serverErrors.vehicleName = err.msg;
          if (err.path === "vehicle.vehicleNumber")
            serverErrors.vehicleNumber = err.msg;
          if (err.path === "vehicle.vehicleModel")
            serverErrors.vehicleModel = err.msg;
          if (err.path === "vehicle.vehicleColor")
            serverErrors.vehicleColor = err.msg;
          if (err.path === "vehicle.vehiclePlate")
            serverErrors.vehiclePlate = err.msg;
          if (err.path === "vehicle.vehicleYear")
            serverErrors.vehicleYear = err.msg;
          if (err.path === "vehicle.vehicleCapacity")
            serverErrors.vehicleCapacity = err.msg;
          if (err.path === "vehicle.vehicleType")
            serverErrors.vehicleType = err.msg;
        });
        setValidationErrors(serverErrors);
        toast.error("Please fix the validation errors before submitting.", {
          position: "top-center",
          autoClose: 5000,
        });
      } else {
        const errorMessage =
          error.response?.data?.message ||
          "Registration failed. Please try again.";
        setError(errorMessage);
        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 5000,
        });
      }
    }
    // Clear form fields after submission attempt
    setEmail("");
    setFirstName("");
    setLastName("");
    setPassword("");
    setAddress("");
    setVehicleName("");
    setVehicleNumber("");
    setVehicleModel("");
    setVehicleColor("");
    setVehiclePlate("");
    setVehicleYear("");
    setVehicleCapacity("");
    setVehicleType("");
  };
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        <div className="flex flex-col items-center mb-8">
          <img
            className="w-24 h-24 mb-4"
            src="https://www.svgrepo.com/show/505031/uber-driver.svg"
            alt="Captain Logo"
          />
          <h2 className="text-2xl font-bold text-gray-900">Become a Captain</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our driver community
          </p>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
          {/* Personal Information Section */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 shadow-sm">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              Personal Information
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  required
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    validationErrors.firstName
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {validationErrors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  required
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    validationErrors.lastName
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                {validationErrors.lastName && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.lastName}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  required
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    validationErrors.address
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  type="text"
                  placeholder="Enter your address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                {validationErrors.address && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.address}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-100 shadow-sm">
            <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              Account Information
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  required
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    validationErrors.email
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  type="email"
                  placeholder="john.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.email}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  required
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    validationErrors.password
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                />
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.password}
                  </p>
                )}
                <div className="mt-1 text-xs text-gray-500">
                  {!passwordValidation.length && (
                    <p className="flex items-center text-red-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      At least 8 characters long
                    </p>
                  )}
                  {!passwordValidation.uppercase && (
                    <p className="flex items-center text-red-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      At least one uppercase letter (A-Z)
                    </p>
                  )}
                  {!passwordValidation.lowercase && (
                    <p className="flex items-center text-red-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      At least one lowercase letter (a-z)
                    </p>
                  )}
                  {!passwordValidation.number && (
                    <p className="flex items-center text-red-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      At least one number (0-9)
                    </p>
                  )}
                  {passwordValidation.length &&
                    passwordValidation.uppercase &&
                    passwordValidation.lowercase &&
                    passwordValidation.number && (
                      <p className="flex items-center text-green-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Password meets all requirements
                      </p>
                    )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg border border-purple-100 shadow-sm">
            <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h3.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-6a1 1 0 00-.293-.707l-2-2A1 1 0 0017 4H3z" />
              </svg>
              Vehicle Information
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="vehicleName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Vehicle Name
                </label>
                <input
                  id="vehicleName"
                  name="vehicleName"
                  required
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    validationErrors.vehicleName
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  type="text"
                  placeholder="e.g., Toyota Camry"
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                />
                {validationErrors.vehicleName && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.vehicleName}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="vehicleNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Vehicle Number
                </label>
                <input
                  id="vehicleNumber"
                  name="vehicleNumber"
                  required
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    validationErrors.vehicleNumber
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  type="text"
                  placeholder="e.g., VIN123456"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                />
                {validationErrors.vehicleNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.vehicleNumber}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="vehicleModel"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Vehicle Model
                </label>
                <input
                  id="vehicleModel"
                  name="vehicleModel"
                  required
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    validationErrors.vehicleModel
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  type="text"
                  placeholder="e.g., 2020"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                />
                {validationErrors.vehicleModel && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.vehicleModel}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="vehicleColor"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Vehicle Color
                </label>
                <input
                  id="vehicleColor"
                  name="vehicleColor"
                  required
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    validationErrors.vehicleColor
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  type="text"
                  placeholder="e.g., Red"
                  value={vehicleColor}
                  onChange={(e) => setVehicleColor(e.target.value)}
                />
                {validationErrors.vehicleColor && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.vehicleColor}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="vehiclePlate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  License Plate
                </label>
                <input
                  id="vehiclePlate"
                  name="vehiclePlate"
                  required
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    validationErrors.vehiclePlate
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  type="text"
                  placeholder="ABC-123"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                />
                {validationErrors.vehiclePlate && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.vehiclePlate}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="vehicleYear"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Vehicle Year
                </label>
                <input
                  id="vehicleYear"
                  name="vehicleYear"
                  required
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    validationErrors.vehicleYear
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder="e.g., 2020"
                  value={vehicleYear}
                  onChange={(e) => setVehicleYear(e.target.value)}
                />
                {validationErrors.vehicleYear && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.vehicleYear}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="vehicleCapacity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Vehicle Capacity
                </label>
                <input
                  id="vehicleCapacity"
                  name="vehicleCapacity"
                  required
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    validationErrors.vehicleCapacity
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  type="number"
                  min="1"
                  placeholder="e.g., 4"
                  value={vehicleCapacity}
                  onChange={(e) => setVehicleCapacity(e.target.value)}
                />
                {validationErrors.vehicleCapacity && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.vehicleCapacity}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="vehicleType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Vehicle Type
                </label>
                <select
                  id="vehicleType"
                  name="vehicleType"
                  required
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    validationErrors.vehicleType
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                >
                  <option value="">Select vehicle type</option>
                  <option value="car">Car</option>
                  <option value="bike">Bike</option>
                  <option value="truck">Truck</option>
                  <option value="auto">Auto</option>
                </select>
                {validationErrors.vehicleType && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.vehicleType}
                  </p>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#111]  text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 hover:text-white text-lg placeholder:text-base transition-colors shadow-md"
          >
            Create Captain Account
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/CaptainLogin"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CaptainSignup;
