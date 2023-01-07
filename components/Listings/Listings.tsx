/* eslint-disable @next/next/no-img-element */
import { useActiveListings, useContract } from '@thirdweb-dev/react';
import styles from './Listings.module.scss';
import { marketplaceContractAddress } from '../../constants';
import { useRouter } from 'next/router';
import { Skeleton } from '../Skeleton/Skeleton';

type ListingCardProps = {
	onClick: () => void;
	img: string;
	name: string;
	price: string;
};

function ListingCard(props: ListingCardProps) {
	return (
		<div className={styles.listingCard} onClick={props.onClick}>
			<div className={styles.assetImgContainer}>
				<img src={props.img} alt='' />
			</div>
			<div className={styles.listingCardInfo}>
				<p className={styles.assetName}>{props.name}</p>
				<p className={styles.assetPrice}>{props.price}</p>
			</div>
		</div>
	);
}

export function ListingCardSkeleton() {
	return (
		<div className={styles.listingCardSkeleton}>
			<Skeleton height='300px' />
			<div className={styles.info}>
				<Skeleton height='20px' margin='0 0 10px 0' width='80%' />
				<Skeleton height='20px' width='30%' />
			</div>
		</div>
	);
}

const ListingsSkeleton = new Array(8).fill(0).map((_, i) => <ListingCardSkeleton key={i} />);

export function Listings() {
	const router = useRouter();
	const marketplaceContractQuery = useContract(marketplaceContractAddress, 'marketplace');
	const activeListingsQuery = useActiveListings(marketplaceContractQuery.contract);

	return (
		<section className={styles.listingSection}>
			<h2 className={styles.listingSectionTitle}> NFTs on Auction </h2>
			<div className={styles.listingGrid}>
				{activeListingsQuery.isLoading
					? ListingsSkeleton
					: activeListingsQuery.data?.map(listing => {
							return (
								<ListingCard
									key={listing.asset.id}
									onClick={() => router.push(`/assets/${listing.id}`)}
									img={listing.asset.image as string}
									name={listing.asset.name as string}
									price={`${listing.buyoutCurrencyValuePerToken.displayValue} ${listing.buyoutCurrencyValuePerToken.symbol}`}
								/>
							);
					  })}
			</div>
		</section>
	);
}
