const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { session_id } = req.query

    if (!session_id) {
      return res.status(400).json({ message: "Session ID is required" })
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id)

    // Return relevant session data
    res.status(200).json({
      id: session.id,
      amount_total: session.amount_total,
      currency: session.currency,
      customer_email: session.customer_email,
      payment_status: session.payment_status,
      payment_intent: session.payment_intent,
      metadata: session.metadata,
    })
  } catch (error) {
    console.error("Error retrieving session:", error)
    res.status(500).json({
      message: "Error retrieving session data",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    })
  }
}
