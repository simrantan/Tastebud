import { palette } from "./colors";
import { fontStyles } from "./fonts";

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
