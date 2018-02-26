import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.removeIm = this.removeIm.bind(this, this.props.dto);
    this.rotateIm = this.rotateIm.bind(this);
    this.state = {
      size: 200,
      rotation: 0
    };
  }

  calcImageSize(width) {
    const galleryWidth = width;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const size = (galleryWidth / imagesPerRow);
    this.setState({
      size
    });
  }

  componentDidMount() {
    this.calcImageSize(this.props.galleryWidth);
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  removeIm(dto){
    this.props.removeFunc(dto.id);
  }

  rotateIm(){
    const rotation = this.state.rotation+90;
    if(rotation == 360){
      this.setState({
        rotation: 0
      });
    }else{
      this.setState({
        rotation
      });
    }
  }

  componentWillReceiveProps(props) {
    this.calcImageSize(props.galleryWidth);
  }

  render() {
    return (
      <div
        className="image-root"
        style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size + 'px',
          height: this.state.size + 'px',
          transform: 'rotate('+this.state.rotation+'deg)'
        }}
        >
        <div style={{transform: 'rotate(-'+this.state.rotation+'deg)'}}>
          <FontAwesome className="image-icon" name="sync-alt" title="rotate" onClick={this.rotateIm}/>
          <FontAwesome className="image-icon" name="trash-alt" title="delete" onClick={this.removeIm}/>
          <FontAwesome className="image-icon" name="expand" title="expand"/>
        </div>
      </div>
    );
  }
}

export default Image;