import { useState, useEffect } from 'react';

type Props = {
	children: JSX.Element | JSX.Element[];
	ssr?: JSX.Element;
};

export function ClientOnly({ children, ssr }: Props) {
	const [hasMounted, setHasMounted] = useState(false);
	useEffect(() => {
		setHasMounted(true);
	}, []);
	if (!hasMounted) {
		return ssr || null;
	}
	return <> {children} </>;
}
