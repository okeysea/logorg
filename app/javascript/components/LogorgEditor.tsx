import React from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState} from 'draft-js';
import 'draft-js/dist/Draft.css'

type logorgEditorProps = {};
type logorgEditorState = { editorState: EditorState };

class LogorgEditor extends React.Component<logorgEditorProps, logorgEditorState> {
  private onChange;
  private setLogorgEditorRef;
  private logorgEditor;
  private focus;
  private logState;

  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = editorState => this.setState({editorState});
    this.setLogorgEditorRef = ref => this.logorgEditor = ref;
    this.focus = () => this.logorgEditor.focus();
    this.logState = () => console.log(this.state.editorState.toJS());
  }

  componentDidMount() {
    this.logorgEditor.focus();
  }

  render() {
    return (
      <div style={this.styles.root}>
        <div style={this.styles.editor} onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            ref={this.setLogorgEditorRef}
          />
        </div>
        <input
          onClick={this.logState}
          style={this.styles.button}
          type="button"
          value="log State"
        />
      </div>
    );
  }

  readonly styles = {
    root: {
      padding: 20,
      width: 600,
    },
    editor: {
      border: '1px solid #ccc',
      cursor: 'text',
      minHeight: 80,
      padding: 10,
    },
    button: {
      marginTop: 10,
      textAlign: 'center' as const,
    }
  };
}
export default LogorgEditor
