import * as React from 'react';
import SplitPane, { Pane } from 'react-split-pane';
import './split-pane.css'
import copyGlyphs from './copy-glyphs';
/*
      \xymatrix {
E\ar[r]^-{\text{eq}}&X\ar@<0.5ex>[r]^-{f}\ar@<-0.5ex>[r]_-{g}&Y\\
O\ar@{.>}[u]^-{u}\ar[ur]_-{m}\ar@{}@<2.5ex>[ur]
      }
{\prod^{\phantom{A}}} */
const App: React.FC<{}> = () => {
  const [timerId, setTimerId] = React.useState(null);
  const refTextarea = React.useRef<HTMLTextAreaElement>();
  const refDiv = React.useRef<HTMLDivElement>();
  const updater = React.useCallback(() => {
    refDiv.current.innerText = `\\[${refTextarea.current.value}\\]`;
    MathJax.Hub.Typeset(refDiv.current, () => console.log('done'));
  }, []);

  return (
    <SplitPane split="horizontal" defaultSize="50%">
      <Pane>
        <textarea
          ref={refTextarea}
          style={{ display: 'block', height: 'calc(100% - 2em - 10px)', width: '100%', fontFamily: '"Fira Code", "Courier New", Courier, monospace', fontVariantLigatures: 'none' }}
          onChange={e => {
            clearTimeout(timerId);
            setTimerId(setTimeout(() => {
              setTimerId(null);
              updater();
            }, 500));
          }}
        ></textarea>
        <button
          style={{ display: 'block', width: '100%', height: '2em' }}
          onClick={() => {
            const [glyphs, svg] = document.getElementsByTagName('svg');
            if (!svg) {
              return;
            }

            copyGlyphs(glyphs, svg);

            const serializer = new XMLSerializer();
            const source = `\
<?xml version="1.0" standalone="yes"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
${serializer.serializeToString(svg)}`;

            const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);
            const a = document.createElement("a")
            a.href = url;
            a.download = 'Output.svg';
            a.innerText = 'a';
            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
              document.body.removeChild(a);
            }, 0);
          }}
        >Save</button>
      </Pane>
      <Pane>
        <div ref={refDiv}></div>
      </Pane>
    </SplitPane>
  );
};

export default App;
