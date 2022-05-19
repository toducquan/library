import React, { useState, useEffect } from 'react'
import libraryContract from '../Library';
import { Modal, Button } from 'antd';
import 'antd/dist/antd.css';
import ListBook from './ListBook';
const Home = () => {
    const [owner, setOwner] = useState();
    const [customer, setCutomer] = useState();
    const [name, setName] = useState('');
    const [modalChangeNameVisible, setModalChangeNameVisible] = useState(false);
    const [modalAddBookVisible, setModalAddBookVisible] = useState(false);
    const [nameInput, setNameInput] = useState();
    const [bookList, setBookList] = useState([]);
    const [newBook, setNewBook] = useState();

    useEffect(() => {
        getCustomer();
        getOwner();
        getName();
        getListBook();
    }, [])

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            })
            window.ethereum.on('accountsChanged', () => {
                window.location.reload();
            })
        }
    }, [])

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

    const getListBook = async () => {
        const books = await libraryContract.getListBook();
        setBookList(books);
    }

    const addNewBook = () => {
        libraryContract.addBook(newBook.isbn, newBook.title, newBook.author)
            .then(res => {
                setBookList([...bookList, newBook])
                setModalAddBookVisible(false)
            })
            .catch(err => console.log('err: ', err))
    }

    const handleChangeName = async () => {
        libraryContract.setName(nameInput)
            .then(res => {
                libraryContract.on("ChangeName", (data) => {
                    if (data) {
                        console.log('data: ', data)
                        setName(data);
                        setModalChangeNameVisible(false);
                    }
                })
            })
            .catch(err => console.log('err: ', err))
    }

    return (
        <React.Fragment>
            <div className='header'>
                <h3>{name}</h3>
                {
                    (owner?.toLowerCase() == customer?.toLowerCase()) && (
                        <>
                            <Button type='primary' onClick={() => setModalChangeNameVisible(true)}>Rename</Button>
                            <Button type='primary' onClick={() => setModalAddBookVisible(true)}>Add New Book</Button>
                        </>
                    )
                }
            </div>
            <div className='book-list'>
                <ListBook bookList={bookList} />
            </div>
            <Modal title="Basic Modal" visible={modalChangeNameVisible} onOk={() => handleChangeName()} onCancel={() => setModalChangeNameVisible(false)}>
                <label style={{ marginRight: 10 }}>New name</label>
                <input onChange={(e) => setNameInput(e.target.value)}></input>
            </Modal>

            <Modal title="Basic Modal" visible={modalAddBookVisible} onOk={() => addNewBook()} onCancel={() => setModalAddBookVisible(false)}>
                <div>
                    <p style={{ marginRight: 10, width: 200 }}>ISBN</p>
                    <input style={{ width: 400 }} onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}></input>
                </div>
                <div>
                    <p style={{ marginRight: 10 }}>Title</p>
                    <input style={{ width: 400 }} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}></input>
                </div>
                <div>
                    <p style={{ marginRight: 10 }}>Author</p>
                    <input style={{ width: 400 }} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}></input>
                </div>
            </Modal>
        </React.Fragment>
    )
}

export default Home