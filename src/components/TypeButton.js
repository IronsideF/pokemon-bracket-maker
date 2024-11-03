export default function TypeButton({buttonText, buttonLink, onClick}) {
    return (<button onClick={() => onClick(buttonLink)}>{buttonText}</button>);
  }