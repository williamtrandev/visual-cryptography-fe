import { Children, useState } from 'react'
import { Stage, Layer } from 'react-konva';
import './index.css';
import DraggableImage from './components/DragableImage';
import StaticImage from './components/StaticImage';

function App() {
  const [imageBinary, setImageBinary] = useState('your-image-goes-here.jpg');
  const [imageBinarySubmit, setImageBinarySubmit] = useState(null);
  const [imageColor, setImageColor] = useState('your-image-goes-here.jpg');
  const [imageColorSubmit, setImageColorSubmit] = useState(null);
  const [share1Binary, setShare1Binary] = useState('your-image-goes-here.jpg');
  const [share2Binary, setShare2Binary] = useState('your-image-goes-here.jpg');
  const [share1Color, setShare1Color] = useState('your-image-goes-here.jpg');
  const [share2Color, setShare2Color] = useState('your-image-goes-here.jpg');
  const [reconstructImage, setReconstructImage] = useState('your-image-goes-here.jpg');
  const onImageChange = (event, setImageFunc, setImageSubmitFunc) => {
    if (event.target.files && event.target.files[0]) {
      setImageFunc(URL.createObjectURL(event.target.files[0]));
      setImageSubmitFunc(event.target.files[0]);
    }
  };
  const getShares = (image, imageType) => {
    console.log('called')
    const formData = new FormData();
    formData.append('image', image);
    formData.append('image_type', imageType);
    fetch('http://localhost:8000/api/v1/encrypt', {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        if(imageType == 'binary') {
          setShare1Binary(data.share1);
          setShare2Binary(data.share2);
        } else {
          setShare1Color(data.share1);
          setShare2Color(data.share2);
        }
        
      })
      .catch(err => {
        console.log(err);
      }); 
  }
  const getCombineImage = () => {
    fetch('http://localhost:8000/api/v1/decrypt', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        share1: share1Color,
        share2: share2Color,
      }),
    })
      .then(res => res.json())
      .then(data => {
        setReconstructImage(data.reconstructed_image);
      })
      .catch(err => {
        console.log(err);
      }); 
  }
  return (
    <div className="flex flex-col justify-center items-center p-4">
      <div className="text-4xl font-bold mb-6">Demo</div>
      <div className="text-2xl mb-3">Binary Image</div>
      <div className="mb-6 border-2 border-violet-500 rounded-full">
        <input type="file" className="file:rounded-l-full file:border-0
          file:py-2 file:px-4 file:font-semibold mr-2 
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100"
          onChange={(e) => onImageChange(e, setImageBinary, setImageBinarySubmit)}
        />
        <button className="bg-violet-700 hover:bg-opacity-75 text-white py-2 px-4 rounded-r-full" onClick={() => getShares(imageBinarySubmit, 'binary')}>Submit</button>
      </div>
      <div className="mb-6 border-2 border-violet-500">
        <div className="py-1 px-2">Binary image</div>
        <img src={imageBinary} alt="image" className="max-h-[40vh] object-contain" />
      </div>
      <div id="gray-container" className="mb-8 border-2 border-violet-500">
        <div className="py-1 px-2">Shares</div>
        <div>
          <Stage width={window.innerWidth * 0.8 + 10} height={innerHeight} >
            <Layer>
              <StaticImage
                src={share1Binary != 'your-image-goes-here.jpg' ? `data:image/jpeg;base64,${share1Binary}` : 'your-image-goes-here.jpg' } 
                width={window.innerWidth * 0.8 / 2}
              />
              <DraggableImage
                src={share2Binary != 'your-image-goes-here.jpg' ? `data:image/jpeg;base64,${share2Binary}` : 'your-image-goes-here.jpg' }
                width={window.innerWidth * 0.8 / 2}
                stageWidth={window.innerWidth * 0.8 + 10}
              />
            </Layer>
          </Stage>
        </div>
      </div>

      <div className="text-2xl mb-3">Color Image</div>
      <div className="mb-6 border-2 border-violet-500 rounded-full">
        <input type="file" className="file:rounded-l-full file:border-0
          file:py-2 file:px-4 file:font-semibold mr-2 
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100"
          onChange={(e) => onImageChange(e, setImageColor, setImageColorSubmit)}
        />
        <button className="bg-violet-700 hover:bg-opacity-75 text-white py-2 px-4 rounded-r-full" onClick={() => getShares(imageColorSubmit, 'color')}>Submit</button>
      </div>
      <div className="mb-6 border-2 border-violet-500">
        <div className="py-1 px-2">Color image</div>
        <img src={imageColor} alt="image" className="max-h-[40vh] object-contain" />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border-2 border-violet-500">
          <div className="py-1 px-2">Share 1</div>
          <img src={share1Color != 'your-image-goes-here.jpg' ? `data:image/jpeg;base64,${share1Color}` : 'your-image-goes-here.jpg'} alt="share1" className="object-contain" />
        </div>
        <div className="border-2 border-violet-500">
          <div className="py-1 px-2">Share 2</div>
          <img src={share2Color != 'your-image-goes-here.jpg' ? `data:image/jpeg;base64,${share2Color}` : 'your-image-goes-here.jpg'} alt="share2" className="object-contain" />
        </div>
      </div>
      <div className="mb-6">
        <button className="bg-violet-700 hover:bg-opacity-75 text-white py-2 px-4 rounded-full" onClick={getCombineImage}>Reconstruct original image</button>
      </div>
      <div className="border-2 border-violet-500">
        <div className="py-1 px-2">Reconstructed Image</div>
        <img src={reconstructImage != 'your-image-goes-here.jpg' ? `data:image/jpeg;base64,${reconstructImage}` : 'your-image-goes-here.jpg'} alt="reconstruct_image" className="max-h-[40vh] object-contain" />
      </div>
    </div>
  )
}

export default App
