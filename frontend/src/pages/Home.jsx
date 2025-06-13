import React, { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import ConfirmRide from "../components/ConfirmRide";
import { SocketContext } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";
import { toast } from "react-toastify";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState(null);
  const [ride, setRide] = useState(null);

  const navigate = useNavigate();

  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);

  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isPanelTransitioning, setIsPanelTransitioning] = useState(false);

  useEffect(() => {
    socket.emit("join", { userType: "user", userId: user._id });

    socket.on("ride-confirm", (ride) => {
      setVehicleFound(false);
      setWaitingForDriver(true);
      setRide(ride);
      toast.info("Your ride has been confirmed!");
    });

    socket.on("ride-start", (ride) => {
      setWaitingForDriver(false);
      navigate("/riding", { state: { ride } });
      toast.success("Your ride has started!");
    });

    return () => {
      socket.off("ride-confirm");
      socket.off("ride-start");
    };
  }, [user, socket, navigate]);

  const handlePickupChange = async (e) => {
    const value = e.target.value;
    setPickup(value);
    setActiveField("pickup");
    if (value.length < 3) {
      setPickupSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/maps/get-suggestions`,
        {
          params: { input: value },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPickupSuggestions(response.data);
    } catch (error) {
      toast.error("Failed to fetch pickup suggestions");
    } finally {
      setIsSearching(false);
    }
  };

  const handleDestinationChange = async (e) => {
    const value = e.target.value;
    setDestination(value);
    setActiveField("destination");
    if (value.length < 3) {
      setDestinationSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/maps/get-suggestions`,
        {
          params: { input: value },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDestinationSuggestions(response.data);
    } catch (error) {
      toast.error("Failed to fetch destination suggestions");
    } finally {
      setIsSearching(false);
    }
  };

  const handlePanelTransition = (isOpen) => {
    setIsPanelTransitioning(true);
    setPanelOpen(isOpen);
    setTimeout(() => setIsPanelTransitioning(false), 300);
  };

  useGSAP(() => {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: "70%",
        padding: 24,
        duration: 0.3,
        ease: "power2.inOut",
      });
    } else {
      gsap.to(panelRef.current, {
        height: "0%",
        padding: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
      gsap.to(panelCloseRef.current, {
        opacity: 0,
        duration: 0.2,
      });
    }
  }, [panelOpen]);

  useGSAP(() => {
    if (vehiclePanel) {
      gsap.to(vehiclePanelRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(vehiclePanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [vehiclePanel]);

  useGSAP(() => {
    if (confirmRidePanel) {
      gsap.to(confirmRidePanelRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(confirmRidePanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [confirmRidePanel]);

  useGSAP(() => {
    if (vehicleFound) {
      gsap.to(vehicleFoundRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(vehicleFoundRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [vehicleFound]);

  useGSAP(() => {
    if (waitingForDriver) {
      gsap.to(waitingForDriverRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(waitingForDriverRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [waitingForDriver]);

  async function findTrip() {
    if (!pickup || !destination) {
      toast.error("Please enter both pickup and destination locations");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/rides/get-fare`, {
        params: { pickup, destination },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setFare(response.data);
      setVehiclePanel(true);
      setPanelOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to calculate fare");
    } finally {
      setIsLoading(false);
    }
  }

  async function createRide() {
    await axios.post(
      `http://localhost:5000/rides/create`,
      {
        pickup,
        destination,
        vehicleType,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  }

  return (
    <div className="h-screen relative overflow-hidden bg-gray-50">
      <header className="absolute top-0 left-0 right-0 z-20 p-2 xs:p-3 sm:p-4 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-1.5 xs:space-x-2 sm:space-x-4">
            <img
              className="h-5 xs:h-6 sm:h-8 w-auto"
              src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
              alt="Uber"
            />
            <span className="hidden xs:block text-xs xs:text-sm sm:text-base font-medium text-gray-900">
              Uber
            </span>
          </div>
          <nav className="flex items-center space-x-2 xs:space-x-3 sm:space-x-6">
            <Link
              to="/profile"
              className="p-1.5 xs:p-2 sm:p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Profile"
            >
              <i className="ri-user-line text-base xs:text-lg sm:text-xl"></i>
            </Link>
            <Link
              to="/history"
              className="p-1.5 xs:p-2 sm:p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Ride History"
            >
              <i className="ri-history-line text-base xs:text-lg sm:text-xl"></i>
            </Link>
            <button
              className="p-1.5 xs:p-2 sm:p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Menu"
            >
              <i className="ri-menu-line text-base xs:text-lg sm:text-xl"></i>
            </button>
          </nav>
        </div>
      </header>

      <div className="h-screen w-full">
        <LiveTracking />
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="bg-white rounded-t-xl xs:rounded-t-2xl sm:rounded-t-3xl shadow-lg transition-all duration-300">
            <div className="p-2.5 xs:p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between mb-2 xs:mb-3 sm:mb-4">
                <h4 className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                  Find a trip
                </h4>
                <button
                  ref={panelCloseRef}
                  onClick={() => handlePanelTransition(false)}
                  className="p-1.5 xs:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close panel"
                >
                  <i className="ri-arrow-down-wide-line text-lg xs:text-xl sm:text-2xl"></i>
                </button>
              </div>

              <form
                onSubmit={(e) => e.preventDefault()}
                className="space-y-2 xs:space-y-3 sm:space-y-4"
              >
                <div className="relative">
                  <div className="absolute left-2.5 xs:left-3 sm:left-4 top-1/2 -translate-y-1/2 w-1 h-5 xs:h-6 sm:h-8 bg-gray-700 rounded-full"></div>
                  <input
                    onClick={() => handlePanelTransition(true)}
                    value={pickup}
                    onChange={handlePickupChange}
                    className="w-full bg-gray-100 px-8 xs:px-10 sm:px-12 py-2 xs:py-2.5 sm:py-3 text-sm xs:text-base sm:text-lg rounded-lg xs:rounded-xl border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all"
                    type="text"
                    placeholder="Add a pick-up location"
                  />
                  {isSearching && activeField === "pickup" && (
                    <div className="absolute right-2.5 xs:right-3 sm:right-4 top-1/2 -translate-y-1/2">
                      <i className="ri-loader-4-line animate-spin text-base xs:text-lg sm:text-xl text-gray-500"></i>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute left-2.5 xs:left-3 sm:left-4 top-1/2 -translate-y-1/2 w-1 h-5 xs:h-6 sm:h-8 bg-gray-700 rounded-full"></div>
                  <input
                    onClick={() => handlePanelTransition(true)}
                    value={destination}
                    onChange={handleDestinationChange}
                    className="w-full bg-gray-100 px-8 xs:px-10 sm:px-12 py-2 xs:py-2.5 sm:py-3 text-sm xs:text-base sm:text-lg rounded-lg xs:rounded-xl border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all"
                    type="text"
                    placeholder="Enter your destination"
                  />
                  {isSearching && activeField === "destination" && (
                    <div className="absolute right-2.5 xs:right-3 sm:right-4 top-1/2 -translate-y-1/2">
                      <i className="ri-loader-4-line animate-spin text-base xs:text-lg sm:text-xl text-gray-500"></i>
                    </div>
                  )}
                </div>

                <button
                  onClick={findTrip}
                  disabled={isLoading || !pickup || !destination}
                  className={`w-full py-2 xs:py-2.5 sm:py-3 px-3 xs:px-4 rounded-lg xs:rounded-xl text-white font-medium transition-all
                    ${
                      isLoading || !pickup || !destination
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-black hover:bg-gray-900 active:bg-gray-800"
                    }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center text-xs xs:text-sm sm:text-base">
                      <i className="ri-loader-4-line animate-spin mr-1.5 xs:mr-2"></i>
                      Finding trip...
                    </span>
                  ) : (
                    <span className="text-xs xs:text-sm sm:text-base">
                      Find Trip
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={panelRef}
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-xl xs:rounded-t-2xl sm:rounded-t-3xl shadow-lg transition-all duration-300
          ${isPanelTransitioning ? "pointer-events-none" : ""}`}
      >
        <div className="p-2.5 xs:p-3 sm:p-4 md:p-6">
          <LocationSearchPanel
            suggestions={
              activeField === "pickup"
                ? pickupSuggestions
                : destinationSuggestions
            }
            setPanelOpen={setPanelOpen}
            setVehiclePanel={setVehiclePanel}
            setPickup={setPickup}
            setDestination={setDestination}
            activeField={activeField}
          />
        </div>
      </div>

      <div
        ref={vehiclePanelRef}
        className="fixed w-full z-20 bottom-0 translate-y-full bg-white rounded-t-xl xs:rounded-t-2xl sm:rounded-t-3xl shadow-lg transition-transform duration-300"
      >
        <div className="p-2.5 xs:p-3 sm:p-4 md:p-6">
          <VehiclePanel
            selectVehicle={setVehicleType}
            fare={fare}
            setConfirmRidePanel={setConfirmRidePanel}
            setVehiclePanel={setVehiclePanel}
          />
        </div>
      </div>

      <div
        ref={confirmRidePanelRef}
        className="fixed w-full z-20 bottom-0 translate-y-full bg-white rounded-t-xl xs:rounded-t-2xl sm:rounded-t-3xl shadow-lg transition-transform duration-300"
      >
        <div className="p-2.5 xs:p-3 sm:p-4 md:p-6">
          <ConfirmRide
            createRide={createRide}
            pickup={pickup}
            destination={destination}
            fare={fare}
            vehicleType={vehicleType}
            setConfirmRidePanel={setConfirmRidePanel}
            setVehicleFound={setVehicleFound}
          />
        </div>
      </div>

      <div
        ref={vehicleFoundRef}
        className="fixed w-full z-20 bottom-0 translate-y-full bg-white rounded-t-xl xs:rounded-t-2xl sm:rounded-t-3xl shadow-lg transition-transform duration-300"
      >
        <div className="p-2.5 xs:p-3 sm:p-4 md:p-6">
          <LookingForDriver
            createRide={createRide}
            pickup={pickup}
            destination={destination}
            fare={fare}
            vehicleType={vehicleType}
            setVehicleFound={setVehicleFound}
          />
        </div>
      </div>

      <div
        ref={waitingForDriverRef}
        className="fixed w-full z-20 bottom-0 bg-white rounded-t-xl xs:rounded-t-2xl sm:rounded-t-3xl shadow-lg transition-transform duration-300"
      >
        <div className="p-2.5 xs:p-3 sm:p-4 md:p-6">
          <WaitingForDriver
            ride={ride}
            setVehicleFound={setVehicleFound}
            setWaitingForDriver={setWaitingForDriver}
            waitingForDriver={waitingForDriver}
          />
        </div>
      </div>

      <div className="fixed top-2 xs:top-4 sm:top-6 right-2 xs:right-4 sm:right-6 z-50">
        {/* Toast notifications will be rendered here */}
      </div>
    </div>
  );
};

export default Home;
