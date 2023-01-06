/* eslint-disable @next/next/no-img-element */
import { useContract, useNFT, useSDK, Web3Button } from '@thirdweb-dev/react';
import { NATIVE_TOKEN_ADDRESS } from '@thirdweb-dev/sdk';
import { useForm } from 'react-hook-form';
import { Aurora } from '../components/Aurora/Aurora';
import { ClientOnly } from '../components/ClientOnly';
import { marketplaceContractAddress } from '../constants';
import styles from '../styles/auction.module.css';

export default function AuctionListingForm() {
	const { register, watch, handleSubmit } = useForm({
		defaultValues: {
			nftContractAddress: '0x52da3Ab5790BB3D13311faaC10dA32CA3C612E3b',
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
	console.log(nftQuery);

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

	console.log(nftQuery.data);

	return (
		<div className={styles.formGrid}>
			<Aurora
				size={{ width: '2400px', height: '2400px' }}
				pos={{ left: '70%', top: '30%' }}
				color='hsl(0deg 0% 50% / 15%)'
			/>

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

			<ClientOnly>
				<div>
					{nftQuery.isLoading && !nftContractQuery.error && (
						<div className={styles.imgLoading}></div>
					)}

					{nftQuery.data && nftQuery.data.metadata.image && (
						<img
							className={styles.assetPreview}
							src={nftQuery.data.metadata.image as string}
							alt=''
							width={380}
						/>
					)}

					{(nftQuery.data && !nftQuery.data.metadata.image) || nftContractQuery.error ? (
						<div className={styles.notFound}> NFT Not Found </div>
					) : null}

					{nftQuery.data && (
						<div>
							<p className={styles.assetName}> {nftQuery.data.metadata.name} </p>
						</div>
					)}
				</div>
			</ClientOnly>
		</div>
	);
}
