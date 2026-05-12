/**
 * Global Styles - Design system and base styles
 */

export const GlobalStyles = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');

/* Reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Design Tokens */
:root {
  --navy: #1F4E79;
  --navy-light: #2E6DA4;
  --navy-pale: #EBF3FA;
  --green: #375623;
  --red: #C00000;
  --amber: #7F3F00;
  --gray: #595959;
  --gray-light: #F5F5F5;
  --border: #E0E0E0;
  --white: #FFFFFF;
  --text: #1a1a1a;
  --text-muted: #666;
}

/* Base */
html, body {
  height: 100%;
  background: #F0F4F8;
  font-family: 'Noto Sans KR', sans-serif;
  color: var(--text);
}

/* App Layout */
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
header {
  background: var(--white);
  border-bottom: 1px solid var(--border);
  padding: 0 40px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

main {
  flex: 1;
  padding: 40px;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
}

/* Text Colors */
.c-navy { color: var(--navy); }
.c-green { color: var(--green); }
.c-red { color: var(--red); }
.c-amber { color: var(--amber); }
`;

export default GlobalStyles;
