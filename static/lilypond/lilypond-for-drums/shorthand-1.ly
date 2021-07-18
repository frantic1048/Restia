\version "2.22.1"

main = {
  \drums {
    \numericTimeSignature
    \time 4/4

    <<
      {
        sn8 sn16 sn16 sn16 sn16 sn8
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