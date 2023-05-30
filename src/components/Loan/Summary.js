import axios from "@/lib/axios"
import { Button, Card, CardActionArea, CardActions, CardContent, CardHeader, LinearProgress } from "@mui/material";
import useSWR from "swr"

const Summary = ({ loanId }) => {

	const { data: loan, error, isValidating } = useSWR(loanId ? `/loans/${loanId}` : null, () =>
		axios
			.get(`/loans/${loanId}`)
			.then(res => res.data)
			.catch(error => {
				throw error
			}),
	)


	if (!loanId) return (<div>Silakan melakukan pencarian terlebih dahulu</div>);
	if (error) return (<div>failed to load</div>);
	if (isValidating && !loan) return (<div>loading...</div>);

	if (loan) return (
		<Card>
			<CardHeader title={`#${loan.id}`} subheader={`${loan.created_at} (${loan.user.name})`}>
				{loan.id}
			</CardHeader>
			<CardContent>
				{loan.id}
				<LinearProgress variant="determinate" value={25/100 * 100} />
			</CardContent>
			<CardActions>
				<Button>Aswd</Button>
			</CardActions>
		</Card>
	)
}

export default Summary