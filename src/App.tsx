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

            //get svg source.
            const serializer = new XMLSerializer();
            let source = serializer.serializeToString(svg);

            //add name spaces.
            if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
                source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
            }
            if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
                source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
            }

            //add xml declaration
            source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

            //convert svg source to URI data scheme.
            var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);

            //set url value to a element's href attribute.
            const a = document.createElement("a")
            a.href = url;
            a.download = 'Output.svg';
            a.innerText = 'a';
            document.body.appendChild(a);
            a.click();
            //you can download svg file by right click menu.
            setTimeout(() => {
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
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
