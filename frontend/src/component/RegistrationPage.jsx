"use client"

import { useState } from "react"
import { Eye, EyeOff, Upload, Check, AlertCircle } from "lucide-react"

export default function RegistrationPage() {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    profilePic: null,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [previewImage, setPreviewImage] = useState("https://clipground.com/images/white-profile-icon-png-7.png")
  const [errors, setErrors] = useState({})
  const [passwordStrength, setPasswordStrength] = useState(0)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Password strength check
    if (name === "password") {
      let strength = 0
      if (value.length >= 8) strength += 1
      if (/[A-Z]/.test(value)) strength += 1
      if (/[0-9]/.test(value)) strength += 1
      if (/[^A-Za-z0-9]/.test(value)) strength += 1
      setPasswordStrength(strength)
    }

    // Clear error when field is being edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({
        ...formData,
        profilePic: file,
      })

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.username.trim()) newErrors.username = "Username is required"
    if (!formData.name.trim()) newErrors.name = "Name is required"

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\d{10,15}$/.test(formData.phone.replace(/[^0-9]/g, ""))) {
      newErrors.phone = "Phone number is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
  
      console.log("Form submitted:", formData)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-4xl w-full grid md:grid-cols-5">
        {/* Left side - Form */}
        <div className="p-8 md:col-span-3">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create your account</h1>
            <p className="text-gray-600">Join our community and start your journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${errors.username ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="johndoe"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle size={12} className="mr-1" /> {errors.username}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${errors.name ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle size={12} className="mr-1" /> {errors.name}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle size={12} className="mr-1" /> {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${errors.phone ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="+91 **********"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle size={12} className="mr-1" /> {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${errors.password ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle size={12} className="mr-1" /> {errors.password}
                </p>
              )}

              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center mb-1">
                    <span className="text-xs text-gray-600 mr-2">Password strength:</span>
                    <div className="h-1 flex-1 flex space-x-1">
                      <div
                        className={`h-full rounded-full flex-1 ${passwordStrength >= 1 ? "bg-red-400" : "bg-gray-200"}`}
                      ></div>
                      <div
                        className={`h-full rounded-full flex-1 ${passwordStrength >= 2 ? "bg-yellow-400" : "bg-gray-200"}`}
                      ></div>
                      <div
                        className={`h-full rounded-full flex-1 ${passwordStrength >= 3 ? "bg-green-400" : "bg-gray-200"}`}
                      ></div>
                      <div
                        className={`h-full rounded-full flex-1 ${passwordStrength >= 4 ? "bg-green-600" : "bg-gray-200"}`}
                      ></div>
                    </div>
                    <span className="text-xs ml-2">
                      {passwordStrength === 0 && "Weak"}
                      {passwordStrength === 1 && "Fair"}
                      {passwordStrength === 2 && "Good"}
                      {passwordStrength === 3 && "Strong"}
                      {passwordStrength === 4 && "Very Strong"}
                    </span>
                  </div>
                  <ul className="text-xs text-gray-500 space-y-1 mt-1">
                    <li className={`flex items-center ${formData.password.length >= 8 ? "text-green-600" : ""}`}>
                      {formData.password.length >= 8 ? (
                        <Check size={12} className="mr-1" />
                      ) : (
                        <span className="w-3 mr-1" />
                      )}
                      At least 8 characters
                    </li>
                    <li className={`flex items-center ${/[A-Z]/.test(formData.password) ? "text-green-600" : ""}`}>
                      {/[A-Z]/.test(formData.password) ? (
                        <Check size={12} className="mr-1" />
                      ) : (
                        <span className="w-3 mr-1" />
                      )}
                      At least one uppercase letter
                    </li>
                    <li className={`flex items-center ${/[0-9]/.test(formData.password) ? "text-green-600" : ""}`}>
                      {/[0-9]/.test(formData.password) ? (
                        <Check size={12} className="mr-1" />
                      ) : (
                        <span className="w-3 mr-1" />
                      )}
                      At least one number
                    </li>
                    <li
                      className={`flex items-center ${/[^A-Za-z0-9]/.test(formData.password) ? "text-green-600" : ""}`}
                    >
                      {/[^A-Za-z0-9]/.test(formData.password) ? (
                        <Check size={12} className="mr-1" />
                      ) : (
                        <span className="w-3 mr-1" />
                      )}
                      At least one special character
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              Create Account
            </button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a href="#" className="text-purple-600 hover:text-purple-800 font-medium">
                Sign in
              </a>
            </p>
          </form>
        </div>

        {/* Right side - Profile Picture */}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-8 flex flex-col items-center justify-center md:col-span-2">
          <div className="text-center mb-6">
            <h2 className="text-white text-xl font-bold mb-2">Profile Picture</h2>
            <p className="text-purple-200 text-sm">Add a photo to personalize your account</p>
          </div>

          <div className="relative w-48 h-48 mb-6">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src={previewImage || "/placeholder.svg"}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            </div>
            <label className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <Upload size={20} className="text-purple-600" />
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>

          <div className="text-center text-white text-sm">
            <p>Recommended: Square image,</p>
            <p>at least 300x300 pixels</p>
          </div>
        </div>
      </div>
    </div>
  )
}
