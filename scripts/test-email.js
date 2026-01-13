/**
 * Email Configuration Test Script
 * 
 * This script tests your email configuration to ensure OTP emails can be sent.
 * Run: node scripts/test-email.js
 */

require('dotenv').config({ path: '.env' })
const nodemailer = require('nodemailer')

console.log('🧪 Testing Email Configuration...\n')

// Check environment variables
console.log('📋 Environment Variables:')
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Missing')
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ Set' : '❌ Missing')
console.log()

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.error('❌ Error: EMAIL_USER and EMAIL_PASSWORD must be set in .env file')
  console.log('\nPlease add these to your .env file:')
  console.log('EMAIL_USER=your-email@gmail.com')
  console.log('EMAIL_PASSWORD=your-app-password')
  console.log('\nSee EMAIL_SETUP_GUIDE.md for detailed instructions.')
  process.exit(1)
}

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

// Test connection
console.log('🔌 Testing SMTP connection...')
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Connection failed:', error.message)
    console.log('\n💡 Troubleshooting tips:')
    console.log('1. For Gmail: Make sure you\'re using an App Password')
    console.log('2. Enable 2-Factor Authentication on your Google account')
    console.log('3. Create App Password at: https://myaccount.google.com/apppasswords')
    console.log('4. Check if your email and password are correct')
    console.log('\nSee EMAIL_SETUP_GUIDE.md for more help.')
    process.exit(1)
  } else {
    console.log('✅ SMTP connection successful!\n')
    
    // Send test email
    console.log('📧 Sending test email...')
    
    const testOTP = Math.floor(100000 + Math.random() * 900000).toString()
    
    const mailOptions = {
      from: {
        name: 'Jharkhand Tourism',
        address: process.env.EMAIL_USER,
      },
      to: process.env.EMAIL_USER, // Send to yourself for testing
      subject: 'Test Email - Jharkhand Tourism Platform',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">🎉 Email Configuration Test</h2>
          <p>Congratulations! Your email configuration is working correctly.</p>
          <div style="background-color: #2563eb; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="margin: 0; letter-spacing: 8px;">${testOTP}</h1>
            <p style="margin: 10px 0 0 0;">Sample OTP Code</p>
          </div>
          <p><strong>What's next?</strong></p>
          <ul>
            <li>Your email OTP system is ready to use</li>
            <li>Start your application with: <code>npm run dev</code></li>
            <li>Test the signup/login flow with email OTP</li>
          </ul>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">
            This is a test email from Jharkhand Tourism Platform.<br>
            If you received this, your email configuration is working perfectly!
          </p>
        </div>
      `,
      text: `Email Configuration Test\n\nCongratulations! Your email configuration is working correctly.\n\nSample OTP: ${testOTP}\n\nYour email OTP system is ready to use.`,
    }
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('❌ Failed to send test email:', error.message)
        process.exit(1)
      } else {
        console.log('✅ Test email sent successfully!')
        console.log('📬 Message ID:', info.messageId)
        console.log('📧 Sent to:', process.env.EMAIL_USER)
        console.log('\n🎉 Success! Check your inbox (and spam folder) for the test email.')
        console.log('\n✨ Your email OTP system is ready to use!')
        console.log('\nNext steps:')
        console.log('1. Start your app: npm run dev')
        console.log('2. Test the signup/login flow')
        console.log('3. Check EMAIL_SETUP_GUIDE.md for more information')
      }
    })
  }
})
