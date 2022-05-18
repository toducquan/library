import React, { useState, useEffect } from 'react'
import libraryContract from '../Library';
import { Modal, Button } from 'antd';
import 'antd/dist/antd.css';
const Home = () => {
    const [owner, setOwner] = useState();
    const [customer, setCutomer] = useState();
    const [name, setName] = useState('hehh');
    const [modalVisible, setModalVisible] = useState(false);
    const [nameInput, setNameInput] = useState();

    const getCustomer = async () => {
        const currentAccount = await window.ethereum.request({
            method: "eth_requestAccounts"
        })
        setCutomer(currentAccount[0]);
    }

    const getOwner = async () => {
        const ownerLibrary = await libraryContract.owner();
        setOwner(ownerLibrary);
    }

    const getName = async () => {
        const libraryName = await libraryContract.getName();
        setName(libraryName);
    }

    useEffect(() => {
        getCustomer();
        getOwner();
        getName();
    }, [window.ethereum])

    console.log(libraryContract)

    const handleChangeName = async () => {
        libraryContract.setName(nameInput)
        .then(res => console.log('res: ', res))
        .catch(err => console.log('err: ', err))
    }

    return (
        <React.Fragment>
            <div className='header'>
                <h3>{name}</h3>
                <Button type='primary' onClick={() => setModalVisible(true)}>Rename</Button>
            </div>
            <Modal title="Basic Modal" visible={modalVisible} onOk={() => handleChangeName()} onCancel={() => setModalVisible(false)}>
                <p>New name</p>
                <input onChange={(e) => setNameInput(e.target.value)}></input>
            </Modal>
        </React.Fragment>
    )
}

export default Home