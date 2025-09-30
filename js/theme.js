const LIGHT_MODE = 0;
const DARK_MODE = 1;

let theme = LIGHT_MODE;

function changeTheme(){
  if (theme == LIGHT_MODE){
    document.documentElement.style
        .setProperty('--cor-primaria', 'rgb(216, 216, 216)');
    document.documentElement.style
        .setProperty('--cor-secundaria', 'rgba(0, 0, 0, 0.85)');
    theme = DARK_MODE;
  } else {
    document.documentElement.style
        .setProperty('--cor-primaria', 'rgba(0, 0, 0, 0.85)');
    document.documentElement.style
        .setProperty('--cor-secundaria', 'rgb(216, 216, 216)');
    theme = LIGHT_MODE;
  }
}
