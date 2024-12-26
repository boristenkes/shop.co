export default async function DashboardIDPage({
	params
}: {
	params: Promise<{ id: string }>
}) {
	const id = (await params).id

	return <h1>Dashboard ID Page: {id}</h1>
}
