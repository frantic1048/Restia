\version "2.22.1"

main = {
  \drums {
    \tempo 4 = 100
    \numericTimeSignature
    \time 4/4

    <<
      {
        sn4^"L" 4^"R" 4_"L" 4_"R"
        16^"L" 16^"R" 8^"L" 8^"L" 16^"L" 16^"R"
        16_"L" 8_"R" 16_"R" r16 sn16_"R" 16_"L" 16_"R"
      }\\{}
    >>
  }
}

\score {
  \main
  \layout {}
}

\score {
  % https://lilypond.org/doc/v2.20/Documentation/notation/using-repeats-with-midi
  \unfoldRepeats {
    \main
  }
  \midi {}
}