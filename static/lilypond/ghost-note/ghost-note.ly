\version "2.22.2"

% http://lilypond.org/doc/v2.22/Documentation/notation/enhancing-midi-output
\include "articulate.ly"

\void #(begin
        (define frantic1048-drumstyle
          (hash-table->alist drums-style))
        (assoc-set! frantic1048-drumstyle 'hightom '(default #f 3))
        (assoc-set! frantic1048-drumstyle 'hihat '(cross #f 5))
        (assoc-set! frantic1048-drumstyle 'openhihat '(cross "open" 5))
        (assoc-set! frantic1048-drumstyle 'closedhihat '(cross "stopped" 5))
        (assoc-set! frantic1048-drumstyle 'halfopenhihat '(xcircle #f 5))
        (assoc-set! frantic1048-drumstyle 'ridecymbal '(cross #f 4))
        (assoc-set! frantic1048-drumstyle 'ridecymbala '(cross #f 4))
        (assoc-set! frantic1048-drumstyle 'ridecymbalb '(cross #f 2))
        (set! frantic1048-drumstyle (alist->hash-table frantic1048-drumstyle))
        )

\paper {
  #(define fonts
     (set-global-fonts
      #:roman "Noto Serif CJK SC"
      #:sans "Noto Sans CJK SC"
      ))
}

ghost = #(define-scheme-function
          (note)
          (ly:music?)
          #{
            % midi-extra-velocity (integer)
            % How much louder or softer should this note be in MIDI output? The default is 0.
            % http://lilypond.org/doc/v2.22/Documentation/internals/music-properties
            <\parenthesize #note \omit #(make-articulation "accent" 'midi-extra-velocity -50)>
          #}
          )

main = {
  \drums {
    \repeat volta 2 {
      <>^"LilyPond \parenthize"
      <<
        {
          hh8 hh <<hh sn>> hh16 \parenthesize sn16 hh16 <<\parenthesize sn16 tomh16>> hh8 <<hh sn>> hh16 \parenthesize sn16
        }\\{
          bd4 r bd r
        }
      >>

      <>^"Custom \ghost function"
      <<
        {
          hh8 hh <<hh sn>> hh16 \ghost sn16 hh16 <<\ghost sn16 tomh16>> hh8 <<hh sn>> hh16 \ghost sn16
        }\\{
          bd4 r bd r
        }
      >>
    }
  }
}

\score {
  \main
  \layout {
    \context {
      \DrumVoice {
        \set drumStyleTable = #frantic1048-drumstyle
      }
    }
  }
}

\score {
  \articulate \main
  \midi {}
}