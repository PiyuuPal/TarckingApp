import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import images from '../assets/images';

import { GOOGLE_MAP_KEY } from '../helper/googleMapKey';
import { getCurrentLocation, locationPermission } from '../helper/helper';
import Loader from '../components/Loader';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;




const Home = ({ navigation }) => {

    const mapRef = useRef();
    const markerRef = useRef();

    const [state, setState] = useState({
        startingCords: {
            latitude: 30.7046,
            longitude: 76.7179,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        },
        destinationCords: {},
        // destinationCords: {
        //     latitude: 30.7333,
        //     longitude: 76.7794,
        //     latitudeDelta: 0.0922,
        //     longitudeDelta: 0.0421,
        // },
        isLoading: false,
        coordinate: new AnimatedRegion({
            latitude: 30.7046,
            longitude: 77.1025,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        }),
        time: 0,
        distance: 0,
        heading: 0
    })

    const { startingCords, destinationCords, coordinate, time, distance, isLoading, heading } = state;
    const updateState = (data) => setState((state) => ({ ...state, ...data }));
    // console.log('updateState==', updateState)



    useEffect(() => {
        getLiveLocation()
    }, [])

    const getLiveLocation = async () => {
        const locPermissionDenied = await locationPermission()
        if (locPermissionDenied) {
            const { latitude, longitude, heading } = await getCurrentLocation()
            console.log("get live location after 4 second", heading)
            animate(latitude, longitude);
            updateState({
                heading: heading,
                startingCords: { latitude, longitude },
                coordinate: new AnimatedRegion({
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                })
            })
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            getLiveLocation()
        }, 10000);
        return () => clearInterval(interval)
    }, [])



    const handleLocationFunc = () => {
        navigation.navigate('ChooseLocation', { getCords: fetchValues })
    }



    const fetchValues = (data) => {
        console.log(' data', data)
        // setState({
        //     startingCords: {
        //         latitude: data?.pickupCords?.latitude,
        //         longitude: data?.pickupCords?.longitude,
        //     },
        //     destinationCords: {
        //         latitude: data?.dropLocationCords?.latitude,
        //         longitude: data?.dropLocationCords?.longitude,
        //     },
        // })
        updateState({
            destinationCords: {
                latitude: data.destinationCords.latitude,
                longitude: data.destinationCords.longitude,
            }
        })
    }


    const animate = (latitude, longitude) => {
        const newCoordinate = { latitude, longitude };
        if (Platform.OS == 'android') {
            if (markerRef.current) {
                markerRef.current.animateMarkerToCoordinate(newCoordinate, 7000);
            }
        } else {
            coordinate.timing(newCoordinate).start();
        }
    }

    const onCenter = () => {
        mapRef.current.animateToRegion({
            latitude: startingCords.latitude,
            longitude: startingCords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        })
    }

    const fetchTime = (d, t) => {
        updateState({
            distance: d,
            time: t
        })
    }


    return (

        <View style={styles.container}>
            {distance !== 0 && time !== 0 && (<View style={styles.recordView}>
                <Text style={styles.recordText}>Time left: {time.toFixed(0)} min. </Text>
                <Text style={styles.recordText}>Distance left: {distance.toFixed(0)} km.</Text>
            </View>)}
            <View style={styles.mapContainer}>
                <MapView style={StyleSheet.absoluteFill}
                    // initialRegion={startingCords}
                    initialRegion={{
                        ...startingCords,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }}
                    ref={mapRef}
                >
                    {/* <Marker coordinate={startingCords}  image={images.icgreenlocation} /> */}
                    <Marker.Animated
                        ref={markerRef}
                        coordinate={coordinate}
                    >
                        <Image
                            source={images.bike}
                            style={{
                                width: 40,
                                height: 40,
                                transform: [{ rotate: `${heading}deg` }]
                            }}
                            resizeMode="contain"
                        />
                    </Marker.Animated>
                    {/* <Marker coordinate={destinationCords} /> */}
                    {Object.keys(destinationCords).length > 0 && (<Marker
                        coordinate={destinationCords}
                        image={images.greenMarker}
                    />)}

                    {Object.keys(destinationCords).length > 0 && (<MapViewDirections
                        origin={startingCords}
                        destination={destinationCords}
                        apikey={GOOGLE_MAP_KEY}
                        strokeWidth={6}
                        strokeColor="red"
                        optimizeWaypoints={true}
                        onStart={(params) => {
                            Alert.alert(
                                'Live Cords...', 
                                `After getting current lat long then,\nStarted routing between..,\n"${params.origin}" and "${params.destination}"`
                              );
                        }}
                        onReady={result => {
                            console.log(`Distance: ${result.distance} km`)
                            console.log(`Duration: ${result.duration} min.`)
                            fetchTime(result.distance, result.duration),
                                mapRef.current.fitToCoordinates(result.coordinates, {
                                    edgePadding: {
                                        // right: 30,
                                        // bottom: 300,
                                        // left: 30,
                                        // top: 100,
                                    },
                                });
                        }}
                        onError={(errorMessage) => {
                            // console.log('GOT AN ERROR');
                        }}
                    />)}

                </MapView>
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0
                    }}
                    onPress={onCenter}
                >
                    <Image source={images.greenIndicator} />
                </TouchableOpacity>
            </View>
            <View style={styles.bottomCard}>
                <TouchableOpacity style={styles.btn} onPress={handleLocationFunc}>
                    <Text style={styles.btnText}>Choose Location</Text></TouchableOpacity>
            </View>
            <Loader isLoading={isLoading} />
        </View>
    )

}



const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    mapContainer: {
        flex: 1
    },
    bottomCard: {
        width: '100%',
        backgroundColor: 'white',
        padding: 30,
        borderTopStartRadius: 20,
        borderTopEndRadius: 20
    },
    btn: {
        borderWidth: 1,
        padding: 10,
        marginTop: 10,
        borderRadius: 8

    },
    btnText: {
        textAlign: 'center'
    },
    recordView: {
        shadowColor: '#171717',
        shadowOpacity: 0.2,
        shadowRadius: 3,
        alignItems: 'center', marginVertical: 16,
         backgroundColor: '#f3f3f3', 
         borderRadius: 5,
        elevation:4,
        padding:10,
        marginHorizontal:10

    },
    recordText:{
        fontSize:16,
        color:'black'

    }
})


export default Home;


