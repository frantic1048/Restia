\version "2.22.1"

main = {
  \drums {
    \numericTimeSignature
    \time 4/4

    <<
      {
        sn16 tomh16 toml16 sn16 toml16 sn16 tommh16 sn16
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