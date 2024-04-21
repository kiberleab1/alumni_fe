

import {APIProvider, Map} from '@vis.gl/react-google-maps';
import ControlPanel from '../map/control-panel';

const API_KEY = 'AIzaSyDfL0YQGkKzj6C8kIcBpWw8iBQqjQ9p0wQ';

const Maps = () => {
   
  return (
    <APIProvider apiKey={API_KEY}>
    <Map
      defaultZoom={3}
      defaultCenter={{lat: 22.54992, lng: 0}}
      gestureHandling={'greedy'}
      disableDefaultUI={true}
    />
    <ControlPanel />
  </APIProvider>
  )
}

export default Maps;