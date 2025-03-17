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

export const RequestListScreen = () => {
    const [requests, setRequests] = useState<Request[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

    useEffect(() => {
        const subscriber = firestore()
            .collection('requests')
            .onSnapshot(
                (querySnapshot) => {
                    const requestList: Request[] = [];
                    querySnapshot.forEach((doc) => {
                        requestList.push({
                            id: doc.id,
                            ...doc.data() as Omit<Request, 'id'>,
                        });
                    });
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
            </TouchableOpacity>
        ),
        [requests],
    );

    return (
        <Screen style={styles.root}>
            <FlatList
                data={requests}
                renderItem={renderRequest}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text>No requests found</Text>}
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
});