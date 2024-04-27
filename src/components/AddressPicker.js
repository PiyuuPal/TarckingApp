
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAP_KEY } from '../helper/googleMapKey';



const AddressPicker = ({ placeholderText,fetchAddress }) => {
   
    const selectedLocation=(data,details)=>{
        // console.log('da-- ---',details)
        const lat = details?.geometry?.location?.lat;
        const long = details?.geometry?.location?.lng;
        fetchAddress(lat,long)

    }
    return (

        <View style={styles.container}>
            <GooglePlacesAutocomplete
                placeholder={placeholderText}
                onPress={selectedLocation}
                fetchDetails={true}
                query={{
                    key: GOOGLE_MAP_KEY,
                    language: 'en',
                }}
                styles={{
                    textInputContainer: styles.inputContainer,
                    textInput:styles.textInput
                }}
            />
        </View>
    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputContainer: {
        backgroundColor: 'color',
    },
    textInput:{
        height:48,
        color:'black',
        fontSize:16,
        backgroundColor:'#f3f3f3'
    }
})

export default AddressPicker;