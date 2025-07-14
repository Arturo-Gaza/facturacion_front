import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
export const FooterLayout = () => {
	return (
		<Typography variant='body2' color='textSecondary' align='center'>
			{'Copyright @'}
			<Link href='#'>Alltub</Link>
			{new Date().getFullYear()}
		</Typography>
	)
}
