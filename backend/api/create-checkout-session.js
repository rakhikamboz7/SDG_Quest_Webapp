const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

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
              images: ["https://your-domain.com/sdg-quest-logo.png"], // Add your logo URL
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
      success_url: `${req.headers.origin}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/donate?cancelled=true`,
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
}
