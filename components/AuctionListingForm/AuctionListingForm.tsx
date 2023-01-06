/* eslint-disable @next/next/no-img-element */
import { useContract, useNFT, Web3Button } from '@thirdweb-dev/react';
import { NATIVE_TOKEN_ADDRESS } from '@thirdweb-dev/sdk';
import { useForm } from 'react-hook-form';
import { marketplaceContractAddress } from '../../constants';
import styles from './AuctionListingForm.module.css';

export function AuctionListingForm() {
	const { register, watch, handleSubmit } = useForm({
		defaultValues: {
			nftContractAddress: '0x...',
			tokenId: '0',
			startDate: new Date(),
			startTime: new Date(),
			endDate: new Date(),
			endTime: new Date(),
			floorPrice: '0',
			buyoutPrice: '10',
		},
	});

	const nftContractQuery = useContract(watch('nftContractAddress'));
	const nftQuery = useNFT(nftContractQuery.contract, watch('tokenId'));

	const marketplaceContractQuery = useContract(marketplaceContractAddress, 'marketplace');

	async function createAuctionListing() {
		const marketplaceContract = marketplaceContractQuery.contract;
		if (!marketplaceContract) return;

		const startTimestamp = new Date(watch('startDate') + ', ' + watch('startTime'));

		const d1 = new Date(watch('startDate') + ', ' + watch('startTime'));
		const d2 = new Date(watch('endDate') + ', ' + watch('endTime'));
		// get diff in seconds
		const diff = (d2.getTime() - d1.getTime()) / 1000;

		console.log({
			assetContractAddress: watch('nftContractAddress'),
			buyoutPricePerToken: watch('buyoutPrice'),
			currencyContractAddress: NATIVE_TOKEN_ADDRESS,
			listingDurationInSeconds: diff,
			quantity: 1,
			reservePricePerToken: watch('floorPrice'),
			startTimestamp: startTimestamp,
			tokenId: watch('tokenId'),
		});

		debugger;

		try {
			const transaction = await marketplaceContract.auction.createListing({
				assetContractAddress: watch('nftContractAddress'),
				buyoutPricePerToken: watch('buyoutPrice'),
				currencyContractAddress: NATIVE_TOKEN_ADDRESS,
				listingDurationInSeconds: diff,
				quantity: 1,
				reservePricePerToken: watch('floorPrice'),
				startTimestamp: startTimestamp,
				tokenId: watch('tokenId'),
			});

			return transaction;
		} catch (error) {
			console.error(error);
		}
	}

	console.log(watch());

	return (
		<div className={styles.formGrid}>
			<form
				className={styles.form}
				onSubmit={handleSubmit(data => {
					console.log('data');
				})}
			>
				<fieldset>
					<legend className={styles.sectionTitle}> What </legend>

					<label>
						<span> NFT Contract Address </span>
						<input type='text' {...register('nftContractAddress')} />
					</label>

					<label>
						<span> Token Id </span>
						<input type='text' {...register('tokenId')} />
					</label>
				</fieldset>

				<div className={styles.spacer}></div>

				<fieldset className={styles.rowGroup}>
					<legend className={styles.sectionTitle}> When </legend>

					<fieldset className={styles.colGroup}>
						<legend> Auction Starts on </legend>
						<label>
							<input type='date' {...register('startDate')} aria-label='Auction Start Day' />
						</label>

						<label>
							<input type='time' {...register('startTime')} aria-label='Auction Start Time' />
						</label>
					</fieldset>

					<fieldset className={styles.colGroup}>
						<legend> Auction Ends on </legend>
						<label>
							<input type='date' {...register('endDate')} aria-label='Auction End Date' />
						</label>

						<label>
							<input type='time' {...register('endTime')} aria-label='Auction End Time' />
						</label>
					</fieldset>
				</fieldset>

				<div className={styles.spacer}></div>

				<fieldset>
					<legend className={styles.sectionTitle}> Price </legend>

					<label>
						<span> Floor Price </span>
						<input type='text' step={0.00000000001} {...register('floorPrice')} />
					</label>

					<label>
						<span> Buyout Price </span>
						<input type='text' step={0.00000000001} {...register('buyoutPrice')} />
					</label>
				</fieldset>

				<Web3Button
					action={createAuctionListing}
					contractAddress={marketplaceContractAddress}
					className={styles.createAuctionBtn}
				>
					Create Auction
				</Web3Button>
			</form>

			<div>
				{nftQuery.isLoading ? 'is loading' : 'is not loading'}
				{nftQuery.data && <img src={nftQuery.data.metadata.image as string} alt='' height={400} />}
			</div>
		</div>
	);
}
