import Typography from "typography"
// import Wordpress2016 from "typography-theme-wordpress-2016"

// Wordpress2016.overrideThemeStyles = () => {
//   return {
//     "a.gatsby-resp-image-link": {
//       boxShadow: `none`,
//     },
//   }
// }

// delete Wordpress2016.googleFonts

// const typography = new Typography(Wordpress2016)

// import moragaTheme from "typography-theme-moraga"
// const typography = new Typography(moragaTheme)
// import irvingTheme from "typography-theme-irving"
// const typography = new Typography(irvingTheme)

const typography = new Typography({
  baseFontSize: '18px',
  baseLineHeight: 1.66,
  headerFontFamily: ['Fira Mono','Verdana','Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
  bodyFontFamily: ['Lora','Georgia', 'serif'],
  // See below for the full list of options.
})

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
