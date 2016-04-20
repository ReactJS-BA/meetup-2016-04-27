import React, { Component } from 'react';
import { Editor, EditorState, RichUtils, Entity, AtomicBlockUtils, CompositeDecorator } from 'draft-js';

export default class MyEditor extends Component {
  constructor(props) {
    super(props);
    this.onChange = (editorState) => this.setState({editorState});
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.addImage = this.addImage.bind(this);

    const compositeDecorator = new CompositeDecorator([
      {
        strategy: handleLinkStrategy,
        component: handleLink,
      }
    ]);

    this.state = {
      editorState: EditorState.createEmpty(compositeDecorator),
    };
  }

  handleKeyCommand(command) {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  addMedia(type) {
    const src = window.prompt('Enter a URL');
    if (!src) {
      return;
    }

    const entityKey = Entity.create(type, 'IMMUTABLE', { src });

    return AtomicBlockUtils.insertAtomicBlock(
      this.state.editorState,
      entityKey,
      ' '
    );
  }

  addImage() {
    this.onChange(this.addMedia('image'));
  }

  mediaBlockRenderer(block) {
    if (block.getType() === 'atomic') {
      return {
        component: Media,
        editable: false,
      };
    }

    return null;
  }

  render() {
    const {editorState} = this.state;
    return (
      <div className="container">
        <div className="card-panel z-depth-2">
          <Editor
            blockRendererFn={this.mediaBlockRenderer}
            editorState={editorState}
            onChange={this.onChange}
            placeholder="Escribe aquí"
            handleKeyCommand={this.handleKeyCommand}
          />
          <button  className="btn indigo" onClick={this.addImage} >
            Add image
          </button>
        </div>
      </div>
    );
  }
}

const Media = (props) => {
  const entity = Entity.get(props.block.getEntityAt(0));
  const {src} = entity.getData();
  const type = entity.getType();

  let media;

  if (type === 'image') {
    media = <img src={src} className="media" />;
  }

  return media;
};

const handleLink = (props) => {
  return <a {...props} href="#">{props.children}</a>;
};

const URL_REGEX = /^((http|https)(\:\/\/)(www)|www)\.([a-z](\.)|[a-z])+/img;

function handleLinkStrategy(contentBlock, callback) {
  findWithRegex(URL_REGEX, contentBlock, callback);
}

function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}
