
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import AddressPicker from '../components/AddressPicker';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { showError,showSuccess } from '../helper/helper';



const ChooseLocation = (props) => {
    const navigation = useNavigation();

    const [state, setState] = useState({
        // pickupCords: {},
        // dropLocationCords: {}
        destinationCords: {}
    })
    // const { pickupCords, dropLocationCords } = state;
    const { destinationCords } = state


    // const checkValid = () => {
    //     if (Object.keys(pickupCords).length === 0) {
    //         showError('Please enter your pickup location');
    //         return false;
    //     }
    //     if (Object.keys(dropLocationCords).length === 0) {
    //         showError('Please enter your drop location');
    //         return false;
    //     }
    //     return true;
    // }

    const checkValid = () =>{
        if(Object.keys(destinationCords).length === 0){
            showError('Please enter your destination location')
            return false
        }
        return true
    }

    const handleSubmitFunc = () => {
        const isValid = checkValid();
        // console.log('...isValid...', isValid)
        if (isValid) {
            props?.route?.params?.getCords({
                // pickupCords,
                // dropLocationCords,
                destinationCords
            })
            showSuccess('You can back now..')
            navigation.goBack();
        }

    }

    const handleNextFunc = ()=>{
        navigation.navigate('Information')
    }

    // const fetchAddressCords = (lat, long) => {
    //     setState({
    //         ...state, pickupCords: {
    //             latitude: lat,
    //             longitude: long
    //         }
    //     })
    // }

    const fetchDestinationAddressCords = (lat, long,zipCode, cityText) => {
        console.log("zip code==>>>",zipCode)
        console.log('city texts',cityText)
        setState({
            ...state, 
            // dropLocationCords: {
            //     latitude: lat,
            //     longitude: long
            // }
            destinationCords: {
                latitude: lat,
                longitude: long
            }
        })
    }

    // console.log('pickupCords==',pickupCords);
    // console.log('dropLocationCords==',dropLocationCords);
    // console.log('props===',props)

    return (

        <View style={styles.container}>
            <ScrollView style={styles.scroll} keyboardShouldPersistTaps={'handled'}>
                {/* <AddressPicker placeholderText={'Enter Pickup Location'} fetchAddress={fetchAddressCords} /> */}
                <View style={styles.empView} />
                <AddressPicker placeholderText={'Enter Destination Location'} fetchAddress={fetchDestinationAddressCords} />

                <Button btnText={"Submit"} btnStyle={{ marginTop: 25 }} onPress={handleSubmitFunc} />

                <Button btnText={"Next"} btnStyle={{ marginTop: 25 }} onPress={handleNextFunc} />
            </ScrollView>
        </View>
    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scroll: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20
    },
    empView: {
        marginBottom: 10
    },
})

export default ChooseLocation;