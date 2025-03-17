import React, { useState, useEffect, useCallback } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import { Screen } from '@/components/screen/screen';
import firestore from '@react-native-firebase/firestore';
import { Proposal, Request } from '../types';
import { ProposalModal } from './components/proposal.modal';
import { useNavigation } from '@react-navigation/native';
import { EmptyListComponent } from './components/empty-list.component';

export const RequestListScreen = () => {
    const navigation = useNavigation();
    const [requests, setRequests] = useState<Request[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

    useEffect(() => {
        const subscriber = firestore()
            .collection('requests')
            .onSnapshot(
                async (querySnapshot) => {
                    const requestList: Request[] = [];
                    for (const doc of querySnapshot.docs) {
                        const requestData = { id: doc.id, ...doc.data() } as Request;
                        const proposalsSnapshot = await firestore()
                            .collection('proposals')
                            .where('requestId', '==', requestData.id)
                            .get();
                        requestData.hasProposal = !proposalsSnapshot.empty;
                        requestList.push(requestData);
                    }
                    setRequests(requestList);
                },
                (error) => {
                    console.error('Error fetching requests:', error);
                },
            );
        return () => subscriber();
    }, []);

    const submitProposal = async (proposal: Proposal) => {
        if (!selectedRequest) return;

        try {
            await firestore().collection('proposals').add({
                requestId: selectedRequest.id,
                price: proposal.price,
                deadline: proposal.deadline,
                comment: proposal.comment,
                createdAt: new Date().toISOString(),
            });
            setSelectedRequest(null);
        } catch (error) {
            console.error('Error submitting proposal:', error);
            throw error;
        }
    };

    const renderRequest = useCallback(
        ({ item }: { item: Request }) => (
            <TouchableOpacity
                style={styles.requestItem}
                onPress={() => setSelectedRequest(item)}
            >
                <Text style={styles.requestTitle}>{item.selectedCategory}</Text>
                <Text style={styles.requestCategory}>{item.description}</Text>
                {item.photoUrl && (
                    <Image
                        source={{ uri: item.photoUrl }}
                        style={styles.requestImage}
                        resizeMode='cover'
                    />
                )}
                {item.hasProposal && (
                    <TouchableOpacity
                        style={styles.rateButton}
                        onPress={() => navigation.navigate('RateRequestScreen', { request: item })}
                    >
                        <Text style={styles.rateButtonText}>Rate This Request</Text>
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        ),
        [requests, navigation],
    );

    return (
        <Screen style={styles.root}>
            <FlatList
                data={requests}
                renderItem={renderRequest}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<EmptyListComponent />}
            />

            <ProposalModal
                visible={!!selectedRequest}
                request={selectedRequest}
                onClose={() => setSelectedRequest(null)}
                onSubmit={submitProposal}
            />
        </Screen>
    );
};

const styles = StyleSheet.create({
    root: {
        paddingHorizontal: 16,
        paddingVertical: 0,
    },
    requestItem: {
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 8,
        borderBottomColor: '#ccc',
        marginTop: 16,
    },
    requestTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    requestCategory: {
        fontSize: 14,
        color: '#666',
    },
    requestImage: {
        width: '100%',
        height: 120,
        marginTop: 8,
        borderRadius: 8,
    },
    rateButton: {
        marginTop: 8,
        padding: 8,
        backgroundColor: 'cornflowerblue',
        borderRadius: 4,
        alignItems: 'center',
    },
    rateButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});