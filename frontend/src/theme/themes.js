import { palette } from "./colors";

const fontStyles = `
  @font-face {
    font-family: 'Karla';
    src: url('./assets/karla/Karla-Regular.ttf') format('truetype');
    /* Add additional formats and styles (e.g., bold, italic) as needed */
  }

  @font-face {
    font-family: 'Inter';
    src: url('./assets/inter/Inter-Regular.ttf') format('truetype');
    /* Add additional formats and styles (e.g., bold, italic) as needed */
  }

  @font-face {
    font-family: 'Inter-Semi-Bold';
    src: url('./assets/inter/Inter-Semi_Bold.ttf') format('truetype');
    /* Add additional formats and styles (e.g., bold, italic) as needed */
  }
`;

const theme = {
	colors: {
		background: palette.white,
		accentPurple: palette.purple,
		accentPink: palette.pink,
		accentRed: palette.red,
		accentBlue: palette.blue,
		accentBlack: palette.black,
	},

	typography: {
		// Include font styles directly in typography
		...fontStyles,

		title: {
			fontFamily: "Karla",
			fontSize: "2rem", // Adjust the size as needed
		},
		subheading: {
			fontFamily: "Inter-Semi-Bold",
			fontSize: "1.5rem", // Adjust the size as needed
		},
		body: {
			fontFamily: "Inter",
			fontSize: "1rem", // Adjust the size as needed
		},
	},
};

export default theme;
