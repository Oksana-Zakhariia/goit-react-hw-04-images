import { ImageGallery } from 'components/ImageGallery/ImageGallery';
import { Searchbar } from 'components/Searchbar/Searchbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchImages } from 'components/services/fetch';
import { Loader } from 'components/Loader/Loader';
import { Modal } from 'components/Modal/Modal';
import { Button } from 'components/Button/Button';
import { Container } from './App.styled';
import { useState } from 'react';
import { useEffect } from 'react';

// export class App extends Component {
//   state = {
//     name: '',
//     images: [],
//     page: 1,
//     error: null,
//     loading: false,
//     modalURL: '',
//     showLoadButton: false,
//   };

//   handleFormSubmit = name => {
//     this.setState({
//       name,
//       images: [],
//       page: 1,
//     });
//   };
//   handleModalUrl = largeImageUrl => {
//     this.setState({ modalURL: largeImageUrl });
//   };
//   onCloseModal = () => {
//     this.setState({ modalURL: '' });
//   };
//   isLoadMore = () => {
//     this.setState(prevState => ({
//       page: prevState.page + 1,
//     }));
//   };
//   async componentDidUpdate(_, prevState) {
//     const { name, page } = this.state;
//     if (prevState.name !== name || prevState.page !== page)
//       try {
//         this.setState({ loading: true, error: null });
//         const response = await fetchImages({ page, name });
//         const pictures = response.hits;
//         if (pictures.length === 0) {
//           toast.error('There is no images with such params', {
//             theme: 'colored',
//           });
//         }
//         this.setState(prevState => ({
//           images: [...prevState.images, ...pictures],
//           showLoadButton: page < Math.ceil(response.totalHits / 12),
//         }));

//         // if (prevState.name !== name) {
//         //   this.setState({
//         //     images: [...pictures],
//         //   });
//         // }
//         // if (page === Math.ceil(response.totalHits / 12)) {
//         //   this.setState({ showLoadButton: false });
//         // }
//       } catch (error) {
//         this.setState({ error: 'We have some problems with loading...' });
//       } finally {
//         this.setState({ loading: false });
//       }
//   }

//   render() {
//     const { error, loading, images, showLoadButton, modalURL } = this.state;
//     return (
//       <Container>
//         <Searchbar onSubmit={this.handleFormSubmit}></Searchbar>
//         {error && <h2>{error}</h2>}
//         {loading && <Loader></Loader>}
//         {modalURL && (
//           <Modal onClose={this.onCloseModal}>
//             <img src={modalURL} alt="" />
//           </Modal>
//         )}
//         <ToastContainer autoClose={3000} />
//         <ImageGallery
//           items={images}
//           onClick={this.handleModalUrl}
//         ></ImageGallery>
//         {showLoadButton && (
//           <Button onClick={this.isLoadMore}>Load more...</Button>
//         )}
//       </Container>
//     );
//   }
// }
export function App() {
  const [name, setName] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalUrl, setModalUrl] = useState('');
  const [showLoadButton, setShowLoadButton] = useState(false);
  const handleFormSubmit = name => {
    setName(name);
    setImages([]);
    setPage(1);
  };
  const handleModalUrl = largeImageUrl => {
    setModalUrl(largeImageUrl);
  };
  const onCloseModal = () => {
    setModalUrl('');
  };
  const isLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };
  useEffect(() => {
    async function findImage() {
      try {
        setLoading(true);
        setError(null);
        if (name === '') {
          return;
        }
        const response = await fetchImages({ name, page });
        const pictures = response.hits;
        if (pictures.length === 0) {
          toast.error('There is no images with such params', {
            theme: 'colored',
          });
        }
        if (page === Math.ceil(response.totalHits / 12)) {
          setShowLoadButton(false);
        }
        setImages(prevImages => [...prevImages, ...pictures]);
        setShowLoadButton(page < Math.ceil(response.totalHits / 12));
      } catch (error) {
        setError('We have some problems with loading...');
      } finally {
        setLoading(false);
      }
    }
    findImage();
  }, [name, page]);
  return (
    <Container>
      <Searchbar onSubmit={handleFormSubmit}></Searchbar>
      {error && <h2>{error}</h2>}
      {loading && <Loader></Loader>}
      {modalUrl && (
        <Modal onClose={onCloseModal}>
          <img src={modalUrl} alt="" />
        </Modal>
      )}
      <ToastContainer autoClose={3000} />
      <ImageGallery items={images} onClick={handleModalUrl}></ImageGallery>
      {showLoadButton && <Button onClick={isLoadMore}>Load more...</Button>}
    </Container>
  );
}
