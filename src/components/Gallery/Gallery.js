import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.removeIm = this.removeIm.bind(this);
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth(),
      num_images: 100
    };
  }

  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }

  getImages(tag) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=${this.state.num_images}&format=json&nojsoncallback=1`;
    const baseUrl = 'https://api.flickr.com/';
    axios({
      url: getImagesUrl,
      baseURL: baseUrl,
      method: 'GET'
    })
      .then(res => res.data)
      .then(res => {
        if (
          res &&
          res.photos &&
          res.photos.photo &&
          res.photos.photo.length > 0
        ) {
          this.setState({images: res.photos.photo});
        }
      });
  }

  getMoreImages(){
    if(document.scrollingElement.scrollTop + window.innerHeight >=
      document.body.clientHeight-5){
      const cur_num = this.state.num_images;
      this.setState({num_images: cur_num+10});
      this.getImages(this.props.tag);
      }
  }

  componentDidMount() {
    this.getImages(this.props.tag);
    addEventListener('scroll', this.getMoreImages.bind(this));
    addEventListener('resize', this.updateGalleryWidth.bind(this));
    this.setState({
      galleryWidth: document.body.clientWidth
    });
  }

  componentWillUnmount() {
    removeEventListener('resize', this.updateGalleryWidth.bind(this));
    addEventListener('scroll', this.getMoreImages.bind(this));
  }

  componentWillReceiveProps(props) {
    this.setState({num_images: 100})
    this.getImages(props.tag);
  }

  updateGalleryWidth(){
    this.setState({galleryWidth: document.body.clientWidth})
  }

  removeIm(id) {
    this.setState(prevState => ({
      images: prevState.images.filter(image => image.id != id)
    }));
  }

  render() {
    return (
      <div className='gallery-root'>
        {this.state.images.map(dto => {
          return <Image key={'image-' + dto.id} dto={dto} galleryWidth={this.state.galleryWidth} removeFunc={this.removeIm}/>;
        })}
      </div>
    );
  }
}

export default Gallery;