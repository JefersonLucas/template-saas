"use server"

import { handleAuth } from "@/app/actions/handle-auth"
import { auth } from "@/app/lib/auth"
import { redirect } from "next/navigation"

export default async function Dashboard() {
	// Estamos no lado do servidor
	const session = await auth()
	console.log(session)

	if (!session) {
		redirect("/login")
	}

	return (
		<div className="flex flex-col gap-10 items-center justify-center h-screen">
			<h1 className="text-4xl font-bold">Protected Dashboard</h1>
			<p>Name: {session?.user?.name}</p>
			<p>Email: {session?.user?.email}</p>

			{session.user?.email && (
				<form action={handleAuth}>
					<button
						type="submit"
						className="border rounded-md px-2 cursor-pointer"
					>
						Logout
					</button>
				</form>
			)}
		</div>
	)
}
