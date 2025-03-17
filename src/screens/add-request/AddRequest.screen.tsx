import { Button } from '@/components/button/button';
import { Screen } from '@/components/screen/screen';
import { Picker } from '@react-native-picker/picker';
import Icon from '@react-native-vector-icons/ionicons';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import '@react-native-firebase/app';
import firestore, { collection, getDoc, getFirestore, query, where } from '@react-native-firebase/firestore';

import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native';
import { RequestCategories } from '../types';

// set the host and the port property to connect to the emulator
// set these before any read/write operations occur to ensure it doesn't affect your Cloud Firestore data!


export const AddRequestScreen = () => {

    const navigation = useNavigation();

    const [mediaUri, setMediaUri] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Repair');
    const [isLoading, setIsLoading] = useState(false)

    const categories: RequestCategories[] = ['Repair', 'Cleaning', 'Other'];
    
    const pickImage = async () => {
        const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 });
        if (!result.didCancel && result.assets && result.assets.length > 0) {
            setMediaUri(result.assets[0].uri || null);
        }
    };

    const submit = async () => {
        if (!mediaUri) return
        setIsLoading(true)
        const filename = `photos/${Date.now()}`
        await storage().ref(filename).putFile(mediaUri);
        const photoUrl = await storage().ref(filename).getDownloadURL()

        const ref = firestore().collection('requests');
        await ref.add({
            photoUrl,
            description,
            selectedCategory,
          });

        setIsLoading(false)
        navigation.navigate('RequestListScreen')
    };

    const isSubmitEnable = mediaUri && selectedCategory && description;
    return (
        <Screen
            style={styles.root}
        >
            
            <TextInput
                value={description}
                multiline
                onChangeText={setDescription}
                placeholder='Description'
                style={styles.description}
            />
            {categories.map((category) => (
                <TouchableOpacity
                    key={category}
                    style={styles.radioContainer}
                    onPress={() => setSelectedCategory(category)}
                >
                    <View style={styles.radioCircle}>
                        {selectedCategory === category && <View style={styles.selectedRadio} />}
                    </View>
                    <Text style={styles.radioText}>{category}</Text>
                </TouchableOpacity>
            ))}

            <Button text='Add Photo' onPress={pickImage} preset={'link'} />
            {
                mediaUri && (
                    <View
                    >
                        <Image
                            style={{
                                width: '100%', 
                                height: 240,

                            }} 
                            resizeMode='cover'
                            source={{ uri: mediaUri }}
                        />
                        <TouchableOpacity
                            onPress={() => setMediaUri(null)}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 18,
                                backgroundColor: '#ffffff6f',
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >

                            <Icon
                                name='trash' color={'white'}
                                size={24}
                            />
                        </TouchableOpacity>
                    </View>
                )
            }
            <Button
                isLoading={isLoading}
                text={'Submit'}
                onPress={submit}
                preset={(isSubmitEnable && !isLoading) ? 'primary' : 'disabled'}
            />
        </Screen>
    );
};

const styles = StyleSheet.create({
    root: {
        rowGap: 16,
    },
    description: {
        backgroundColor: 'white',
        padding: 8,
        minHeight: 56,
        borderRadius: 8,
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'cornflowerblue',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    selectedRadio: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: 'cornflowerblue',
    },
    radioText: {
        fontSize: 16,
    },
});
