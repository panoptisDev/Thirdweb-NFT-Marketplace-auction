import styles from './Aurora.module.css';

interface AuroraProps {
	size: { width: string; height: string };
	pos: { top: string; left: string };
	color: string;
}

export const Aurora: React.FC<AuroraProps> = ({ color, pos, size }) => {
	return (
		<div
			className={styles.aurora}
			style={{
				width: size.width,
				height: size.height,
				top: pos.top,
				left: pos.left,
				backgroundImage: `radial-gradient(ellipse at center, ${color}, transparent 60%)`,
			}}
		></div>
	);
};
