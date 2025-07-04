
"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Send } from "lucide-react"
import { z } from 'zod'
import { submitContactForm } from "@/app/actions"

export default function ContactSection() {
  const formRef = useRef<HTMLFormElement>(null)
  const [errors, setErrors] = useState<{
    name?: string[];
    email?: string[];
    subject?: string[];
    message?: string[];
    _?: string[];
  }>({})
  const [submitStatus, setSubmitStatus] = useState<{
    message: string;
    isSuccess: boolean;
  } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const ContactFormSchema = z.object({
    name: z.string()
      .min(2, { message: "Name must be at least 2 characters" })
      .max(50, { message: "Name cannot exceed 50 characters" }),
    email: z.string()
      .email({ message: "Invalid email address" })
      .max(100, { message: "Email cannot exceed 100 characters" }),
    subject: z.string()
      .min(3, { message: "Subject must be at least 3 characters" })
      .max(100, { message: "Subject cannot exceed 100 characters" }),
    message: z.string()
      .min(10, { message: "Message must be at least 10 characters" })
      .max(500, { message: "Message cannot exceed 500 characters" })
  })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // Get form using ref
    const form = formRef.current
    if (!form) {
      console.error('Form reference is null')
      return
    }

    setIsSubmitting(true)
    setErrors({})
    setSubmitStatus(null)

    // Collect form data
    const formData = new FormData(form)
    const formValues = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string
    }

    try {
      // Validate form data
      const validatedData = ContactFormSchema.safeParse(formValues)

      if (!validatedData.success) {
        // Handle validation errors
        const fieldErrors = validatedData.error.flatten().fieldErrors
        setErrors(fieldErrors)
        setSubmitStatus({
          message: 'Please correct the errors in the form.',
          isSuccess: false
        })
        return
      }

      // Submit form data
      const result = await submitContactForm(formData)

      if (result.success) {
        // Reset form using ref
        form.reset()
        setSubmitStatus({
          message: result.message || 'Message sent successfully!',
          isSuccess: true
        })
      } else {
        // Handle server errors - safely set errors with proper type checking
        if (result.errors) {
          const serverErrors: typeof errors = {}

          // Handle field-specific errors
          if ('name' in result.errors) serverErrors.name = result.errors.name
          if ('email' in result.errors) serverErrors.email = result.errors.email
          if ('subject' in result.errors) serverErrors.subject = result.errors.subject
          if ('message' in result.errors) serverErrors.message = result.errors.message

          // Handle general errors
          if ('_' in result.errors) serverErrors._ = result.errors._

          setErrors(serverErrors)
        }

        setSubmitStatus({
          message: result.message || 'Failed to send message.',
          isSuccess: false
        })
      }
    } catch (error) {
      console.error('Submission error:', error)
      setSubmitStatus({
        message: 'An unexpected error occurred.',
        isSuccess: false
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
      <CardHeader>
        <CardTitle className="text-white text-xl sm:text-2xl">Send a Message</CardTitle>
        <CardDescription className="text-gray-400 text-base sm:text-lg">
          Fill out the form below and I&apos;ll get back to you as soon as possible.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300 font-medium text-sm sm:text-base">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Your full name"
                className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20 h-10 sm:h-12 text-sm sm:text-base"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 font-medium text-sm sm:text-base">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20 h-10 sm:h-12 text-sm sm:text-base"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>
              )}
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <Label htmlFor="subject" className="text-gray-300 font-medium text-sm sm:text-base">
              Subject
            </Label>
            <Input
              id="subject"
              name="subject"
              placeholder="What's this about?"
              className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20 h-10 sm:h-12 text-sm sm:text-base"
            />
            {errors.subject && (
              <p className="text-red-500 text-xs mt-1">{errors.subject[0]}</p>
            )}
          </div>

          <div className="space-y-2 mt-4">
            <Label htmlFor="message" className="text-gray-300 font-medium text-sm sm:text-base">
              Message
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell me about your project or just say hello..."
              rows={5}
              className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20 resize-none text-sm sm:text-base"
            />
            {errors.message && (
              <p className="text-red-500 text-xs mt-1">{errors.message[0]}</p>
            )}
          </div>

          {/* Add error display for general errors */}
          {errors._ && (
            <div className="text-sm text-red-500 mt-2">
              {errors._[0]}
            </div>
          )}

          {submitStatus && (
            <div className={`
              mt-4 p-3 rounded-md text-sm 
              ${submitStatus.isSuccess
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
            }
            `}>
              {submitStatus.message}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-3 sm:py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25 text-sm sm:text-base"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}