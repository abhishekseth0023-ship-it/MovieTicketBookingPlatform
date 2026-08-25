import React, { useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Calendar,
  Film,
  Clapperboard,
  Ticket,
  Phone,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signUpStyles, signUpCSS } from "../../assets/dummyStyles";

const API_BASE = "http://localhost:5000/api/auth";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    birthDate: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.birthDate) {
      newErrors.birthDate = "Birth date is required";
    } else {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 13) {
        newErrors.birthDate = "You must be at least 13 years old";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    console.log("📝 Form Submission Data:", {
      ...formData,
      password: "***" + formData.password.slice(-2),
    });

    setIsLoading(true);

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        birthDate: formData.birthDate,
        password: formData.password,
      };

      const response = await axios.post(`${API_BASE}/register`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data && response.data.success) {
        toast.success(
          "🎬 Account created successfully! Redirecting to login..."
        );

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        setTimeout(() => {
          window.location.href = "/login";
        }, 1200);
      } else {
        toast.error(response.data?.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      const serverMsg =
        err?.response?.data?.message || err?.message || "Server error";

      if (serverMsg.toLowerCase().includes("email")) {
        setErrors((prev) => ({ ...prev, email: serverMsg }));
      } else if (serverMsg.toLowerCase().includes("username")) {
        setErrors((prev) => ({ ...prev, username: serverMsg }));
      } else if (serverMsg.toLowerCase().includes("phone")) {
        setErrors((prev) => ({ ...prev, phone: serverMsg }));
      } else {
        toast.error(serverMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className={signUpStyles.container}>
      
      <div className={signUpStyles.particlesContainer}>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={signUpStyles.particle}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className={signUpStyles.gradientOrbs}>
        <div className={signUpStyles.orb1}></div>
        <div className={signUpStyles.orb2}></div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <div className={signUpStyles.mainContent}>
        {/* Back Button */}
        <button onClick={goBack} className={signUpStyles.backButton}>
          <ArrowLeft size={20} className={signUpStyles.backIcon} />
          <span className={signUpStyles.backText}>BACK</span>
        </button>

        <div className={signUpStyles.card}>
          
          <div className={signUpStyles.cardHeader}></div>

          <div className={signUpStyles.cardContent}>
            <div className={signUpStyles.header}>
              <div className={signUpStyles.headerFlex}>
                <Ticket className={signUpStyles.headerIcon} size={32} />
                <h2 className={signUpStyles.headerTitle}>Create Your MovieSeatHub Account</h2>
              </div>
              <p className={signUpStyles.headerSubtitle}>
                Create an account to book tickets and manage your bookings
              </p>
            </div>

            <form onSubmit={handleSubmit} className={signUpStyles.form}>
              
              <div className={signUpStyles.formGrid}>
                
                <div>
                  <label htmlFor="fullName" className={signUpStyles.field}>
                    FULL NAME
                  </label>
                  <div className={signUpStyles.inputContainer}>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`${signUpStyles.input.base} ${
                        errors.fullName
                          ? signUpStyles.input.error
                          : signUpStyles.input.normal
                      } ${signUpStyles.inputWithIcon}`}
                      placeholder="Enter your full name"
                    />
                    <div className={signUpStyles.inputIcon}>
                      <User size={18} />
                    </div>
                  </div>
                  {errors.fullName && (
                    <p className={signUpStyles.errorText}>{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="username" className={signUpStyles.field}>
                    USERNAME
                  </label>
                  <div className={signUpStyles.inputContainer}>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className={`${signUpStyles.input.base} ${
                        errors.username
                          ? signUpStyles.input.error
                          : signUpStyles.input.normal
                      } ${signUpStyles.inputWithIcon}`}
                      placeholder="Create a username"
                    />
                    <div className={signUpStyles.inputIcon}>
                      <Clapperboard size={18} />
                    </div>
                  </div>
                  {errors.username && (
                    <p className={signUpStyles.errorText}>{errors.username}</p>
                  )}
                </div>
              </div>

              <div className={signUpStyles.formGrid}>
                <div>
                  <label htmlFor="email" className={signUpStyles.field}>
                    ENTER EMAIL 
                  </label>
                  <div className={signUpStyles.inputContainer}>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`${signUpStyles.input.base} ${
                        errors.email
                          ? signUpStyles.input.error
                          : signUpStyles.input.normal
                      } ${signUpStyles.inputWithIcon}`}
                      placeholder="Enter your email"
                    />
                    <div className={signUpStyles.inputIcon}>
                      <Mail size={18} />
                    </div>
                  </div>
                  {errors.email && (
                    <p className={signUpStyles.errorText}>{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className={signUpStyles.field}>
                    PHONE NUMBER
                  </label>
                  <div className={signUpStyles.inputContainer}>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className={`${signUpStyles.input.base} ${
                        errors.phone
                          ? signUpStyles.input.error
                          : signUpStyles.input.normal
                      } ${signUpStyles.inputWithIcon}`}
                      placeholder="+91 XXXXXXXXXX"
                    />
                    <div className={signUpStyles.inputIcon}>
                      <Phone size={18} />
                    </div>
                  </div>
                  {errors.phone && (
                    <p className={signUpStyles.errorText}>{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className={signUpStyles.formGrid}>
                <div>
                  <label htmlFor="birthDate" className={signUpStyles.field}>
                    DATE OF BIRTH
                  </label>
                  <div className={signUpStyles.inputContainer}>
                    <input
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      required
                      value={formData.birthDate}
                      onChange={handleChange}
                      className={`${signUpStyles.input.base} ${
                        errors.birthDate
                          ? signUpStyles.input.error
                          : signUpStyles.input.normal
                      } ${signUpStyles.inputWithIcon}`}
                    />
                    <div className={signUpStyles.inputIcon}>
                      <Calendar size={18} />
                    </div>
                  </div>
                  {errors.birthDate && (
                    <p className={signUpStyles.errorText}>{errors.birthDate}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className={signUpStyles.field}>
                    PASSWORD
                  </label>
                  <div className={signUpStyles.inputContainer}>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`${signUpStyles.input.base} ${
                        errors.password
                          ? signUpStyles.input.error
                          : signUpStyles.input.normal
                      } ${signUpStyles.inputWithToggle}`}
                      placeholder="Create a strong password"
                    />
                    <div className={signUpStyles.inputIcon}>
                      <Lock size={18} />
                    </div>
                    <button
                      type="button"
                      className={signUpStyles.passwordToggle}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff size={18} className={signUpStyles.toggleIcon} />
                      ) : (
                        <Eye size={18} className={signUpStyles.toggleIcon} />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className={signUpStyles.errorText}>{errors.password}</p>
                  )}
                </div>
              </div>

              <div className={signUpStyles.submitContainer}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`${signUpStyles.submitButton.base} ${
                    isLoading ? signUpStyles.submitButton.loading : ""
                  }`}
                >
                  {isLoading ? (
                    <div className={signUpStyles.submitContent}>
                      <div className={signUpStyles.loadingSpinner}></div>
                      CREATING YOUR ACCOUNT...
                    </div>
                  ) : (
                    <div className={signUpStyles.submitContent}>
                      <Film size={20} className={signUpStyles.submitIcon} />
                      <span className="font-cinema">CREATE ACCOUNT</span>
                    </div>
                  )}
                </button>
              </div>
            </form>

            <div className={signUpStyles.loginContainer}>
              <p className={signUpStyles.loginText}>
                Already have an account?{" "}
                <a href="/login" className={signUpStyles.loginLink}>
                  Sign in to your account
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{signUpCSS}</style>
    </div>
  );
};

export default SignUpPage;