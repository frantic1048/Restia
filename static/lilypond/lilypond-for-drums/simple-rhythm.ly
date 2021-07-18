\version "2.22.1"

main = {
  \drums {
    \tempo 4 = 100
    \numericTimeSignature
    \time 4/4

    <<
      {
        hh8 hh8 <<hh8 sn8>> hh8 hh8 hh8 <<hh8 sn8>> hh8
      }\\{
        bd4 r4 bd4 r4
      }
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