import { ConnectWallet } from '@thirdweb-dev/react';
import Link from 'next/link';
import styles from './Nav.module.scss';

export function Nav() {
	return (
		<div className='container'>
			<nav className={styles.nav}>
				{/* Left */}
				<Link href='/' className={styles.homeLink}>
					NFT Marketplace
				</Link>

				{/* Right */}
				<div className={styles.navRight}>
					<Link href='/auction' className={styles.buttonLink}>
						Create Auction
					</Link>
					<div className={styles.connectWalletContainer}>
						<ConnectWallet />
					</div>
				</div>
			</nav>
		</div>
	);
}
