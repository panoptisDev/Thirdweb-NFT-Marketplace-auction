import Head from 'next/head';
import { Aurora } from '../components/Aurora/Aurora';
import { Listings } from '../components/Listings/Listings';
import commonStyles from '../styles/common.module.css';

export default function Home() {
	return (
		<>
			<Head>
				<title>Marketplace</title>
				<meta name='description' content='Mint, Buy and Sell NFTs' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<div>
				<div className={commonStyles.containerLg}>
					<main>
						<Aurora
							size={{ width: '2200px', height: '2200px' }}
							pos={{ left: '50%', top: '20%' }}
							color='hsl(0deg 0% 50% / 15%)'
						/>
						<Listings />
					</main>
				</div>
			</div>
		</>
	);
}
