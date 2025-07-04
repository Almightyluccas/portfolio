
'use server'

import { z } from 'zod'
import mysql from 'mysql2/promise'

// Define types for MySQL result
interface MySQLResult {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  serverStatus: number;
  warningCount: number;
  message: string;
  changedRows: number;
}

// Database connection configuration
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// Define a schema for form validation
const ContactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  subject: z.string().min(3, { message: "Subject must be at least 3 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" })
})

export async function submitContactForm(formData: FormData) {
  // Parse the form data using Zod schema
  const validatedFields = ContactFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message')
  })

  // Check if validation fails
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid form data. Please check the details.'
    }
  }

  const { name, email, subject, message } = validatedFields.data

  try {
    // Ensure the database and table exist
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        subject VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Insert contact form data into the database
    const query = `
        INSERT INTO contacts (name, email, subject, message)
        VALUES (?, ?, ?, ?)
    `
    const values = [name, email, subject, message]

    const [result] = await pool.execute<mysql.ResultSetHeader>(query, values)

    return {
      success: true,
      message: 'Message sent successfully!',
      contactId: result.insertId
    }
  } catch (error) {
    console.error('Database insertion error:', error)
    return {
      success: false,
      message: 'Failed to send message. Please try again later.',
      errors: error instanceof Error ? { _: [error.message] } : {}
    }
  }
}