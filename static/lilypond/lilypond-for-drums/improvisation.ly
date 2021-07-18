\version "2.22.1"

main = {
  \drums {
    \tempo 4 = 100
    \numericTimeSignature
    \time 4/4

    <<
      {
        hh 8 8 8 8
        \improvisationOn
        sn4. 8~
        4. 8~ 4. 8
        \improvisationOff
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