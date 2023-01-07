import { Skeleton } from '../Skeleton/Skeleton';
import styles from './ListingItemSkeleton.module.css';

export function ListingItemSkeleton() {
	return (
		<div className={styles.listingItemSkeleton}>
			<Skeleton height='300px' />
			<div className={styles.info}>
				<Skeleton height='20px' margin='0 0 10px 0' width='80%' />
				<Skeleton height='20px' width='30%' />
			</div>
		</div>
	);
}
