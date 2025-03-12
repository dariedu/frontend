




type TTextEdit = {
  text: string
}

const textPosition = {
  middle: "<m>",
  left: "<l>",
  right: "<r>",
  stretch: "<s>"
}

const textFormats = {
  italic: "<i><i>",
  bold: "<b><b>",
  underline: "<u><u>"
}

const redLine = {
  oneBr: "<br/>",
  twoBr:"<br2>"
}

console.log(redLine, textFormats, textPosition)
const TextEdit: React.FC<TTextEdit> = ({ text }) => {

//  const left = text.includes('<m>');
 text.split('<br/>')
    .map((text, index) => {
      return <p key={index}
        onTouchEnd={e=>e.stopPropagation()}
      >{ 
        text
      }<br/><br/></p>
    })
  
  
  
  
 
  return (
    <div></div>
  )
}
 
export default TextEdit