import React, { useState, useEffect } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Screen } from '@/components/screen/screen';
import { Button } from '@/components/button/button';
import firestore from '@react-native-firebase/firestore';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import icons from '../../../node_modules/@react-native-vector-icons/ionicons/glyphmaps/Ionicons.json';
import { Request } from '../types';
import Icon from '@react-native-vector-icons/ionicons';

type Props = StaticScreenProps<{
  request: Request;
}>;

export const RateRequestScreen = ({ route }: Props) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [existingRating, setExistingRating] = useState<{ rating: number; comment: string } | null>(null);
    const navigation = useNavigation();
    const { request } = route.params;

    useEffect(() => {
        const checkRating = async () => {
            const ratingsSnapshot = await firestore()
                .collection('ratings')
                .where('requestId', '==', request.id)
                .get();

            if (!ratingsSnapshot.empty) {
                const existing = ratingsSnapshot.docs[0].data() as { rating: number; comment: string };
                setExistingRating(existing);
                setRating(existing.rating);
                setComment(existing.comment || '');
            }
        };

        checkRating();
    }, [request.id]);

    const submitRating = async () => {
        if (!rating || existingRating) return;

        setIsLoading(true);
        try {
            await firestore().collection('ratings').add({
                requestId: request.id,
                rating,
                comment,
                createdAt: new Date().toISOString(),
            });
            navigation.goBack();
        } catch (error) {
            console.error('Error submitting rating:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const isSubmitEnabled = rating > 0 && !isLoading && !existingRating;

    return (
        <Screen style={styles.root}>
            <Text style={styles.title}>Rate This Request</Text>
            <Text>Description: {request.description}</Text>
            <Text>Category: {request.selectedCategory}</Text>
            {request.photoUrl && (
                <Image source={{ uri: request.photoUrl }} style={styles.detailsImage} />
            )}

            <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => {
                    const iconName: keyof typeof icons = star <= rating ? 'star' : 'star-outline';
                    return (
                        <TouchableOpacity
                            key={star}
                            onPress={() => !existingRating && setRating(star)}
                            disabled={!!existingRating}
                        >
                            <Icon
                                name={iconName}
                                size={40}
                                color={star <= rating ? '#FFD700' : '#ccc'}
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>

            <TextInput
                style={styles.input}
                placeholder='Leave a comment (optional)'
                value={comment}
                onChangeText={setComment}
                multiline
                editable={!existingRating}
            />

            <Button
                text='Submit Rating'
                onPress={submitRating}
                preset={isSubmitEnabled ? 'primary' : 'disabled'}
                isLoading={isLoading}
            />
            <Button text='Close' onPress={() => navigation.goBack()} preset='link' />
            {existingRating && (
                <Text style={styles.infoText}>This request has already been rated.</Text>
            )}
        </Screen>
    );
};

const styles = StyleSheet.create({
    root: {
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    detailsImage: {
        width: '100%',
        height: 200,
        marginVertical: 12,
        borderRadius: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 12,
        borderRadius: 4,
        minHeight: 60,
    },
    infoText: {
        marginTop: 12,
        color: '#666',
        textAlign: 'center',
    },
});