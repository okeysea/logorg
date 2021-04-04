/** @jsx jsx */
import { jsx, css } from "@emotion/react"
import React, { useState, useCallback, useEffect } from "react"

/* colors */
// [light]0 <----> 9[dark]

const colors = {

"$cGray0":    "#f9f9fa",
"$cGray1":    "#ebeef0",
"$cGray2":    "#dde1e5",
"$cGray3":    "#f9f9fa",
"$cGray4":    "#f9f9fa",
"$cGray5":    "#a9b5bd",
"$cGray6":    "#93a2ac",
"$cGray7":    "#7a8c98",
"$cGray8":    "#5f6e79",
"$cGray9":    "#374147",

"$cBlue0":    "#f5fafd",
"$cBlue1":    "#e1f0fa",
"$cBlue2":    "#cbe4f6",
"$cBlue3":    "#b3d8f1",
"$cBlue4":    "#99caed",
"$cBlue5":    "#7abae7",
"$cBlue6":    "#55a7e1",
"$cBlue7":    "#2a8fd6",
"$cBlue8":    "#2171a9",
"$cBlue9":    "#144263",

"$cIndigo0":  "#f9f9fe",
"$cIndigo1":  "#ebedfb",
"$cIndigo2":  "#dddff9",
"$cIndigo3":  "#cdd0f6",
"$cIndigo4":  "#bcc0f3",
"$cIndigo5":  "#a9aeef",
"$cIndigo6":  "#9299eb",
"$cIndigo7":  "#7780e7",
"$cIndigo8":  "#525de0",
"$cIndigo9":  "#212ca9",

"$cViolet0":  "#fbf8fe",
"$cViolet1":  "#f2ebfb",
"$cViolet2":  "#e8dcf9",
"$cViolet3":  "#ddccf6",
"$cViolet4":  "#d1baf3",
"$cViolet5":  "#c4a5ef",
"$cViolet6":  "#b48eeb",
"$cViolet7":  "#a171e5",
"$cViolet8":  "#8648de",
"$cViolet9":  "#511e99",

"$cFuschia0": "#fdf8fe",
"$cFuschia1": "#f9e8fb",
"$cFuschia2": "#f5d7f8",
"$cFuschia3": "#f0c5f5",
"$cFuschia4": "#ebb0f1",
"$cFuschia5": "#e597ec",
"$cFuschia6": "#de79e7",
"$cFuschia7": "#d350e0",
"$cFuschia8": "#b426c2",
"$cFuschia9": "#6b1773",

"$cPink0":    "#fef8fb",
"$cPink1":    "#fbe9f3",
"$cPink2":    "#f8d8eb",
"$cPink3":    "#f5c6e1",
"$cPink4":    "#f1b1d6",
"$cPink5":    "#ed99ca",
"$cPink6":    "#e77cbb",
"$cPink7":    "#e054a6",
"$cPink8":    "#c52784",
"$cPink9":    "#76174f",

"$cRed0":     "#fef8f9",
"$cRed1":     "#fbe9eb",
"$cRed2":     "#f8d9dc",
"$cRed3":     "#f5c8cb",
"$cRed4":     "#f2b4b9",
"$cRed5":     "#ed9da4",
"$cRed6":     "#e9828a",
"$cRed7":     "#e25d68",
"$cRed8":     "#ce2936",
"$cRed9":     "#7b1820",

"$cOrange0":  "#fdf9f5",
"$cOrange1":  "#faebe1",
"$cOrange2":  "#f6dcca",
"$cOrange3":  "#f1ccb1",
"$cOrange4":  "#ecba96",
"$cOrange5":  "#e6a576",
"$cOrange6":  "#e08c50",
"$cOrange7":  "#d16f29",
"$cOrange8":  "#a55721",
"$cOrange9":  "#613313",

"$cYellow0":  "#fbfaeb",
"$cYellow1":  "#f4f0c0",
"$cYellow2":  "#ebe490",
"$cYellow3":  "#e1d659",
"$cYellow4":  "#d5c72a",
"$cYellow5":  "#c2b626",
"$cYellow6":  "#ada222",
"$cYellow7":  "#958b1d",
"$cYellow8":  "#756e17",
"$cYellow9":  "#45400e",

"$cLime0":    "#f5fced",
"$cLime1":    "#e1f5c5",
"$cLime2":    "#c9ec98",
"$cLime3":    "#aee364",
"$cLime4":    "#90d82b",
"$cLime5":    "#84c527",
"$cLime6":    "#76b023",
"$cLime7":    "#65971e",
"$cLime8":    "#507718",
"$cLime9":    "#2f460e",

"$cGreen0":   "#f2fcf1",
"$cGreen1":   "#d4f7d1",
"$cGreen2":   "#b3f0ad",
"$cGreen3":   "#8ae881",
"$cGreen4":   "#57de4a",
"$cGreen5":   "#37ce29",
"$cGreen6":   "#31b824",
"$cGreen7":   "#2a9e1f",
"$cGreen8":   "#217d19",
"$cGreen9":   "#14490f",

"$cTeal0":    "#f0fcf5",
"$cTeal1":    "#d0f7e0",
"$cTeal2":    "#abf0c8",
"$cTeal3":    "#7ee8aa",
"$cTeal4":    "#45de85",
"$cTeal5":    "#29cd6d",
"$cTeal6":    "#24b762",
"$cTeal7":    "#1f9d54",
"$cTeal8":    "#197c42",
"$cTeal9":    "#0e4927",

"$cCyan0":    "#effcfb",
"$cCyan1":    "#ccf6f2",
"$cCyan2":    "#a3eee8",
"$cCyan3":    "#71e6dc",
"$cCyan4":    "#2fdacc",
"$cCyan5":    "#27c7ba",
"$cCyan6":    "#23b2a7",
"$cCyan7":    "#1e998f",
"$cCyan8":    "#187971",
"$cCyan9":    "#0e4742",

///* main palette */
//"$cBase":        "$cGray0",
//"$cSub":         "#2b90d9",
//"$cAccent":      "#282c37",
//"$cAccent2":     "#d9e1e8",
//"$cAccent3":     "#9baec8",
///* fonts */
//"$cFontDark":    "$cAccent",
//"$cFontLight":   "$cBase",
//"$cFontVisited": "lighten($cFontDark, 25%)",
//
//"$cEdit":    "$cSub",
//"$cDelete":  "$cRed7",
//
//"$cFontEdit":    "$cSub",
//"$cFontDelete":    "$cRed7",
}

const palettes = Object.keys(colors).map((value)=>{
  return (
    <div
      css={ css({
        backgroundColor: colors[value],
        flex: "1",
      })}
    >value: {colors[value]}</div>
  )
});

type Props = {
}

const ColorPalette: React.FC<Props> = props => {
  return (
    <div css={css({ display: "flex", flexDirection: "row", flexWrap: "wrap"})}>
      {palettes}
    </div>
  )
}

export default ColorPalette
