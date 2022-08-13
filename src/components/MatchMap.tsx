import React from "react";
import { View, StyleSheet } from "react-native";
import MapView, {Marker} from "react-native-maps";
import BackgroundGeolocation, {
    Location
} from "react-native-background-geolocation";
import { Text } from "react-native-elements";
import { COLORS } from "../constants/Colors";

const LATITUDE_DELTA = 0.00922;
const LONGITUDE_DELTA = 0.00421;
const DEFAULT_LATITUDE = 21.028511
const DEFAULT_LONGITUDE = 105.804817

export default function MatchMap() {
    const [mapCenter, setMapCenter] = React.useState({
        latitude: DEFAULT_LATITUDE,
        longitude: DEFAULT_LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
    });
    

    const [location, setLocation] = React.useState<Location>(null as any);
    const [markers, setMarkers] = React.useState<any[]>([]);
    const [tracksViewChanges, setTracksViewChanges] = React.useState(false);
    const [coordinates, setCoordinates] = React.useState<any[]>([]);

    const subscriptions:any[] = [];

    const subscribe = (subscription:any) => {
        subscriptions.push(subscription);
    }
    React.useEffect(() => {
        // All BackgroundGeolocation event-listeners use React.useState setters.
        subscribe(BackgroundGeolocation.onLocation(setLocation, (error) => {
          console.warn('[onLocation] ERROR: ', error);
        }));
    });

    React.useEffect(() => {
        if (!location) return;
        onLocation();
    }, [location]);

    const onLocation = () => {
        console.log('[location] - ', location);
        if (!location.sample) {
          addMarker(location);
        }
        setCenter(location);
    }

    const addMarker = (location:Location) => {
        const timestamp = new Date();
        const marker = {
            key: `${location.uuid}:${timestamp.getTime()}`,
            title: location.timestamp,
            heading: location.coords.heading,
            coordinate: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            }
        };
        setMarkers(previous => [...previous, marker]);
            setCoordinates(previous => [...previous, {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        }]);
    }
    const setCenter = (location:Location) => {
        setMapCenter({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        });
    }

      /// MapView Location marker-renderer.
  const renderMarkers = () => {
    let rs:any = [];
    markers.map((marker:any) => {
      rs.push((
        <Marker
          key={marker.key}
          tracksViewChanges={tracksViewChanges}
          coordinate={marker.coordinate}
          anchor={{x:0, y:0.1}}
          title={marker.title}>
          <View style={[styles.markerIcon]}></View>
        </Marker>
      ));
    });
    return rs;
  }

  return (
      <MapView
          style={styles.map}
          region={mapCenter}>
          {renderMarkers()}
      </MapView>
  );
}

var styles = StyleSheet.create({
    container: {
      backgroundColor: '#272727'
    },
    map: {
      flex: 1
    },
    markerIcon: {
        borderWidth:1,
        borderColor:'#000000',
        backgroundColor: COLORS.polyline_color,
        //backgroundColor: 'rgba(0,179,253, 0.6)',
        width: 10,
        height: 10,
        borderRadius: 5
      }
  });
