import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // Added this import
import Customer from "../models/customer.model.js";

export const googleAuth = async (req, res) => {
  const { email, name, picture, password } = req.body;
  try {
    if (!email || !name || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const existingCustomer = await Customer.findOne({ email }); // Changed User to Customer
    if (existingCustomer) {
      return res
        .status(200)
        .json({ message: "Customer already exists", user: existingCustomer }); // Changed message and user to customer
    } else {
      // Password hashing is handled by the pre-save hook in your model
      // but Google Auth logic might be different.
      // Your frontend sends googleCreds.sub as the password, so we hash that.
      const hasPass = await bcrypt.hash(password, 12);

      const newCustomer = new Customer({ // Changed User to Customer
        email,
        name,
        picture,
        password: hasPass, // Save the hashed password
        authMethod: "google", // Explicitly set auth method
      });
      await newCustomer.save();
      return res
        .status(201)
        .json({ message: "Customer created successfully", user: newCustomer }); // Changed message and user to customer
    }
  } catch (error) {
    console.error("Error during Google authentication:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signupUser = async (req, res) => {
  const { email, password, name, picture } = req.body;

  try {
    const existingCustomer = await Customer.findOne({ email }); // Changed User to Customer
    if (existingCustomer) {
      return res.status(400).json({ message: "Customer already exists" }); // Changed message
    }
    
    // The pre-save hook in your model will hash the password automatically.
    // So, we don't need to hash it here.
    // const hasPass = await bcrypt.hash(password, 12); // This is now redundant

    const newCustomer = new Customer({ // Changed User to Customer
      email,
      password: password, // Pass the plain password to the model
      name,
      picture,
      authMethod: "email", // Explicitly set auth method
    });
    await newCustomer.save();

    res
      .status(201)
      .json({ message: "Customer created successfully", user: newCustomer }); // Changed message and user to customer
  } catch (error) {
    console.error("Error creating customer:", error); // Changed message
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const customer = await Customer.findOne({ email }); // Changed User to Customer and user to customer
    if (!customer) {
      return res.status(400).json({ message: "Customer does not exist" }); // Changed message
    }

    // Only compare password if auth method is 'email'
    if (customer.authMethod !== 'email') {
      return res.status(400).json({ message: "Please log in using Google." });
    }

    if (customer.password !== password) {
      return res.status(400).json({ message: "wrong password" });
    }

    res.status(200).json({ message: "Login successful", user: customer }); // Changed user to customer
  } catch (error) {
    console.error("Error logging in customer:", error); // Changed message
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const customer = await Customer.findById(userId); // Changed User to Customer and user to customer
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" }); // Changed message
    }

    res.status(200).json({ user: customer }); // Changed user to customer
  } catch (error) {
    console.error("Error fetching customer:", error); // Changed message
    res.status(500).json({ message: "Internal server error" });
  }
};