const express = require("express")
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

const router = express.Router()

// Create Stripe checkout session
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { amount, currency = "inr", donorInfo } = req.body

    // Validate amount
    if (!amount || amount < 5000) {
      // Minimum ₹50 in paise
      return res.status(400).json({ message: "Invalid amount. Minimum ₹50 required." })
    }

    // Validate donor info
    if (!donorInfo?.name || !donorInfo?.email) {
      return res.status(400).json({ message: "Donor name and email are required." })
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: "SDG Quest Donation",
              description: `Supporting sustainable development education - Donated by ${donorInfo.name}`,
              images: ["https://sdgquest.org/logo.png"], // Add your logo URL
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: donorInfo.email,
      metadata: {
        donor_name: donorInfo.name,
        donor_email: donorInfo.email,
        donor_message: donorInfo.message || "",
        donation_source: "SDG Quest Website",
      },
      success_url: `${req.get("origin") || "http://localhost:5173"}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.get("origin") || "http://localhost:5173"}/donate?cancelled=true`,
      billing_address_collection: "auto",
    })

    // Log the donation attempt (you can save to database here)
    console.log("Donation session created:", {
      sessionId: session.id,
      amount: amount / 100,
      currency,
      donor: donorInfo.name,
      email: donorInfo.email,
      timestamp: new Date().toISOString(),
    })

    res.status(200).json({
      url: session.url,
      sessionId: session.id,
    })
  } catch (error) {
    console.error("Stripe session creation error:", error)
    res.status(500).json({
      message: "Error creating checkout session",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    })
  }
})

// Get session details
router.get("/session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    res.status(200).json({
      session: {
        id: session.id,
        payment_status: session.payment_status,
        amount_total: session.amount_total,
        currency: session.currency,
        customer_email: session.customer_email,
        metadata: session.metadata,
      },
    })
  } catch (error) {
    console.error("Error retrieving session:", error)
    res.status(500).json({
      message: "Error retrieving session",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    })
  }
})

module.exports = router
