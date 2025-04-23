import stripe from "@/app/lib/stripe"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
	const { testeId } = await req.json()

	if (!process.env.STRIPE_SUBSCRIPTION_PRICE_ID) {
		throw new Error("STRIPE_SUBSCRIPTION_PRICE_ID is not set")
	}

	const price = process.env.STRIPE_SUBSCRIPTION_PRICE_ID

	if (!price) {
		return NextResponse.json({ error: "Price not found" }, { status: 500 })
	}

	const metadata = {
		testeId,
	}

	// Precisamso criar um cliente na Stripe para ter referência quando for criar o portal

	try {
		const session = await stripe.checkout.sessions.create({
			line_items: [{ price, quantity: 1 }],
			mode: "payment",
			payment_method_types: ["card", "boleto"],
			success_url: `${req.headers.get("origin")}/success`,
			cancel_url: `${req.headers.get("origin")}/`,
			metadata,
		})

		if (!session.url) {
			return NextResponse.json(
				{ error: "Sesion URL not found" },
				{ status: 500 },
			)
		}

		return NextResponse.json({ sessionId: session.id }, { status: 200 })
	} catch (error) {
		console.error(error)
		return NextResponse.error()
	}
}
