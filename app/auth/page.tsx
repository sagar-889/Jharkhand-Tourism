'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPin, User, Shield, Building, Eye, EyeOff, Mail, Phone, Lock, Globe, Home, Utensils, Car, Sparkles } from 'lucide-react'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [selectedRole, setSelectedRole] = useState<'tourist' | 'others'>('tourist')
  const [selectedSubRole, setSelectedSubRole] = useState<'travel_provider' | 'hotel_provider' | 'restaurant_provider'>('travel_provider')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [otpStep, setOtpStep] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false)
  const [resetPasswordMode, setResetPasswordMode] = useState(false)
  const [resetIdentifier, setResetIdentifier] = useState('')
  const router = useRouter()

  const [formData, setFormData] = useState({
    identifier: '',
    mobile: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
    name: '',
    email: '',
    licenseNumber: '',
    experience: '',
    languages: '',
    specializations: '',
    department: '',
    position: '',
    businessName: '',
    businessType: '',
    hotelName: '',
    hotelType: '',
    restaurantName: '',
    cuisineType: '',
    address: '',
    description: '',
    services: '',
    amenities: '',
    specialties: ''
  })

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const mode = urlParams.get('mode')
    if (mode === 'login') setIsLogin(true)
    else if (mode === 'signup') setIsLogin(false)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'mobile') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10)
      setFormData({ ...formData, [name]: digitsOnly })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  // Password strength validation
  const validatePassword = (password: string): { isValid: boolean; message: string } => {
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' }
    }
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter' }
    }
    if (!/[a-z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter' }
    }
    if (!/[0-9]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one number' }
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one special character (!@#$%^&*...)' }
    }
    return { isValid: true, message: 'Strong password' }
  }

  const handleSendOTP = async () => {
    if (!formData.email) {
      setError('Please enter your email address')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }
    
    // Validate mobile for signup
    if (!isLogin) {
      if (!formData.mobile || formData.mobile.length !== 10) {
        setError(!formData.mobile ? 'Please enter your mobile number' : 'Mobile number must be exactly 10 digits')
        return
      }

      // Validate password strength
      const passwordValidation = validatePassword(formData.password)
      if (!passwordValidation.isValid) {
        setError(passwordValidation.message)
        return
      }

      // Check if passwords match
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return
      }

      // Check if user already exists
      try {
        const checkResponse = await fetch('/api/auth/check-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email.toLowerCase().trim(),
            mobile: `+91${formData.mobile}`
          })
        })

        const checkData = await checkResponse.json()
        
        if (checkData.exists) {
          setError(checkData.message || 'User already exists with this email or mobile number')
          return
        }
      } catch (err: any) {
        console.error('Error checking user:', err)
        // Continue with OTP sending even if check fails
      }
    }

    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/auth/send-otp-simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.toLowerCase().trim(),
          type: isLogin ? 'login' : 'signup'
        })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to send OTP')
      setOtpSent(true)
      setOtpStep(true)
      setResendTimer(60)
      setError('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError('Please enter the OTP')
      return
    }
    setLoading(true)
    setError('')
    try {
      if (!formData.email) {
        setError('Email is required')
        setLoading(false)
        return
      }
      const actualRole = selectedRole === 'others' ? selectedSubRole : selectedRole
      const payload: any = {
        email: formData.email.toLowerCase().trim(),
        otp: otp,
        type: isLogin ? 'login' : 'signup'
      }
      if (!isLogin) {
        payload.userData = {
          name: formData.name,
          email: formData.email.toLowerCase().trim(),
          mobile: formData.mobile,
          password: formData.password,
          role: actualRole,
          ...(actualRole === 'travel_provider' && {
            businessName: formData.businessName,
            businessType: formData.businessType,
            licenseNumber: formData.licenseNumber,
            address: formData.address,
            description: formData.description,
            services: formData.services ? formData.services.split(',').map(service => service.trim()).filter(service => service) : []
          }),
          ...(actualRole === 'hotel_provider' && {
            hotelName: formData.hotelName,
            hotelType: formData.hotelType,
            address: formData.address,
            description: formData.description,
            amenities: formData.amenities ? formData.amenities.split(',').map(amenity => amenity.trim()).filter(amenity => amenity) : []
          }),
          ...(actualRole === 'restaurant_provider' && {
            restaurantName: formData.restaurantName,
            cuisineType: formData.cuisineType ? formData.cuisineType.split(',').map(cuisine => cuisine.trim()).filter(cuisine => cuisine) : [],
            address: formData.address,
            description: formData.description,
            specialties: formData.specialties ? formData.specialties.split(',').map(specialty => specialty.trim()).filter(specialty => specialty) : []
          })
        }
      }
      const response = await fetch('/api/auth/verify-otp-simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'OTP verification failed')
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('token', data.token)
      switch (data.user.role) {
        case 'tourist': router.push('/main'); break
        case 'travel_guide': router.push('/dashboard/travel-guide'); break
        case 'travel_provider': router.push('/dashboard/travel-provider'); break
        case 'hotel_provider': router.push('/dashboard/hotel-provider'); break
        case 'restaurant_provider': router.push('/dashboard/restaurant-provider'); break
        case 'admin': router.push('/dashboard/admin'); break
        case 'government': router.push('/dashboard/government'); break
        default: router.push('/welcome')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLoginWithPassword = async () => {
    if (!formData.identifier || !formData.password) {
      setError('Please enter email/mobile and password')
      return
    }
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/auth/login-simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: formData.identifier,
          password: formData.password
        })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Login failed')
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('token', data.token)
      switch (data.user.role) {
        case 'tourist': router.push('/main'); break
        case 'travel_guide': router.push('/dashboard/travel-guide'); break
        case 'travel_provider': router.push('/dashboard/travel-provider'); break
        case 'hotel_provider': router.push('/dashboard/hotel-provider'); break
        case 'restaurant_provider': router.push('/dashboard/restaurant-provider'); break
        case 'admin': router.push('/dashboard/admin'); break
        case 'government': router.push('/dashboard/government'); break
        default: router.push('/welcome')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!formData.identifier) {
      setError('Please enter your email or mobile number')
      return
    }
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/auth/forgot-password-simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: formData.identifier })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to send reset OTP')
      setResetIdentifier(formData.identifier)
      setForgotPasswordMode(false)
      setResetPasswordMode(true)
      setError('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!otp || !formData.newPassword || !formData.confirmPassword) {
      setError('Please fill all fields')
      return
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/auth/reset-password-simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: resetIdentifier,
          otp: otp,
          newPassword: formData.newPassword
        })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Password reset failed')
      setResetPasswordMode(false)
      setForgotPasswordMode(false)
      setOtp('')
      setFormData(prev => ({ ...prev, newPassword: '', confirmPassword: '' }))
      setError('')
      alert('Password reset successful! You can now login with your new password.')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (forgotPasswordMode) {
      await handleForgotPassword()
    } else if (resetPasswordMode) {
      await handleResetPassword()
    } else if (isLogin) {
      await handleLoginWithPassword()
    } else {
      if (!otpStep) {
        await handleSendOTP()
      } else {
        await handleVerifyOTP()
      }
    }
  }

  const roleIcons = {
    tourist: User,
    others: Building
  }

  const roleDescriptions = {
    tourist: 'Explore amazing destinations and book your perfect trip',
    others: 'Provide travel, hotel, or restaurant services to tourists'
  }

  const subRoleOptions = {
    travel_provider: { label: 'Travel Services', icon: Car },
    hotel_provider: { label: 'Hotel Services', icon: Home },
    restaurant_provider: { label: 'Restaurant Services', icon: Utensils }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800/30 bg-[size:20px_20px] opacity-30"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-4xl w-full relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Panel - Brand & Info */}
          <div className="hidden md:block">
            <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 lg:p-12 shadow-2xl shadow-blue-500/20 backdrop-blur-sm border border-white/20">
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Jharkhand Tourism</h1>
                  <p className="text-blue-100/80 font-medium">Explore the Heart of India</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Discover Hidden Gems</h3>
                    <p className="text-blue-100/80">From ancient temples to breathtaking waterfalls, experience the untouched beauty of Jharkhand.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Authentic Experiences</h3>
                    <p className="text-blue-100/80">Immerse yourself in tribal culture and local traditions with our curated experiences.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Secure & Reliable</h3>
                    <p className="text-blue-100/80">Your safety and satisfaction are our top priorities with verified partners.</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-white/20">
                <p className="text-blue-100/70 text-sm italic">"The land of forests, the kingdom of minerals, and the paradise of nature."</p>
              </div>
            </div>
          </div>

          {/* Right Panel - Auth Form */}
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-blue-500/10 border border-gray-200/30 dark:border-gray-700/30">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30"></div>
                  <div className="relative bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome to Jharkhand Tourism
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in or create your account to continue</p>
            </div>

            {/* Toggle Login/Signup */}
            {!forgotPasswordMode && !resetPasswordMode && (
              <div className="flex bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-1 mb-8 shadow-inner">
                <button
                  onClick={() => { setIsLogin(true); setOtpStep(false); setError('') }}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${isLogin 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => { setIsLogin(false); setOtpStep(false); setError('') }}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${!isLogin 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Forgot Password Header */}
            {(forgotPasswordMode || resetPasswordMode) && (
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl mb-4">
                  <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {forgotPasswordMode ? 'Forgot Password' : 'Reset Password'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {forgotPasswordMode 
                    ? 'Enter your email or mobile number to reset your password' 
                    : 'Enter the OTP sent to your mobile and your new password'
                  }
                </p>
              </div>
            )}

            {/* Role Selection */}
            {!isLogin && !forgotPasswordMode && !resetPasswordMode && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Choose your role
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(roleIcons).map(([role, Icon]) => {
                      const IconComponent = Icon
                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setSelectedRole(role as any)}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 group ${selectedRole === role
                            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-lg shadow-blue-500/10'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md'
                          }`}
                        >
                          <div className={`flex items-center justify-center h-10 w-10 mx-auto mb-2 rounded-lg ${selectedRole === role 
                            ? 'bg-gradient-to-br from-blue-500 to-indigo-500' 
                            : 'bg-gray-100 dark:bg-gray-800'
                          }`}>
                            <IconComponent className={`h-5 w-5 ${selectedRole === role ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                          </div>
                          <div className={`text-sm font-semibold capitalize ${selectedRole === role 
                            ? 'text-blue-700 dark:text-blue-400' 
                            : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {role.replace('_', ' ')}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {roleDescriptions[role as keyof typeof roleDescriptions]}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Sub-role Selection */}
                {selectedRole === 'others' && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Choose your service type
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(subRoleOptions).map(([subRole, { label, icon: Icon }]) => (
                        <button
                          key={subRole}
                          type="button"
                          onClick={() => setSelectedSubRole(subRole as any)}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center space-x-4 ${selectedSubRole === subRole
                            ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-lg shadow-blue-500/10'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md'
                          }`}
                        >
                          <div className={`flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg ${selectedSubRole === subRole 
                            ? 'bg-gradient-to-br from-blue-500 to-indigo-500' 
                            : 'bg-gray-100 dark:bg-gray-800'
                          }`}>
                            <Icon className={`h-5 w-5 ${selectedSubRole === subRole ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                          </div>
                          <div className={`text-sm font-semibold ${selectedSubRole === subRole 
                            ? 'text-blue-700 dark:text-blue-400' 
                            : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
              )}

              {/* Email/Mobile Input for Login and Forgot Password */}
              {(isLogin || forgotPasswordMode) && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email or Mobile Number
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="identifier"
                      value={formData.identifier}
                      onChange={handleInputChange}
                      placeholder="Enter your email or mobile number"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>
                </div>
              )}

              {/* Email Address for Signup */}
              {!isLogin && !forgotPasswordMode && !resetPasswordMode && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@example.com"
                      required
                      disabled={otpStep}
                      className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>
                </div>
              )}

              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    <span className="absolute left-12 top-3.5 text-gray-600 dark:text-gray-400 font-medium">+91</span>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="9876543210"
                      required
                      disabled={otpStep}
                      maxLength={10}
                      className="w-full pl-20 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-4">Enter 10-digit mobile number</p>
                </div>
              )}

              {otpStep && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Enter OTP
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      required
                      className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-center text-2xl tracking-widest font-semibold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                    OTP sent to <span className="font-semibold text-blue-600 dark:text-blue-400">{formData.email || formData.mobile}</span>
                  </p>
                  {resendTimer > 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                      Resend OTP in <span className="font-semibold text-blue-600 dark:text-blue-400">{resendTimer}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium mt-2 block mx-auto hover:underline transition-colors"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              )}

              {/* Password for Login */}
              {isLogin && !forgotPasswordMode && !resetPasswordMode && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your password"
                      className="w-full pl-12 pr-12 py-3 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Password for Signup */}
              {!isLogin && !forgotPasswordMode && !resetPasswordMode && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        disabled={otpStep}
                        placeholder="Create a strong password"
                        className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-50 disabled:text-gray-500 text-gray-900 placeholder-gray-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Must be 8+ characters with uppercase, lowercase, number, and special character
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        disabled={otpStep}
                        placeholder="Re-enter your password"
                        className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-50 disabled:text-gray-500 text-gray-900 placeholder-gray-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Reset Password Fields */}
              {resetPasswordMode && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      required
                      className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-center text-xl tracking-widest text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        required
                        minLength={6}
                        className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        minLength={6}
                        className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Provider-specific fields */}
              {!isLogin && selectedRole === 'others' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      disabled={otpStep}
                      placeholder="Complete business address"
                      className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-gray-100 dark:disabled:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      disabled={otpStep}
                      placeholder="Describe your business and services"
                      rows={3}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-gray-100 dark:disabled:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>

                  {/* Travel Provider specific fields */}
                  {selectedSubRole === 'travel_provider' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Business Name
                        </label>
                        <input
                          type="text"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleInputChange}
                          required
                          disabled={otpStep}
                          className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-gray-100 dark:disabled:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Business Type
                        </label>
                        <select
                          name="businessType"
                          value={formData.businessType}
                          onChange={handleInputChange}
                          required
                          disabled={otpStep}
                          className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-gray-100 dark:disabled:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          <option value="">Select business type</option>
                          <option value="travel_agency">Travel Agency</option>
                          <option value="tour_operator">Tour Operator</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          License Number
                        </label>
                        <input
                          type="text"
                          name="licenseNumber"
                          value={formData.licenseNumber}
                          onChange={handleInputChange}
                          required
                          disabled={otpStep}
                          className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-gray-100 dark:disabled:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Services (comma separated)
                        </label>
                        <input
                          type="text"
                          name="services"
                          value={formData.services}
                          onChange={handleInputChange}
                          placeholder="Tour packages, Transportation, Guide services"
                          disabled={otpStep}
                          className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-gray-100 dark:disabled:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        />
                      </div>
                    </>
                  )}

                  {/* Hotel Provider specific fields */}
                  {selectedSubRole === 'hotel_provider' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Hotel Name
                        </label>
                        <input
                          type="text"
                          name="hotelName"
                          value={formData.hotelName}
                          onChange={handleInputChange}
                          required
                          disabled={otpStep}
                          className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-gray-100 dark:disabled:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Hotel Type
                        </label>
                        <select
                          name="hotelType"
                          value={formData.hotelType}
                          onChange={handleInputChange}
                          required
                          disabled={otpStep}
                          className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-gray-100 dark:disabled:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          <option value="">Select hotel type</option>
                          <option value="hotel">Hotel</option>
                          <option value="resort">Resort</option>
                          <option value="guesthouse">Guest House</option>
                          <option value="lodge">Lodge</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Amenities (comma separated)
                        </label>
                        <input
                          type="text"
                          name="amenities"
                          value={formData.amenities}
                          onChange={handleInputChange}
                          placeholder="WiFi, AC, Restaurant, Pool, Spa"
                          disabled={otpStep}
                          className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-gray-100 dark:disabled:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        />
                      </div>
                    </>
                  )}

                  {/* Restaurant Provider specific fields */}
                  {selectedSubRole === 'restaurant_provider' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Restaurant Name
                        </label>
                        <input
                          type="text"
                          name="restaurantName"
                          value={formData.restaurantName}
                          onChange={handleInputChange}
                          required
                          disabled={otpStep}
                          className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-gray-100 dark:disabled:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Cuisine Type (comma separated)
                        </label>
                        <input
                          type="text"
                          name="cuisineType"
                          value={formData.cuisineType}
                          onChange={handleInputChange}
                          placeholder="Indian, Chinese, Continental, Local"
                          disabled={otpStep}
                          className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-gray-100 dark:disabled:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Specialties (comma separated)
                        </label>
                        <input
                          type="text"
                          name="specialties"
                          value={formData.specialties}
                          onChange={handleInputChange}
                          placeholder="Tribal cuisine, Vegetarian, Seafood"
                          disabled={otpStep}
                          className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-gray-100 dark:disabled:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        />
                      </div>
                    </>
                  )}
                </>
              )}

              {error && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-2 border-red-200 dark:border-red-700 rounded-xl p-4 animate-shake">
                  <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 px-6 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] group"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Please wait...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    {forgotPasswordMode ? 'Send Reset OTP' :
                      resetPasswordMode ? 'Reset Password' :
                        otpStep ? 'Verify OTP' :
                          isLogin ? 'Login to Account' : 'Send OTP & Sign Up'}
                    <svg className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                )}
              </button>

              {/* Forgot Password Link */}
              {isLogin && !forgotPasswordMode && !resetPasswordMode && (
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotPasswordMode(true)
                      setError('')
                    }}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors hover:underline"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}

              {/* Back to Login Links */}
              {(forgotPasswordMode || resetPasswordMode) && (
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotPasswordMode(false)
                      setResetPasswordMode(false)
                      setOtp('')
                      setError('')
                    }}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors inline-flex items-center gap-1 hover:gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Login
                  </button>
                </div>
              )}
            </form>

            {/* Terms and Conditions */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                By continuing, you agree to our{' '}
                <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</a>
              </p>
            </div>

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors inline-flex items-center gap-1 hover:gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animations to Tailwind config */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}