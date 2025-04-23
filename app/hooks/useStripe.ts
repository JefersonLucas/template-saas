import { useEffect, useState } from "react"
import { Stripe, loadStripe } from "@stripe/stripe-js"

export function useStripe() {
	const [stripe, setStripe] = useState<Stripe | null>(null)

	useEffect(() => {
		async function loadStripeAsync() {
			if (!process.env.NEXT_PUBLIC_STRIPE_PUB_KEY) {
				throw new Error("NEXT_PUBLIC_STRIPE_PUB_KEY is not set")
			}

			const stripeInstance = await loadStripe(
				process.env.NEXT_PUBLIC_STRIPE_PUB_KEY,
			)
			setStripe(stripeInstance)
		}
		loadStripeAsync()
	}, [])

	// Essa função faz a geração de um pagamento único.
	async function createPaymentStripeCheckout(checkoutData: any) {
		if (!stripe) return

		try {
			const response = await fetch("/api/stripe/create-pay-checkout", {
				method: "POST",
				headers: {
					"CONTENT-TYPE": "application/json",
				},
				body: JSON.stringify(checkoutData),
			})

			const data = await response.json()

			await stripe.redirectToCheckout({ sessionId: data.id })
		} catch (error) {
			console.error(error)
		}
	}

	// Essa função faz a criação de um pagamento (assinatura)
	async function createSubscriptionCheckout(checkoutData: any) {
		if (!stripe) return

		try {
			const response = await fetch("/api/stripe/create-subscription-checkout", {
				method: "POST",
				headers: {
					"CONTENT-TYPE": "application/json",
				},
				body: JSON.stringify(checkoutData),
			})

			const data = await response.json()

			await stripe.redirectToCheckout({ sessionId: data.id })
		} catch (error) {
			console.error(error)
		}
	}

	// Essa função cria o link para o portal do cliente
	async function handleCreateStripePortal() {
		const response = await fetch("/api/stripe/create-portal", {
			method: "POST",
			headers: {
				"CONTENT-TYPE": "application/json",
			},
		})

		const data = await response.json()

		window.location.href = data.url
	}

	return {
		createPaymentStripeCheckout,
		createSubscriptionCheckout,
		handleCreateStripePortal,
	}
}
