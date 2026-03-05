import { createContext, useContext, useState, ReactNode } from 'react';

type Currency = 'USD' | 'KRW' | 'EUR';

interface CurrencyContextType {
	currency: Currency;
	setCurrency: (currency: Currency) => void;
	rate: number;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
	const [currency, setCurrency] = useState<Currency>('USD');

	const rates: Record<Currency, number> = {
		USD: 1,
		KRW: 1320,
		EUR: 0.92,
	};

	return (
		<CurrencyContext.Provider value={{ currency, setCurrency, rate: rates[currency] }}>
			{children}
		</CurrencyContext.Provider>
	);
};

export const useCurrency = () => {
	const context = useContext(CurrencyContext);
	if (!context) throw new Error('useCurrency must be used inside CurrencyProvider');
	return context;
};
