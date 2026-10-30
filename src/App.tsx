import { Theme } from './settings/types';
import { TypelessProfessionalWorkspace } from './components/generated/TypelessProfessionalWorkspace';

let theme: Theme = 'light';

function App() {
  function setTheme(theme: Theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  setTheme(theme);

  return (
    <>
      <TypelessProfessionalWorkspace />
    </>
  ); // %EXPORT_STATEMENT%
}

export default App;
