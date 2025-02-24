import i18n from 'sveltekit-i18n';

/** @type {import('sveltekit-i18n').Config} */
const config = ({
    loaders: [
        {
            locale: 'en',
            key: '',
            loader: async () => (
                await import('./en.json')
            ).default,
        },
        {
            locale: 'hu',
            key: '',
            loader: async () => (
                await import('./hu.json')
            ).default,
        },
    ],
});

export const defaultLocale = 'hu';

export const { t, locale, locales, loading, addTranslations, loadTranslations, translations, setRoute, setLocale } = new i18n(config);
