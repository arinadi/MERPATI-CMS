export class ThemeEngine {
    getThemeConfig() {
        return {
            name: 'Default MERPATI Theme',
            version: '1.0.0',
            settings: {
                typography: {
                    fontFamily: 'Inter, sans-serif'
                },
                colors: {
                    primary: '#2271B1',
                    background: '#FFFFFF'
                }
            }
        };
    }

    getLayout() {
        return {
            header: true,
            footer: true,
            sidebar: false
        };
    }
}

export const themeEngine = new ThemeEngine();
