\version "2.22.1"

main = {
  \drums {
    \tempo 4 = 100
    \numericTimeSignature
    \time 4/4

    <<
      {
        hh8 8 <<hh8 sn8>> hh8 8 8 <<hh8 sn8>> cymc8~
        cymc8 hh8 <<hh8 sn8>> hh8 8 8<<hh8 sn8>> hh8
      }\\{
        bd4 r4 bd8 8 r8 bd8~
        bd8 bd8 r4 bd8 8 r4
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